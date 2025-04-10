import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  fetchSignInMethodsForEmail,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Successfully logged in",
        description: "Welcome back!",
        variant: "default",
      });
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Failed to log in. Please try again.";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password.";
      }
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName: name });
      toast({
        title: "Account Created",
        description: "Welcome!",
        variant: "default",
      });
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Failed to create an account. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email is already in use.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
        variant: "default",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage =
        "Failed to send password reset email. Please try again.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with that email address.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };
  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, login, signup, logout, resetPassword }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

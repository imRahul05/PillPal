// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Lock, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
  const { currentUser, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingStates, setLoadingStates] = useState({
    isLoadingRegular: false,
    isLoadingGuest: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !error) {
      setLoadingStates({
        isLoadingRegular: false,
        isLoadingGuest: false,
      });
      navigate("/dashboard");
    }

    return () => {
      setLoadingStates({
        isLoadingRegular: false,
        isLoadingGuest: false,
      });
    };
  }, [currentUser, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoadingStates((prev) => ({ ...prev, isLoadingRegular: true }));

    try {
      await login(email, password);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in. Please check your credentials.");
      setLoadingStates((prev) => ({ ...prev, isLoadingRegular: false }));
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    setLoadingStates((prev) => ({ ...prev, isLoadingGuest: true }));

    try {
      await login("demo@example.com", "demo@example.com");
    } catch (err) {
      console.error("Guest login error:", err);
      setError("Failed to sign in as a guest. Please try again.");
      setLoadingStates((prev) => ({ ...prev, isLoadingGuest: false }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 dark:border-gray-800 shadow-glass">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to your PillPal account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-primary hover:underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full rounded-lg"
                  disabled={
                    loadingStates.isLoadingRegular ||
                    loadingStates.isLoadingGuest
                  }
                >
                  {loadingStates.isLoadingRegular ? "Signing in..." : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-lg flex items-center justify-center gap-2"
                  onClick={handleGuestLogin}
                  disabled={
                    loadingStates.isLoadingRegular ||
                    loadingStates.isLoadingGuest
                  }
                >
                  <User className="h-4 w-4" />
                  {loadingStates.isLoadingGuest
                    ? "Signing in..."
                    : "Sign in as a Guest"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:underline underline-offset-4 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

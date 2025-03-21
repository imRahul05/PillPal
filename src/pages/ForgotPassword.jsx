import { useState ,useEffect} from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword ,currentUser} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-md">
          <Card className="border-gray-200 dark:border-gray-800 shadow-glass">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Reset your password</CardTitle>
              <CardDescription>
                Enter your email address and we'll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-md text-sm space-y-3">
                  <p className="font-medium">Reset link sent!</p>
                  <p>
                    Please check your email for instructions on how to reset your password.
                    If you don't see it within a few minutes, check your spam folder.
                  </p>
                  <p>
                    <Link to="/login" className="text-primary hover:underline flex items-center gap-1 mt-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to login
                    </Link>
                  </p>
                </div>
              ) : (
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
                        required
                      />
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline underline-offset-4 font-medium"
                >
                  Back to login
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

export default ForgotPassword;
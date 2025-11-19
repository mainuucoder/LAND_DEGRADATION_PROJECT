import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Sprout, 
  Loader2, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield,
  CheckCircle2,
  XCircle,
  User
} from "lucide-react";
import { z } from "zod";

// Enhanced validation schemas
const emailSchema = z.string().email("Please enter a valid email address");
const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(20, "Username must be less than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");
const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

type PasswordStrength = "weak" | "medium" | "strong";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>("weak");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password strength calculator
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return "weak";
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return "weak";
    if (score <= 4) return "medium";
    return "strong";
  };

  // Real-time password validation
  useEffect(() => {
    if (activeTab === "signup" && password) {
      const errors: string[] = [];
      
      if (password.length < 8) errors.push("At least 8 characters");
      if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
      if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
      if (!/[0-9]/.test(password)) errors.push("One number");
      if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
      
      setPasswordErrors(errors);
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordErrors([]);
      setPasswordStrength("weak");
    }
  }, [password, activeTab]);

  // Real-time email validation
  useEffect(() => {
    if (email) {
      try {
        emailSchema.parse(email);
        setEmailError("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setEmailError(error.errors[0].message);
        }
      }
    } else {
      setEmailError("");
    }
  }, [email]);

  // Real-time username validation
  useEffect(() => {
    if (username) {
      try {
        usernameSchema.parse(username);
        setUsernameError("");
      } catch (error) {
        if (error instanceof z.ZodError) {
          setUsernameError(error.errors[0].message);
        }
      }
    } else {
      setUsernameError("");
    }
  }, [username]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
      
      if (event === 'PASSWORD_RECOVERY') {
        navigate("/reset-password");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateSignUp = (): boolean => {
    try {
      usernameSchema.parse(username);
      emailSchema.parse(email);
      passwordSchema.parse({ password });
      
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Passwords do not match",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: firstError.message,
        });
      }
      return false;
    }
  };

  const validateSignIn = (): boolean => {
    try {
      emailSchema.parse(email);
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Password must be at least 6 characters",
        });
        return false;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      }
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;

    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            username: username,
            signup_date: new Date().toISOString(),
          }
        },
      });

      if (error) throw error;

      if (data.user?.identities && data.user.identities.length === 0) {
        toast({
          variant: "destructive",
          title: "Account Already Exists",
          description: "An account with this email already exists. Please sign in instead.",
        });
      } else {
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account and complete registration.",
        });
        
        // Reset form and switch to signin tab
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setActiveTab("signin");
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        toast({
          variant: "destructive",
          title: "Email Not Verified",
          description: "Please verify your email address before signing in. Check your inbox for the verification link.",
        });
        await supabase.auth.signOut();
        return;
      }

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });

    } catch (error: any) {
      let description = error.message;
      
      if (error.message === "Invalid login credentials") {
        description = "Invalid email or password. Please try again.";
      } else if (error.message.includes("Email not confirmed")) {
        description = "Please verify your email address before signing in. Check your inbox for the verification link.";
      }

      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address to reset password",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Check Your Email",
        description: "Password reset instructions have been sent to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error.message,
      });
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address to resend verification",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });

      if (error) throw error;

      toast({
        title: "Verification Email Sent",
        description: "Please check your email for the verification link.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Send Verification",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case "weak": return "bg-destructive";
      case "medium": return "bg-yellow-500";
      case "strong": return "bg-green-500";
      default: return "bg-muted";
    }
  };

  const getStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case "weak": return "Weak";
      case "medium": return "Medium";
      case "strong": return "Strong";
      default: return "";
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl border-0">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Sprout className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              TerraGuard AI
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Secure access to your soil analysis dashboard
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1">
            <TabsTrigger value="signin" className="data-[state=active]:bg-background">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-background">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 pt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember-me" className="cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-primary hover:text-primary/80"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-muted-foreground"
                onClick={handleResendVerification}
                disabled={loading}
              >
                Didn't receive verification email?
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 pt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={usernameError ? "border-destructive" : ""}
                />
                {usernameError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {usernameError}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Username must be 3-20 characters and can contain letters, numbers, and underscores
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? "border-destructive" : ""}
                />
                {emailError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="signup-password" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Password strength:</span>
                      <span className={`font-medium ${
                        passwordStrength === "weak" ? "text-destructive" :
                        passwordStrength === "medium" ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{
                          width: passwordStrength === "weak" ? "33%" : 
                                 passwordStrength === "medium" ? "66%" : "100%"
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Password Requirements */}
                {activeTab === "signup" && (
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground font-medium">Requirements:</p>
                    <div className="grid gap-1">
                      {[
                        { text: "At least 8 characters", met: password.length >= 8 },
                        { text: "One uppercase letter", met: /[A-Z]/.test(password) },
                        { text: "One lowercase letter", met: /[a-z]/.test(password) },
                        { text: "One number", met: /[0-9]/.test(password) },
                        { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
                      ].map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={confirmPassword && password !== confirmPassword ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-sm text-blue-800">
                  After signing up, you'll receive a verification email to activate your account. You must verify your email before you can sign in.
                </AlertDescription>
              </Alert>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
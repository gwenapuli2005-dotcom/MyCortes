import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, User, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import logoIcon from '@/assets/mycortes-logo.png';
import heroImage from '@/assets/hero-coastal.jpg';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [oauthDebugInfo, setOauthDebugInfo] = useState<string | null>(null);

  const { user, isAdmin, signInWithGoogle, signInWithEmail, signUpWithEmail, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback (hash-based or query-based) and finalize Supabase session
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const searchParams = new URLSearchParams(window.location.search);
      const error = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      // If Supabase returned an error, show it and clear URL
      if (error) {
        console.error('OAuth callback error:', error, errorDescription);
        const message = errorDescription || error;
        toast.error(`Authentication Error: ${message}`);
        setOauthDebugInfo(`Error: ${message}`);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // If we're in the middle of an OAuth redirect, finalize the session
      if (hashParams.has('access_token') || searchParams.has('code')) {
        const { data, error: callbackError } = await supabase.auth.getSessionFromUrl({ storeSession: true });
        if (callbackError) {
          console.error('Failed to complete OAuth redirect:', callbackError);
          toast.error('Authentication failed. Please try again.');
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        if (data?.session) {
          // Clean URL once we have a session
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleOAuthRedirect();
  }, []);

  useEffect(() => {
    if (user && !isLoading) {
      navigate(isAdmin ? '/admin' : '/');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }

    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin && !fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and confirm your account first.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please sign in instead.');
          } else {
            toast.error(error.message);
          }
        } else {
          setShowConfirmation(true);
        }
      }
    } catch (err: any) {
      toast.error('Something went wrong. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        const errorMessage = error?.message || 'Google login failed';
        
        // More specific error messages
        if (errorMessage.toLowerCase().includes('invalid_client')) {
          toast.error('Google OAuth is not configured correctly. Please contact support.');
        } else if (errorMessage.toLowerCase().includes('invalid_grant')) {
          toast.error('Google authentication token expired. Please try again.');
        } else if (errorMessage.toLowerCase().includes('redirect_uri')) {
          toast.error('Redirect URI mismatch. Check Google Cloud and Supabase configuration.');
        } else {
          toast.error('Google login is temporarily unavailable. Please use email/password.');
        }
        
        console.error('Google Auth Error:', error);
      }
      // Note: If successful, the OAuth flow will redirect
    } catch (err: any) {
      console.error('Google sign-in exception:', err);
      toast.error('Google sign-in failed. Please try again or use email/password.');
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Email confirmation screen
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card variant="elevated" className="max-w-md w-full animate-slide-up">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check Your Email</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. 
              Please check your inbox and click the link to activate your account.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => { setShowConfirmation(false); setIsLogin(true); }} className="w-full">
                Back to Sign In
              </Button>
              <Button variant="ghost" onClick={() => navigate('/')} className="w-full">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: split-screen layout */}
      <div className="lg:grid lg:grid-cols-2 lg:min-h-screen">
        {/* Left panel - Hero (desktop only) */}
        <div className="hidden lg:flex lg:flex-col lg:relative lg:overflow-hidden">
          <img src={heroImage} alt="Cortes coastal view" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient opacity-90" />
          <div className="relative z-10 flex flex-col justify-between h-full p-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm">
                <img src={logoIcon} alt="myCortes logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Municipality of</p>
                <h1 className="text-white text-xl font-bold tracking-tight">Cortes</h1>
              </div>
            </div>
            <div className="mb-12">
              <h2 className="text-white text-4xl font-bold mb-3">
                {isLogin ? 'Welcome Back!' : 'Join myCortes'}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                {isLogin 
                  ? 'Sign in to access municipal services, track your requests, and stay updated.' 
                  : 'Create your account to access all municipal services and community features.'}
              </p>
            </div>
            <p className="text-white/40 text-xs">© 2026 Municipality of Cortes. All rights reserved.</p>
          </div>
        </div>

        {/* Mobile hero header */}
        <div className="lg:hidden">
          <div className="hero-gradient px-4 pt-8 pb-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 backdrop-blur-sm">
                <img src={logoIcon} alt="myCortes logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Municipality of</p>
                <h1 className="text-white text-xl font-bold tracking-tight">Cortes</h1>
              </div>
            </div>

            <h2 className="text-white text-2xl font-bold">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="text-white/70 text-sm mt-1">
              {isLogin ? 'Sign in to access municipal services' : 'Join myCortes to get started'}
            </p>
          </div>
          <div className="h-6 bg-background rounded-t-3xl -mt-6 relative z-10" />
        </div>

        {/* Right panel - Form */}
        <div className="flex items-center justify-center px-4 lg:px-12 xl:px-16 py-4 lg:py-8">
          <div className="w-full max-w-md lg:max-w-lg">
            {/* Desktop back button */}
            <button
              onClick={() => navigate('/')}
              className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </button>

            <Card variant="elevated" className="animate-slide-up">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl lg:text-2xl">{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
                <CardDescription className="lg:text-base">
                  {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to create an account'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Google Sign In */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  {!isLogin && (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-11"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-xs text-destructive">{errors.password}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full h-11" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isLogin ? (
                      'Sign In'
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>

                {/* Toggle */}
                <p className="text-center text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                    }}
                    className="text-primary font-medium hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

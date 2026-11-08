import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeftRight, Lock, Mail, User, CheckCircle2, ArrowRight, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';

type AuthMode = 'signin' | 'signup' | 'verify-otp' | 'forgot-password' | 'update-password';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'update-password' ? 'update-password' : 'signin';
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const reason = searchParams.get('reason');
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const { user, login, signup, loginWithGoogle, loginWithGoogleIdToken, verifyOtp, forgotPassword, updatePassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [isGsiRendered, setIsGsiRendered] = useState<boolean>(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '376433609251-8ktojvsjjo10rh0j2sdv539ln5ud59c2.apps.googleusercontent.com';

  // If already authenticated via Google OAuth or active session, redirect to destination
  useEffect(() => {
    if (user && mode !== 'update-password') {
      navigate(redirectTarget);
    }
  }, [user, mode, navigate, redirectTarget]);

  // Notice when redirected for upgrade
  useEffect(() => {
    if (reason === 'upgrade') {
      setNotification({
        type: 'success',
        message: '👋 Please sign in or create an account to upgrade to Pro. Your subscription will be linked directly to your account.'
      });
    }
  }, [reason]);

  useEffect(() => {
    const isRecoveryHash = window.location.hash.includes('type=recovery') || window.location.hash.includes('access_token');
    const isRecoveryMode = searchParams.get('mode') === 'update-password' || searchParams.get('type') === 'recovery';
    if (isRecoveryHash || isRecoveryMode) {
      setMode('update-password');
      setNotification({
        type: 'success',
        message: '🔑 Password reset link verified! Please enter your new password below.'
      });
    }
  }, [searchParams]);

  // Initialize and render Google Identity Services on currenceconverter.me
  useEffect(() => {
    if (!googleClientId || (mode !== 'signin' && mode !== 'signup')) return;

    let isMounted = true;

    const setupGoogleGsi = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !googleBtnRef.current) return;

      try {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response: any) => {
            if (response.credential) {
              setNotification(null);
              setSubmitting(true);
              try {
                const res = await loginWithGoogleIdToken(response.credential);
                if (!res.success) {
                  setNotification({ type: 'error', message: res.error || 'Google sign in failed.' });
                } else {
                  navigate(redirectTarget);
                }
              } finally {
                setSubmitting(false);
              }
            }
          }
        });

        // Render official Google button directly on currenceconverter.me
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: mode === 'signup' ? 'signup_with' : 'continue_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 360
        });

        if (isMounted) {
          setIsGsiRendered(true);
        }
      } catch (err) {
        console.warn('[Google Identity Services] setup failed:', err);
      }
    };

    if ((window as any).google?.accounts?.id) {
      setupGoogleGsi();
    } else {
      const interval = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(interval);
          setupGoogleGsi();
        }
      }, 250);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [googleClientId, mode, loginWithGoogleIdToken, navigate, redirectTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        const res = await signup(email, password, name);
        if (!res.success) {
          setNotification({ type: 'error', message: res.error || 'Sign up failed.' });
        } else if (res.requiresEmailConfirmation) {
          setMode('verify-otp');
          setNotification({ 
            type: 'success', 
            message: `🎉 Verification code sent to ${email}! Enter the 8-digit OTP from your email below.` 
          });
        } else {
          navigate(redirectTarget);
        }
      } else if (mode === 'verify-otp') {
        if (!otpCode || otpCode.length < 6) {
          setNotification({ type: 'error', message: 'Please enter your complete verification code.' });
          return;
        }
        const res = await verifyOtp(email, otpCode, 'signup');
        if (!res.success) {
          setNotification({ type: 'error', message: res.error || 'Invalid or expired OTP code. Please try again.' });
        } else {
          setNotification({ type: 'success', message: '🎉 Account verified successfully! Taking you to your dashboard...' });
          setTimeout(() => navigate(redirectTarget), 1000);
        }
      } else if (mode === 'signin') {
        const res = await login(email, password);
        if (!res.success) {
          setNotification({ type: 'error', message: res.error || 'Invalid email or password.' });
        } else {
          navigate(redirectTarget);
        }
      } else if (mode === 'forgot-password') {
        const res = await forgotPassword(email);
        if (!res.success) {
          setNotification({ type: 'error', message: res.error || 'Failed to send recovery email.' });
        } else {
          setNotification({
            type: 'success',
            message: '📩 Password reset link sent! Please check your email inbox to set a new password.'
          });
        }
      } else if (mode === 'update-password') {
        if (password !== confirmPassword) {
          setNotification({ type: 'error', message: 'Passwords do not match.' });
          return;
        }
        const res = await updatePassword(password);
        if (!res.success) {
          setNotification({ type: 'error', message: res.error || 'Failed to update password.' });
        } else {
          setNotification({
            type: 'success',
            message: '✅ Password updated successfully! Redirecting to dashboard...'
          });
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setNotification(null);
    setSubmitting(true);
    try {
      const google = (window as any).google;
      if (googleClientId && google?.accounts?.id) {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            loginWithGoogle();
          }
        });
        return;
      }

      const res = await loginWithGoogle();
      if (!res.success) {
        setNotification({ type: 'error', message: res.error || 'Google sign-in could not be initiated.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-slate-50/40">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 relative animate-fade-in-up">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-4 shadow-md shadow-blue-500/20">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'signin' && 'Welcome to HoverCurrency'}
            {mode === 'verify-otp' && 'Verify Your Email'}
            {mode === 'forgot-password' && 'Reset Your Password'}
            {mode === 'update-password' && 'Set New Password'}
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            {mode === 'signup' && 'Start converting currencies instantly across the web'}
            {mode === 'signin' && 'Sign in to access your dashboard and extension sync'}
            {mode === 'verify-otp' && `Enter the 8-digit OTP code sent to ${email}`}
            {mode === 'forgot-password' && 'Enter your email to receive a password reset link'}
            {mode === 'update-password' && 'Choose a strong new password for your account'}
          </p>
        </div>

        {/* Segmented Mode Switcher (for signin/signup) */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setNotification(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setNotification(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Notification Alert Banner */}
        {notification && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium mb-5 flex items-start gap-2.5 animate-fade-in ${
              notification.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{notification.message}</span>
          </div>
        )}

        {/* Quick Google Sign-In */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="mb-6">
            {/* Native Google Identity Services Button Container (Direct on currenceconverter.me) */}
            <div 
              ref={googleBtnRef} 
              className={`w-full flex justify-center min-h-[44px] ${isGsiRendered ? 'flex' : 'hidden'}`}
            />

            {/* Custom Google Button Fallback / Pre-render */}
            {!isGsiRendered && (
              <button
                onClick={handleGoogleSignIn}
                type="button"
                disabled={submitting || isLoading}
                className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{mode === 'signup' ? 'Sign up with Google' : 'Continue with Google'}</span>
              </button>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 pt-5">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Or with email
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'verify-otp' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2 text-center">
                  8-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 text-blue-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    maxLength={8}
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="12345678"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-center text-2xl font-bold tracking-[0.25em] text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || isLoading || otpCode.length < 6}
                className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <span>Verify & Activate Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setNotification(null);
                    setSubmitting(true);
                    try {
                      await signup(email, password, name);
                      setNotification({
                        type: 'success',
                        message: '📩 A new 8-digit OTP code has been sent to your email.'
                      });
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          )}

          {mode !== 'update-password' && mode !== 'verify-otp' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          )}

          {(mode === 'signin' || mode === 'signup' || mode === 'update-password') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  {mode === 'update-password' ? 'New Password' : 'Password'}
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot-password'); setNotification(null); }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'update-password' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          )}

          {mode !== 'verify-otp' && (
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="w-full py-3 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot-password' && 'Send Reset Email'}
                    {mode === 'update-password' && 'Update Password'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </form>

        {/* Back Link for Forgot Password or OTP */}
        {(mode === 'forgot-password' || mode === 'update-password' || mode === 'verify-otp') && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => { setMode('signin'); setNotification(null); }}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

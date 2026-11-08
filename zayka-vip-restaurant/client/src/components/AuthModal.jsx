import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  User,
  Crown,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AuthModal() {
  const {
    authModalOpen,
    authModalMode,
    setAuthModalMode,
    closeAuth,
    login,
    register,
    loginWithGoogle,
    requestForgotPassword,
    submitResetPassword
  } = useAuth();

  // Mode: 'login' | 'register' | 'forgot' | 'reset' | 'google_picker'
  const [mode, setMode] = useState(authModalMode || 'login');

  // Form states
  const [identifier, setIdentifier] = useState(''); // email or phone for login
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [fullName, setFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot & Reset fields
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [generatedTokenPreview, setGeneratedTokenPreview] = useState(null);

  // Feedback & Loading
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync mode when modal opens
  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [authModalMode]);

  if (!authModalOpen) return null;

  // Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your email or phone number and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(identifier, password, rememberMe);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        name: fullName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        confirmPassword: regConfirmPassword
      });
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Email or phone may already exist.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!forgotIdentifier.trim()) {
      setErrorMsg('Please enter your registered email or phone number.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await requestForgotPassword(forgotIdentifier);
      setSuccessMsg(`Reset code and token generated for ${forgotIdentifier}.`);
      setGeneratedTokenPreview(res.token);
      setResetToken(res.token);
    } catch (err) {
      setErrorMsg(err.message || 'Could not find an account with that email/phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetToken.trim() || !newPassword) {
      setErrorMsg('Reset token and new password are required.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await submitResetPassword(resetToken, newPassword, confirmNewPassword);
      setSuccessMsg(res.message || 'Password reset successful! Please log in.');
      setTimeout(() => {
        setMode('login');
        setIdentifier(forgotIdentifier);
        setPassword('');
        setSuccessMsg('');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed. Invalid or expired token.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth flow simulation / selector
  const handleGoogleSelect = async (account) => {
    try {
      setIsSubmitting(true);
      await loginWithGoogle({
        email: account.email,
        name: account.name,
        avatar: account.avatar
      });
    } catch (err) {
      setErrorMsg('Google authentication failed. ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl glass-vip border border-gold/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glow orb */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeAuth}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-600 to-amber-900 p-0.5 shadow-gold-glow mb-3">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text tracking-wide">
            {mode === 'login' && 'VIP Customer Access'}
            {mode === 'register' && 'Join the ZAYKA Circle'}
            {mode === 'forgot' && 'Account Recovery'}
            {mode === 'reset' && 'Define New Password'}
            {mode === 'google_picker' && 'Continue with Google'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {mode === 'login' && 'Access your royal reservations, orders & exclusive privileges'}
            {mode === 'register' && 'Experience bespoke culinary luxury tailored for you'}
            {mode === 'forgot' && 'Enter your registered email or phone to reset your password'}
            {mode === 'reset' && 'Enter your security token and define your new VIP password'}
            {mode === 'google_picker' && 'Select your Google Account to proceed securely'}
          </p>
        </div>

        {/* Notifications & Error Banners */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. customer@zayka.com or +923219876543"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-gold focus:ring-1 focus:ring-gold text-stone-100 text-sm outline-none transition-all placeholder:text-stone-600"
                  required
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotIdentifier(identifier);
                    setMode('forgot');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-amber-400/90 hover:text-amber-300 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-gold focus:ring-1 focus:ring-gold text-stone-100 text-sm outline-none transition-all placeholder:text-stone-600"
                  required
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-amber-500 w-4 h-4"
                />
                <span>Remember my VIP credentials</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to VIP Lounge</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Quick Demo Credentials Autofill pill */}
            <div className="p-2.5 rounded-xl bg-stone-900/70 border border-stone-800/80 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('customer@zayka.com');
                  setPassword('customer123');
                }}
                className="text-amber-400 hover:underline font-medium"
              >
                Auto-fill Customer
              </button>
              <span className="text-stone-600">|</span>
              <button
                type="button"
                onClick={() => {
                  setIdentifier('admin@zayka.com');
                  setPassword('admin123');
                }}
                className="text-yellow-400 hover:underline font-medium"
              >
                Auto-fill Admin
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-dark-900 px-3 text-stone-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={() => {
                setMode('google_picker');
                setErrorMsg('');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800/80 border border-stone-700/80 text-stone-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Switch to Register */}
            <div className="text-center pt-2">
              <span className="text-xs text-stone-400">Do not have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                Sign Up Now
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Syed Hamza Ali"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-xs sm:text-sm outline-none"
                  required
                />
                <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="e.g. hamza@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-xs sm:text-sm outline-none"
                  required
                />
                <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Phone Number (for Order Updates & SMS)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="e.g. +923219876543"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-xs sm:text-sm outline-none"
                  required
                />
                <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-8 pr-7 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-xs outline-none"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-2 top-3 text-stone-500 hover:text-stone-300"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Re-enter"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-xs outline-none"
                    required
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create VIP Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-stone-400">Already registered? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-amber-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Registered Email or Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="e.g. customer@zayka.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-gold text-stone-100 text-sm outline-none"
                  required
                />
                <KeyRound className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Generate Reset Security Token</span>
              )}
            </button>

            {/* Generated Token Interactive Helper */}
            {generatedTokenPreview && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Security Token Ready
                  </span>
                  <span className="text-[10px] text-stone-400">Valid for 60 min</span>
                </div>
                <p className="text-[11px] font-mono text-stone-300 break-all bg-dark-950 p-2 rounded border border-stone-800">
                  {generatedTokenPreview}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetToken(generatedTokenPreview);
                    setMode('reset');
                    setErrorMsg('');
                  }}
                  className="w-full py-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Proceed to Set New Password Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs text-stone-400 hover:text-white"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: RESET PASSWORD */}
        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Security Reset Token
              </label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="Paste token or enter reset code"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs font-mono outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                New VIP Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm outline-none focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-sm outline-none focus:border-gold"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all"
            >
              {isSubmitting ? 'Updating Password...' : 'Save New Password & Sign In'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-stone-400 hover:text-white"
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {/* MODE 5: GOOGLE LOGIN DIALOG / PROFILE PICKER */}
        {mode === 'google_picker' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-stone-900/90 border border-stone-800 text-xs text-stone-300">
              <p className="font-semibold text-stone-100 mb-1 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-gold" />
                Google OAuth 2.0 Integration
              </p>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Connect your Google Account to experience one-touch sign in. Pick a verified Google account profile below or enter any Google email:
              </p>
            </div>

            {/* Simulated Verified Google Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  handleGoogleSelect({
                    name: 'Syed Hamza Ali (Google)',
                    email: 'hamza.vip@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                  })
                }
                className="w-full p-3 rounded-xl bg-stone-900 hover:bg-stone-800/90 border border-stone-800 hover:border-gold/40 flex items-center gap-3 transition-all text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                  alt="Hamza"
                  className="w-9 h-9 rounded-full object-cover border border-amber-500/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-100 group-hover:text-gold transition-colors">
                    Syed Hamza Ali
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">hamza.vip@gmail.com</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Google
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleGoogleSelect({
                    name: 'Ayesha Siddiqui (Google)',
                    email: 'ayesha.siddiqui@gmail.com',
                    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
                  })
                }
                className="w-full p-3 rounded-xl bg-stone-900 hover:bg-stone-800/90 border border-stone-800 hover:border-gold/40 flex items-center gap-3 transition-all text-left group"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                  alt="Ayesha"
                  className="w-9 h-9 rounded-full object-cover border border-amber-500/50"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-100 group-hover:text-gold transition-colors">
                    Ayesha Siddiqui
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">ayesha.siddiqui@gmail.com</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Google
                </span>
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-stone-400 hover:text-white"
              >
                ← Back to standard login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

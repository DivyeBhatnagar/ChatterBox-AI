import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TopAppBar } from './shared/TopAppBar';
import { MonolithFooter } from './shared/MonolithFooter';
import { validateEmail } from '../lib/validation';
import { useAuth } from '../hooks/useAuth';

export const MonolithLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailError = useMemo(() => (email ? validateEmail(email) : ''), [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const nextEmailError = validateEmail(email);

    if (nextEmailError || !password) {
      setErrorMessage(nextEmailError || 'Password is required');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email, password, rememberMe);
      navigate('/chat');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unable to login. Please try again.';
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/chat');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Google login failed. Please try again.';
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body flex flex-col">
      <TopAppBar />

      <main className="flex-1 flex items-center justify-center px-6 py-20 mt-20">
        <div className="w-full max-w-md">
          {/* Background Blur */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none top-1/4">
            <div className="w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
          </div>

          {/* Login Card */}
          <div className="relative z-10 bg-surface-container-low border border-white/5 rounded-sm p-12">
            <div className="mb-12 text-center">
              <h1 className="font-headline font-black text-4xl text-white tracking-tighter uppercase mb-4">
                ChatterBox AI
              </h1>
              <p className="text-on-surface-variant text-sm tracking-widest uppercase">
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-8">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-sm font-headline font-bold text-sm tracking-widest uppercase hover:bg-neutral-100 transition-all duration-300 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">public</span>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-surface-container-low text-neutral-500 uppercase tracking-wider">Or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full bg-surface-container-highest border rounded-sm text-white px-6 py-4 focus:outline-none focus:border-primary transition-colors placeholder-neutral-600 ${
                    emailError ? 'border-rose-500/50' : 'border-white/10'
                  }`}
                  required
                />
                {emailError && <p className="text-xs text-rose-400 mt-2">{emailError}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 pr-12 rounded-sm focus:outline-none focus:border-primary transition-colors placeholder-neutral-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-on-surface-variant cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-surface-container-highest cursor-pointer"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary hover:text-neutral-200 transition-colors">
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading || !!emailError}
                className="w-full bg-primary text-on-primary px-10 py-4 font-headline font-bold text-sm tracking-widest rounded-sm hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-on-surface-variant">
                New here?{' '}
                <Link to="/signup" className="text-primary hover:text-neutral-200 transition-colors font-bold">
                  Create an account
                </Link>
              </p>
            </form>

            {/* Security Info Cards */}
            <div className="mt-12 pt-8 border-t border-white/5 space-y-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">shield</span>
                <div className="text-xs">
                  <p className="font-bold text-white mb-1">Secure Login</p>
                  <p className="text-on-surface-variant">Your password is encrypted and stored securely.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">lock</span>
                <div className="text-xs">
                  <p className="font-bold text-white mb-1">Privacy First</p>
                  <p className="text-on-surface-variant">Your data is never shared with third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MonolithFooter />
    </div>
  );
};

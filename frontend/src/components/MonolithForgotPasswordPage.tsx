import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { TopAppBar } from './shared/TopAppBar';

export const MonolithForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { sendReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await sendReset(email.trim());
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-background text-on-surface font-body min-h-screen overflow-hidden">
        <TopAppBar />
        <main className="h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full">
            <div className="bg-surface-container-low border border-white/5 rounded-sm p-12 text-center">
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-green-400 text-3xl">check_circle</span>
              </div>
              <h1 className="font-headline text-2xl font-bold text-white mb-4">
                Email Sent Successfully
              </h1>
              <p className="text-on-surface-variant mb-8">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <p className="text-[12px] text-neutral-500 mb-6">
                Redirecting to login in a few seconds...
              </p>
              <Link
                to="/login"
                className="inline-block bg-primary text-on-primary px-8 py-3 font-headline font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface font-body min-h-screen overflow-hidden relative">
      <TopAppBar />

      {/* Animated background elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl -z-10"></div>

      <main className="min-h-screen flex items-center justify-center px-6 pt-20 pb-20">
        <div className="max-w-md w-full">
          <div className="mb-12 text-center">
            <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-white mb-4">
              Reset Password
            </h1>
            <p className="text-on-surface-variant">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div className="bg-surface-container-low/40 backdrop-blur-lg border border-white/10 rounded-sm p-12 shadow-2xl">
            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-sm text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email Input */}
              <div>
                <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3 font-headline">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-white/30 transition-colors placeholder-neutral-600"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-on-primary px-8 py-4 font-headline font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface-container-low text-neutral-500">OR</span>
                </div>
              </div>

              {/* Back to Login */}
              <Link
                to="/login"
                className="block w-full bg-surface-container-high border border-white/10 text-white px-8 py-4 font-headline font-bold text-sm uppercase tracking-widest text-center hover:bg-white/5 transition-all rounded-sm"
              >
                Back to Login
              </Link>
            </form>

            {/* Security Info */}
            <div className="mt-12 space-y-4 text-center">
              <p className="text-[11px] text-neutral-600 uppercase tracking-wider">Security Notice</p>
              <div className="flex items-start gap-3 px-4 py-3 bg-white/5 rounded-sm border border-white/5">
                <span className="material-symbols-outlined text-xs text-neutral-500 mt-0.5 flex-shrink-0">info</span>
                <p className="text-[12px] text-neutral-500 text-left">
                  If you don't have an account yet,{' '}
                  <Link to="/signup" className="text-white hover:underline">
                    create one here
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-[12px] text-neutral-600 mt-8">
            Password reset link expires in 1 hour
          </p>
        </div>
      </main>
    </div>
  );
};

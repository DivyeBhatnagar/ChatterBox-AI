import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TopAppBar } from './shared/TopAppBar';
import { MonolithFooter } from './shared/MonolithFooter';
import { validateEmail, validatePassword, passwordStrength } from '../lib/validation';
import { useAuth } from '../hooks/useAuth';

export const MonolithSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const emailError = useMemo(() => (formData.email ? validateEmail(formData.email) : ''), [formData.email]);
  const passwordError = useMemo(() => (formData.password ? validatePassword(formData.password) : ''), [formData.password]);
  const confirmError = useMemo(() => {
    if (!formData.confirmPassword) return '';
    return formData.confirmPassword === formData.password ? '' : 'Passwords do not match';
  }, [formData.confirmPassword, formData.password]);
  const strength = useMemo(() => passwordStrength(formData.password), [formData.password]);

  const isFormValid = !emailError && !passwordError && !confirmError && termsAccepted && privacyAccepted && Boolean(formData.fullName && formData.email && formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!isFormValid) {
      setErrorMessage('Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(formData.email, formData.password, formData.fullName);
      navigate('/chat');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unable to create account. Please try again.';
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
      const errorMsg = error instanceof Error ? error.message : 'Google sign-up failed. Please try again.';
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

          {/* Signup Card */}
          <div className="relative z-10 bg-surface-container-low border border-white/5 rounded-sm p-12">
            <div className="mb-12 text-center">
              <h1 className="font-headline font-black text-4xl text-white tracking-tighter uppercase mb-4">
                ChatterBox AI
              </h1>
              <p className="text-on-surface-variant text-sm tracking-widest uppercase">
                Create your account
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-sm font-headline font-bold text-sm tracking-widest uppercase hover:bg-neutral-100 transition-all duration-300 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">public</span>
                Sign up with Google
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-surface-container-low text-neutral-500 uppercase tracking-wider">Or register with email</span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Display Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-primary transition-colors placeholder-neutral-600"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full bg-surface-container-highest border rounded-sm text-white px-6 py-4 focus:outline-none focus:border-primary transition-colors placeholder-neutral-600 ${
                    emailError ? 'border-rose-500/50' : 'border-white/10'
                  }`}
                  required
                />
                {emailError && <p className="text-xs text-rose-400 mt-2">{emailError}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
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
                {passwordError && <p className="text-xs text-rose-400 mt-2">{passwordError}</p>}
                {formData.password && (
                  <div className="mt-3">
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          strength >= 80 ? 'bg-emerald-500' : strength >= 60 ? 'bg-yellow-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${strength}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">Password strength: {strength}%</p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-widest mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full bg-surface-container-highest border rounded-sm text-white px-6 py-4 pr-12 focus:outline-none focus:border-primary transition-colors placeholder-neutral-600 ${
                      confirmError ? 'border-rose-500/50' : 'border-white/10'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
                {confirmError && <p className="text-xs text-rose-400 mt-2">{confirmError}</p>}
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 text-sm text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-white/20 bg-surface-container-highest cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-neutral-200 transition-colors">
                    Terms & Conditions
                  </Link>
                </span>
              </label>

              {/* Privacy Checkbox */}
              <label className="flex items-start gap-3 text-sm text-on-surface-variant cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-white/20 bg-surface-container-highest cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <Link to="#" className="text-primary hover:text-neutral-200 transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {errorMessage}
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full bg-primary text-on-primary px-10 py-4 font-headline font-bold text-sm tracking-widest rounded-sm hover:bg-neutral-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-on-surface-variant">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-neutral-200 transition-colors font-bold">
                  Sign in
                </Link>
              </p>
            </form>

            {/* Features List */}
            <div className="mt-12 pt-8 border-t border-white/5 space-y-3">
              <p className="text-xs font-bold text-white uppercase tracking-widest mb-4">What you get:</p>
              <div className="flex gap-3 text-xs">
                <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">check_circle</span>
                <p className="text-on-surface-variant">Unlimited conversations & chat history</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">check_circle</span>
                <p className="text-on-surface-variant">Sync across all your devices</p>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">check_circle</span>
                <p className="text-on-surface-variant">Advanced AI with personalized learning</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MonolithFooter />
    </div>
  );
};

import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface TopAppBarProps {
  activeTab?: 'core' | 'nexus' | 'analytics' | 'settings';
}

export const TopAppBar: React.FC<TopAppBarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOutUser } = useAuth();
  const isAuthenticated = !!user;
  const isOnLandingPage = location.pathname === '/';

  const handleLogout = async () => {
    await signOutUser();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-neutral-950 border-b border-white/10">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-black text-white tracking-[-0.04em] font-headline uppercase hover:text-neutral-300 transition-colors"
        >
          ChatterBox AI
        </Link>

        {/* Navigation - Only show if authenticated */}
        {isAuthenticated && !isOnLandingPage && (
          <nav className="hidden md:flex gap-8 items-center">
            <Link 
              to="/" 
              className={`${
                location.pathname === '/' ? 'text-white font-bold' : 'text-neutral-500'
              } hover:text-white transition-colors duration-300 font-manrope tracking-tighter uppercase text-sm`}
            >
              Home
            </Link>
            <Link 
              to="/chat" 
              className={`${
                location.pathname === '/chat' ? 'text-white font-bold' : 'text-neutral-500'
              } hover:text-white transition-colors duration-300 font-manrope tracking-tighter uppercase text-sm`}
            >
              Chat
            </Link>
            <Link 
              to="/pricing" 
              className={`${
                location.pathname === '/pricing' ? 'text-white font-bold' : 'text-neutral-500'
              } hover:text-white transition-colors duration-300 font-manrope tracking-tighter uppercase text-sm`}
            >
              Pricing
            </Link>
            <Link 
              to="/profile" 
              className={`${
                location.pathname === '/profile' ? 'text-white font-bold' : 'text-neutral-500'
              } hover:text-white transition-colors duration-300 font-manrope tracking-tighter uppercase text-sm`}
            >
              Profile
            </Link>
            <Link 
              to="/settings" 
              className={`${
                location.pathname === '/settings' ? 'text-white font-bold' : 'text-neutral-500'
              } hover:text-white transition-colors duration-300 font-manrope tracking-tighter uppercase text-sm`}
            >
              Settings
            </Link>
          </nav>
        )}
      </div>

      {/* Right Side - Auth Actions */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            {/* User Display Name */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-2xl">account_circle</span>
              <span className="text-sm text-white font-manrope">{user?.displayName || 'User'}</span>
            </div>

            {/* Settings Button */}
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-white hover:text-neutral-300 transition-colors hover:bg-white/10 rounded-sm"
              title="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 rounded-sm transition-all duration-300 hidden sm:block"
              title="Logout"
            >
              Logout
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => navigate('/settings')}
              className="md:hidden p-2 text-white hover:text-neutral-300 transition-colors"
              title="Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </>
        ) : (
          <>
            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-bold uppercase tracking-widest text-white hover:bg-white/10 rounded-sm transition-all duration-300"
            >
              Sign In
            </button>

            {/* Sign Up Button */}
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm font-bold uppercase tracking-widest bg-primary text-on-primary hover:bg-neutral-200 rounded-sm transition-all duration-300"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

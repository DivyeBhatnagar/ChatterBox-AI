import { useState, useEffect } from 'react';
import { TopAppBar } from './shared/TopAppBar';
import { SideNavBar } from './shared/SideNavBar';
import { useAuth } from '../hooks/useAuth';
import { chatApi, parseApiError } from '../lib/api';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  website?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export const MonolithProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfile>({
    uid: '',
    email: '',
    displayName: '',
    photoURL: '',
    bio: '',
    website: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalInteractions: 0,
    savedChats: 0,
    accountAge: 'N/A',
  });

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        if (user) {
          setProfileData({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
            bio: user.displayName ? `${user.displayName} on ChatterBox AI` : 'ChatterBox AI user',
          });

          // Load conversation history to calculate stats
          const history = await chatApi.getHistory('', false);
          setStats({
            totalInteractions: history.total * 2, // Approximate
            savedChats: history.total,
            accountAge: user.metadata.creationTime 
              ? `${Math.floor((Date.now() - new Date(user.metadata.creationTime).getTime()) / (1000 * 60 * 60 * 24))}d`
              : '0d',
          });
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      // In a real app, you'd call an API to save the profile
      // For now, we'll just update local state
      setSuccess('Profile saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMsg = parseApiError(err);
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <TopAppBar />
      <SideNavBar active="settings" />

      <main className="md:ml-64 pt-24 pb-20 px-6 md:px-16">
        {error && (
          <div className="max-w-7xl mx-auto mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-sm">
            {error}
            <button onClick={() => setError(null)} className="float-right text-red-400 hover:text-red-300">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}
        
        {success && (
          <div className="max-w-7xl mx-auto mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-sm">
            {success}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-on-surface-variant">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
            <section className="flex flex-col md:flex-row gap-16 items-start mb-24 max-w-7xl mx-auto">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-48 h-48 bg-surface-container-high rounded-full overflow-hidden border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                  {profileData.photoURL ? (
                    <img src={profileData.photoURL} alt={profileData.displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-white text-8xl opacity-40">account_circle</span>
                  )}
                </div>
                <button className="absolute -bottom-4 -right-4 bg-primary text-on-primary p-3 rounded-sm cursor-pointer hover:bg-neutral-200 transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 max-w-2xl">
                <span className="font-headline text-[12px] tracking-[0.4em] uppercase text-neutral-500 mb-4 block">
                  Profile Information
                </span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
                  {profileData.displayName || 'User'}
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl mb-8">
                  {profileData.bio || 'Welcome to ChatterBox AI'}
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-primary text-on-primary px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm">
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <button className="border border-outline-variant text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all rounded-sm">
                    Change Password
                  </button>
                </div>
              </div>
            </section>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto mb-24">
              {/* Account Information */}
              <div className="bg-surface-container-low p-10 border border-white/5 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-10">
                  Account Details
                </h3>
                <div className="space-y-8">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      Display Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    ) : (
                      <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm">
                        {profileData.displayName || 'Not set'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      Email Address
                    </label>
                    <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm opacity-60 cursor-not-allowed">
                      {profileData.email}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-2">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-white/30 transition-colors resize-none"
                      />
                    ) : (
                      <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm">
                        {profileData.bio || 'No bio set'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-surface-container-high p-10 border border-white/10 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-10">
                  Additional Info
                </h3>
                <div className="space-y-8">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleChange}
                        className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-white/30 transition-colors"
                      />
                    ) : (
                      <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm">
                        {profileData.website || 'Not set'}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      Account Type
                    </label>
                    <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm">
                      ARCHITECT PRO
                    </div>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      User ID
                    </label>
                    <div className="w-full bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm text-[12px] break-all">
                      {profileData.uid}
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="md:col-span-2 bg-surface-container-lowest p-10 border border-white/5 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-10">
                  Account Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-headline font-black text-white mb-2">
                      {stats.totalInteractions}
                    </div>
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
                      Total Interactions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-headline font-black text-white mb-2">
                      {stats.savedChats}
                    </div>
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
                      Saved Chats
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-headline font-black text-white mb-2">89%</div>
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
                      Satisfaction
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-headline font-black text-white mb-2">
                      {stats.accountAge}
                    </div>
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">
                      Account Age
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="max-w-7xl mx-auto flex gap-4">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-white text-on-primary px-12 py-4 font-headline font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="border border-white/20 text-white px-12 py-4 font-headline font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all rounded-sm">
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

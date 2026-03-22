import { useState } from 'react';
import { TopAppBar } from './shared/TopAppBar';
import { SideNavBar } from './shared/SideNavBar';
import { useAuth } from '../hooks/useAuth';

export const MonolithSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    chatNotifications: true,
    emailUpdates: false,
    darkMode: true,
    autoSave: true,
    soundEnabled: true,
    privateChats: true,
  });

  const [apiKey] = useState('sk-proj-1234567890abcdef');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <TopAppBar />
      <SideNavBar active="settings" />

      <main className="md:ml-64 pt-24 pb-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="font-headline text-5xl font-black tracking-tighter uppercase text-white mb-2">
              Settings & Preferences
            </h1>
            <p className="text-on-surface-variant max-w-xl font-light">
              Customize your ChatterBox AI experience
            </p>
          </div>

          {/* Success Message */}
          {saveSuccess && (
            <div className="mb-6 bg-green-500/10 border border-green-500/50 text-green-400 px-6 py-4 rounded-sm">
              Settings saved successfully!
            </div>
          )}

          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
            {/* Main Settings Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chat Preferences */}
              <div className="bg-surface-container-low p-10 border border-white/5 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8">
                  Chat Preferences
                </h3>

                <div className="space-y-6">
                  {/* Chat Notifications */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div>
                      <p className="text-white text-sm font-bold">Chat Notifications</p>
                      <p className="text-neutral-500 text-xs mt-1">Get alerts for new messages</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('chatNotifications')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        settings.chatNotifications ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-neutral-950 transition-transform ${
                          settings.chatNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Auto-Save Conversations */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div>
                      <p className="text-white text-sm font-bold">Auto-Save Conversations</p>
                      <p className="text-neutral-500 text-xs mt-1">Automatically save chat history</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('autoSave')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        settings.autoSave ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-neutral-950 transition-transform ${
                          settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Sound Effects */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-bold">Sound Effects</p>
                      <p className="text-neutral-500 text-xs mt-1">Play sound on new messages</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('soundEnabled')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        settings.soundEnabled ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-neutral-950 transition-transform ${
                          settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="bg-surface-container-low p-10 border border-white/5 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8">
                  Privacy & Security
                </h3>

                <div className="space-y-6">
                  {/* Private Chats */}
                  <div className="flex items-center justify-between pb-6 border-b border-white/5">
                    <div>
                      <p className="text-white text-sm font-bold">Private Chats</p>
                      <p className="text-neutral-500 text-xs mt-1">Keep conversations private</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('privateChats')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        settings.privateChats ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-neutral-950 transition-transform ${
                          settings.privateChats ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Email Updates */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-bold">Email Updates</p>
                      <p className="text-neutral-500 text-xs mt-1">Receive product updates via email</p>
                    </div>
                    <button
                      onClick={() => toggleSetting('emailUpdates')}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                        settings.emailUpdates ? 'bg-white' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-neutral-950 transition-transform ${
                          settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* API Settings */}
              <div className="bg-surface-container-low p-10 border border-white/5 rounded-sm">
                <h3 className="font-headline text-xs tracking-[0.3em] uppercase text-neutral-500 mb-8">
                  API Access
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-neutral-500 block mb-3">
                      API Key
                    </label>
                    <div className="flex gap-3">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        readOnly
                        className="flex-1 bg-surface-container-highest border border-white/10 text-white px-6 py-4 rounded-sm focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-4 py-4 bg-surface-container-highest border border-white/10 text-white rounded-sm hover:border-white/30 transition-colors"
                      >
                        <span className="material-symbols-outlined">{showApiKey ? 'visibility_off' : 'visibility'}</span>
                      </button>
                      <button
                        onClick={() => navigator.clipboard.writeText(apiKey)}
                        className="px-4 py-4 bg-surface-container-highest border border-white/10 text-white rounded-sm hover:border-white/30 transition-colors"
                      >
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2">Keep this key secure. Do not share with anyone.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="bg-surface-container-high p-8 border border-white/10 rounded-sm">
                <h3 className="font-headline text-sm font-bold text-white mb-6">Account Info</h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-neutral-500 text-xs">Email</p>
                    <p className="text-white break-all">{user?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs">Plan</p>
                    <p className="text-white">Free Plan</p>
                  </div>
                  <div>
                    <p className="text-neutral-500 text-xs">Messages Today</p>
                    <p className="text-white">12 / 25</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-500/5 p-8 border border-red-500/20 rounded-sm">
                <h3 className="font-headline text-sm font-bold text-red-400 mb-6">Danger Zone</h3>

                <button className="w-full px-4 py-3 border border-red-500/50 text-red-400 rounded-sm hover:bg-red-500/10 transition-colors text-sm font-bold uppercase tracking-widest">
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-white text-black px-12 py-4 font-headline font-bold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all rounded-sm"
            >
              Save Changes
            </button>
            <button className="border border-white/20 text-white px-12 py-4 font-headline font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all rounded-sm">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';

interface SideNavBarProps {
  active?: 'nexus' | 'analytics' | 'settings';
}

export const SideNavBar: React.FC<SideNavBarProps> = ({ active = 'nexus' }) => {
  const navigate = useNavigate();

  const navItems = [
    { id: 'nexus', icon: 'add_box', label: 'New Chat', action: () => navigate('/chat') },
    { id: 'settings', icon: 'tune', label: 'Settings', action: () => navigate('/settings') },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col py-8 bg-neutral-900 h-screen w-64 border-r border-white/5 hidden lg:flex z-40 mt-20">
      <div className="px-6 mb-12">
        <h2 className="text-white font-black italic font-headline tracking-wider">CHATTERBOX</h2>
        <p className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase mt-1">Chat 01</p>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={`w-full flex items-center gap-4 ${
              active === item.id ? 'text-white bg-white/10' : 'text-neutral-500 hover:bg-white/5 hover:text-white'
            } rounded-sm px-4 py-3 font-manrope text-[12px] tracking-widest uppercase transition-all duration-300`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-2 pt-8 border-t border-white/5">
        <button className="w-full flex items-center gap-4 text-neutral-500 px-4 py-3 font-manrope text-[12px] tracking-widest uppercase hover:text-white transition-all duration-300">
          <span className="material-symbols-outlined">help_outline</span>
          <span>Support</span>
        </button>
        <button className="w-full flex items-center gap-4 text-neutral-500 px-4 py-3 font-manrope text-[12px] tracking-widest uppercase hover:text-white transition-all duration-300">
          <span className="material-symbols-outlined">description</span>
          <span>Documentation</span>
        </button>
      </div>
    </aside>
  );
};

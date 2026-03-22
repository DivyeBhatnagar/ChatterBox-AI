import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../shared/TopAppBar';
import { MonolithFooter } from '../shared/MonolithFooter';

export const MonolithLandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-on-background font-body">
      <TopAppBar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex flex-col items-center justify-center px-6 overflow-hidden">
          {/* Background Blur Effect */}
          <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto">
            <h1 className="font-headline font-extrabold text-5xl md:text-8xl lg:text-9xl text-white tracking-[-0.05em] leading-[0.9] uppercase mb-8 animate-fade-in-down">
              Conversations <br /> Reimagined
            </h1>
            <p className="font-body text-on-surface-variant text-lg md:text-2xl max-w-2xl mx-auto mb-12 font-light tracking-wide animate-fade-in-up stagger-1">
              Experience intelligent conversations powered by advanced AI. ChatterBox AI delivers human-like understanding in every interaction.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center animate-fade-in-up stagger-2">
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-on-primary px-10 py-4 font-headline font-bold text-sm tracking-widest rounded-sm hover:bg-neutral-200 transition-all duration-300 w-full md:w-auto hover-scale"
              >
                START CHATTING
              </button>
              <button className="border border-outline-variant text-white px-10 py-4 font-headline font-bold text-sm tracking-widest rounded-sm hover:bg-white/5 transition-all duration-300 w-full md:w-auto hover-scale">
                EXPLORE FEATURES
              </button>
            </div>
          </div>

          {/* 3D Sphere with Floating Nodes */}
          <div className="mt-16 relative w-full max-w-4xl h-[400px] flex items-center justify-center animate-fade-in-up stagger-3">
            <div className="relative group animate-float">
              <div className="absolute inset-0 bg-white/10 blur-[100px] group-hover:bg-white/20 transition-all duration-1000 animate-glow"></div>
              <img
                alt="3D Obsidian Sphere"
                className="relative z-10 w-80 h-80 object-cover rounded-full grayscale obsidian-depth border border-white/10 hover-lift"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRn7bJVoSb712I6pryJOc8ZTPBKhyE46X9EwFj_yAVd0se19b6hQV-7FcX6UZpjz7jVlf7XxeWw1Z-f8w7hQanqhTUf53gYlA5UVrpQPuDb-CYk01j00adH37qJE8lvjDqvH_Vkmqgv66F5tUn2nhH8YUS3sYZ7EsOO17WzOy7g8atW1MqDTIOYzOqIfty6rXQsPClPa5uQnED4YqltT6DuqqirE7htHUxc2Oar9coYLxUzlbpPmwt7Tl9VTvRTDKiVwOqVI9MKes"
              />
            </div>
            {/* Floating Glass Nodes */}
            <div className="absolute top-0 left-1/4 glass-node p-4 rounded-full flex items-center justify-center animate-pulse animate-float stagger-1">
              <span className="material-symbols-outlined text-white text-sm">hub</span>
            </div>
            <div className="absolute bottom-10 right-1/4 glass-node p-6 rounded-full flex items-center justify-center animate-float stagger-2">
              <span className="material-symbols-outlined text-white text-xl">auto_awesome</span>
            </div>
            <div className="absolute top-1/2 -right-4 glass-node p-3 rounded-full flex items-center justify-center animate-float stagger-3">
              <span className="material-symbols-outlined text-white text-xs">token</span>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[300px]">
            {/* Main Feature Card */}
            <div className="md:col-span-8 md:row-span-2 bg-surface-container-low rounded-sm p-12 flex flex-col justify-between border border-white/5 relative overflow-hidden group animate-fade-in-up hover-lift">
              <div className="relative z-10">
                <span className="font-headline text-xs tracking-[0.3em] text-neutral-500 uppercase mb-4 block">
                  01 Core Feature
                </span>
                <h3 className="text-4xl font-headline font-bold text-white mb-6">Intelligent Response Generation</h3>
                <p className="text-on-surface-variant max-w-md text-lg leading-relaxed">
                  Advanced language models that understand context and nuance. ChatterBox AI delivers responses that feel natural, insightful, and truly human-like.
                </p>
              </div>
              <div className="relative z-10 flex gap-4 mt-8">
                <div className="bg-surface-container-high px-4 py-2 rounded-full border border-white/10 text-xs font-mono uppercase text-white">
                  Response Time: 0.2s
                </div>
                <div className="bg-surface-container-high px-4 py-2 rounded-full border border-white/10 text-xs font-mono uppercase text-white">
                  Conversations: 10K+
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 group-hover:opacity-50 transition-opacity">
                <img
                  alt="Data Visual"
                  className="w-full h-full object-cover grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxbGC5_LeuNC1wre3F3jPtedSXGOBlEH7BdnbCPnCP9b1c3mNjK_g_yX4OrcImlPFmdl7-sEp_c0Yh8_wQ8El4dzSnGFaLYn59R40xpP7H8C5VEmBKuK5KkRLjZNzskk2JB7lXGORv9sAQ8cj8RpebFeGFIOk3KG57-6GTWB2xKQbcRGy_jTO0PPGK6QFdNKLle2_tOGTIKqqU_-8EW5a7juKDQYX0WFtqYNS6YyOLRuhz2-1ydirNIgNDbBKLDz_WGckbyaMCNP8"
                />
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="md:col-span-4 bg-surface-container-high rounded-sm p-8 border border-white/5 animate-fade-in-up stagger-1 hover-lift">
              <span className="material-symbols-outlined text-white text-3xl mb-6">security</span>
              <h4 className="text-xl font-headline font-bold text-white mb-2">Enterprise-Grade Privacy</h4>
              <p className="text-sm text-on-surface-variant">End-to-end encrypted conversations with strict data protection standards.</p>
            </div>

            <div className="md:col-span-4 bg-surface-container-lowest rounded-sm p-8 border border-white/5 flex flex-col justify-end animate-fade-in-up stagger-2 hover-lift">
              <h4 className="text-xl font-headline font-bold text-white mb-2">Unlimited Conversations</h4>
              <p className="text-sm text-on-surface-variant">No limits on interactions. Chat freely, explore ideas, and learn continuously.</p>
              <div className="mt-6 h-1 w-full bg-neutral-800">
                <div className="h-full bg-primary w-2/3"></div>
              </div>
            </div>

            <div className="md:col-span-4 md:row-span-1 bg-surface rounded-sm p-8 border border-white/5 flex items-center justify-center animate-fade-in-up stagger-3 hover-lift">
              <div className="text-center">
                <span className="block text-6xl font-headline font-black text-white mb-2 tracking-tighter">
                  98.7%
                </span>
                <span className="text-xs tracking-widest text-neutral-500 uppercase">Accuracy Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* Evolution Section */}
        <section className="py-48 px-8 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24 items-center">
            <div className="relative animate-fade-in-left">
              <div className="aspect-square bg-surface-container-low rounded-sm border border-white/10 flex items-center justify-center overflow-hidden hover-lift">
                <img
                  alt="Abstract Mesh"
                  className="w-full h-full object-cover grayscale hover:scale-110 transition-transform duration-1000"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAAd0RtIsCH8P36xDufgXw-NqQ3asCycB0q0zGhlERHM0aBZqBE3y4s8ZoyImEYbFg31_3yiPfor9hlZWcv1VwrLPNw_tnvjfOb7pbUtPvlO60XA_zE_oCSBZAcfwc_mTAEtCFJlW_tT-H_ZjMJAqbYkqIXBjIjdh6asru_62bjZJ2PEESzL_it51J3bdNBrFSwL9sbOcClzcdqQBVRwxMPf9ILkG_esqYO8FidXhaDUuNHHKR93eJZTDmidGeAykSS1N8_YRiVU8"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 glass-node p-8 rounded-sm max-w-xs animate-fade-in-up stagger-2">
                <p className="text-sm italic font-light text-white leading-relaxed">
                  "The boundary between human intent and machine execution has dissolved. Monolith is the bridge."
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full monolith-gradient"></div>
                  <span className="text-[10px] tracking-widest uppercase text-neutral-400">Project Architect</span>
                </div>
              </div>
            </div>
            <div className="animate-fade-in-right">
              <h2 className="text-5xl font-headline font-bold text-white mb-8 tracking-tighter uppercase">
                The Evolution of Conversation
              </h2>
              <div className="space-y-12">
                <div className="flex gap-6 animate-fade-in-up stagger-1 hover-lift">
                  <div className="flex-shrink-0 w-12 h-12 bg-white text-on-primary flex items-center justify-center rounded-sm">
                    <span className="material-symbols-outlined">schema</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-headline font-bold text-white mb-2 uppercase tracking-wide">
                      Adaptive Understanding
                    </h5>
                    <p className="text-on-surface-variant leading-relaxed">
                      ChatterBox learns your communication style and adapts responses to match your preferences and needs. Better conversations with every chat.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 animate-fade-in-up stagger-2 hover-lift">
                  <div className="flex-shrink-0 w-12 h-12 border border-outline-variant text-white flex items-center justify-center rounded-sm">
                    <span className="material-symbols-outlined">model_training</span>
                  </div>
                  <div>
                    <h5 className="text-lg font-headline font-bold text-white mb-2 uppercase tracking-wide">
                      Continuous Learning
                    </h5>
                    <p className="text-on-surface-variant leading-relaxed">
                      Every conversation improves the model, making responses smarter and more insightful. Your feedback shapes the future of ChatterBox AI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-12 uppercase tracking-tighter animate-fade-in-up">
            Ready to Transform How You Communicate?
          </h2>
          <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-12 animate-fade-in-up stagger-1"></div>
          <button
            onClick={() => navigate('/chat')}
            className="group relative px-16 py-6 bg-white text-on-primary font-headline font-black text-lg tracking-[0.2em] rounded-sm overflow-hidden transition-all hover:scale-105 active:scale-95 animate-fade-in-up stagger-2 hover-scale"
          >
            <span className="relative z-10">START CHATTING TODAY</span>
            <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <p className="mt-8 text-neutral-500 font-mono text-xs uppercase tracking-[0.3em] animate-fade-in-up stagger-3">
            Join thousands of users already using ChatterBox AI
          </p>
        </section>
      </main>
      <MonolithFooter />
    </div>
  );
};

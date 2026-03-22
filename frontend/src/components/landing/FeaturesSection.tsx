import { useEffect, useRef } from 'react';
import { Brain, Zap, TrendingUp, Shield, Plug, Clock } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    id: 'intelligence',
    icon: <Brain size={40} />,
    title: 'Advanced Intelligence',
    description: 'Powered by cutting-edge AI models for nuanced, context-aware responses',
  },
  {
    id: 'lightning',
    icon: <Zap size={40} />,
    title: 'Lightning Fast',
    description: 'Get instant responses optimized for speed without compromising quality',
  },
  {
    id: 'learning',
    icon: <TrendingUp size={40} />,
    title: 'Always Learning',
    description: 'ChatterBox AI improves with every interaction, adapting to your needs',
  },
  {
    id: 'privacy',
    icon: <Shield size={40} />,
    title: 'Privacy First',
    description: 'Your conversations are encrypted and secure. Your privacy is our priority',
  },
  {
    id: 'integration',
    icon: <Plug size={40} />,
    title: 'Seamless Integration',
    description: 'Integrate ChatterBox AI into your workflow effortlessly',
  },
  {
    id: 'availability',
    icon: <Clock size={40} />,
    title: '24/7 Availability',
    description: 'ChatterBox AI is always available whenever you need intelligent assistance',
  },
];

export const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Simple fade-in animation on mount
    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: index * 0.1,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="features" ref={sectionRef} className="relative z-20 py-20 bg-black px-4 sm:px-6 lg:px-8 w-full" style={{ display: 'block' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose ChatterBox AI
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Experience powerful features designed to revolutionize how you work with AI
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="group bg-gray-950 border border-gray-800 rounded-xl p-8 hover:border-cyan-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-cyan-500/10"
            >
              {/* Icon */}
              <div className="mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { useEffect, useRef, Component, type ReactNode } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

// Error boundary for safety
class HeroErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="h-screen bg-black" />;
    }
    return this.props.children;
  }
}

export const HeroSection = () => {
  const titleRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // Fade in background (0-0.3s)
    tl.from(badgeRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      ease: 'back.out',
    }, 0.2)
      // Subtitle fades in (1.0-1.5s)
      .from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power3.out',
        },
        0.8
      )
      // CTA buttons fade and scale up (1.3-1.8s)
      .from(
        Array.from(ctaRef.current?.querySelectorAll('button') ?? []),
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
          duration: 0.5,
          stagger: 0.15,
          ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        1.0
      )
      // Stats fade in
      .from(
        Array.from(statsRef.current?.querySelectorAll('div') ?? []),
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        },
        1.3
      );

    // Animate scroll indicator (continuous)
    gsap.to(scrollRef.current, {
      y: 12,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <HeroErrorBoundary>
      <section id="home" className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
        {/* Premium gradient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-950" />
          
          {/* Subtle animated gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" style={{ transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center h-full">
          {/* Main Title */}
          <div ref={titleRef} className="mb-8">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-cyan-400 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20">
                ✨ The Future of AI Conversations
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
              ChatterBox
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <div ref={subtitleRef} className="mb-10 max-w-2xl">
            <p className="text-xl md:text-2xl text-gray-300 font-light leading-relaxed">
              Experience intelligent conversations powered by advanced AI. Transform your workflow with cutting-edge technology designed for tomorrow.
            </p>
          </div>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="group relative px-8 py-4 rounded-lg bg-white text-black font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105">
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button className="group px-8 py-4 rounded-lg border border-gray-700 text-white font-semibold text-lg transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/5 hover:shadow-lg hover:shadow-cyan-500/10">
              <span className="flex items-center gap-2">
                Explore Features
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-12 w-full">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">10M+</p>
              <p className="text-sm text-gray-400">Conversations Daily</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">99.9%</p>
              <p className="text-sm text-gray-400">Uptime SLA</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white">150+</p>
              <p className="text-sm text-gray-400">Countries</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        >
          <ChevronDown className="text-gray-600 w-6 h-6" />
        </div>
      </section>
    </HeroErrorBoundary>
  );
};

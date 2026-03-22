import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const CTASection = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
    });

    tl.from(headlineRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    })
      .from(
        subheadlineRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      )
      .from(
        buttonsRef.current,
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.3'
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="cta" className="relative z-20 py-20 bg-black px-4 sm:px-6 lg:px-8 border-t border-gray-800 w-full" style={{ display: 'block' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2
          ref={headlineRef}
          className="text-4xl md:text-5xl font-bold text-white mb-6"
        >
          Ready to Experience ChatterBox AI?
        </h2>

        <p
          ref={subheadlineRef}
          className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed"
        >
          Join thousands of users transforming their work with intelligent conversations.
          Start your free trial today with no credit card required.
        </p>

        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg">
            Get Started Free
          </button>
          <button className="bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold border border-gray-600 hover:border-gray-400 transition-colors text-lg">
            Schedule a Demo
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-8">
          No credit card required. Full access for 14 days.
        </p>
      </div>
    </section>
  );
};

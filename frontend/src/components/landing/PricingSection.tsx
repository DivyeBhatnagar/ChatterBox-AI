import { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PricingTier {
  name: string;
  subtitle: string;
  price: number;
  period: string;
  yearlyPrice?: number;
  yearlySavings?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Essential',
    subtitle: 'ChatterBox AI Essential',
    price: 0,
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      '50 conversations per month',
      'Basic AI responses',
      '1 GB storage',
      'Community support',
      'Standard response time',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    subtitle: 'ChatterBox AI Pro',
    price: 19,
    period: '/month',
    yearlyPrice: 190,
    yearlySavings: 'Save 17%',
    description: 'For professionals and teams',
    features: [
      'Unlimited conversations',
      'Advanced AI responses with reasoning',
      '100 GB storage',
      'Priority email support',
      'Instant response time',
      'Custom integrations',
      'Advanced analytics',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'ChatterBox AI Enterprise',
    price: 0,
    period: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited everything',
      'Dedicated account manager',
      'Custom AI training',
      'Advanced security features',
      'SLA guarantee',
      'White-label options',
      'API access',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
  },
];

export const PricingSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: index * 0.15,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const renderPrice = (tier: PricingTier) => {
    if (tier.price === 0 && tier.period === 'Custom') {
      return 'Custom';
    }
    if (tier.price === 0) {
      return 'Free';
    }
    return `$${tier.price}`;
  };

  return (
    <section id="pricing" ref={sectionRef} className="relative z-20 py-20 bg-black px-4 sm:px-6 lg:px-8 w-full" style={{ display: 'block' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Always flexible to scale.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className={`relative rounded-2xl transition-all duration-300 ${
                tier.highlighted
                  ? 'bg-gradient-to-b from-gray-900 to-gray-950 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20 md:scale-105'
                  : 'bg-gray-950 border border-gray-800'
              }`}
            >
              {/* Recommended Badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-cyan-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Tier Name */}
                <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-sm text-gray-500 mb-6">{tier.subtitle}</p>

                {/* Price */}
                <div className="mb-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      {renderPrice(tier)}
                    </span>
                    <span className="text-gray-400">{tier.period}</span>
                  </div>
                  {tier.yearlyPrice && (
                    <p className="text-sm text-cyan-400 mt-2">
                      {tier.yearlySavings} with yearly billing (${tier.yearlyPrice}/year)
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-8">{tier.description}</p>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors ${
                    tier.highlighted
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400'
                      : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {tier.cta}
                </button>

                {/* Features List */}
                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex gap-3">
                      <Check size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Note */}
        <div className="text-center mt-16">
          <p className="text-gray-400">
            Need more information?{' '}
            <a href="#contact" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

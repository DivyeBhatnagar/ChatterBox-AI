import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from './shared/TopAppBar';
import { MonolithFooter } from './shared/MonolithFooter';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  yearlyPrice?: number;
}

export const MonolithPricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      period: 'month',
      description: 'Perfect for exploring ChatterBox AI',
      features: [
        '25 messages per day',
        'Standard AI model',
        'Basic response speed',
        'Short conversation memory',
        'Limited customization',
      ],
      cta: 'Get Started',
      highlighted: false,
      yearlyPrice: 0,
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: isYearly ? 2491 : 249,
      period: 'month',
      description: 'For power users who need more',
      features: [
        '300 messages per day',
        'Advanced AI model',
        'Faster response speed',
        'Full conversation history',
        'Custom AI personality',
        'Priority access during high load',
      ],
      cta: 'Upgrade to Pro',
      highlighted: true,
      yearlyPrice: 2491,
    },
    {
      id: 'max',
      name: 'Max Plan',
      price: isYearly ? 6991 : 699,
      period: 'month',
      description: 'For teams and enterprise needs',
      features: [
        '1000+ messages per day',
        'Premium AI model (highest quality)',
        'Fastest responses',
        'Long-term memory',
        'Advanced customization options',
        'Early access to new features',
        'API access',
      ],
      cta: 'Go Max',
      highlighted: false,
      yearlyPrice: 6991,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      navigate('/signup');
    } else {
      // In a real app, this would redirect to payment
      alert(`${planId.toUpperCase()} plan - Payment integration coming soon!`);
    }
  };

  const discount = isYearly ? 20 : 0;

  return (
    <div className="bg-background text-on-surface font-body min-h-screen flex flex-col">
      <TopAppBar />

      <main className="flex-1 pt-24 pb-20">
        {/* Background Effects */}
        <div className="fixed inset-0 top-20 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          {/* Header Section */}
          <section className="text-center mb-24 px-6">
            <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-on-surface-variant max-w-2xl mx-auto mb-12">
              Choose the plan that fits your workflow
            </p>

            {/* Toggle Monthly/Yearly */}
            <div className="flex items-center justify-center gap-4 mb-16">
              <span className={`${!isYearly ? 'text-white font-bold' : 'text-neutral-500'}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isYearly ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-neutral-950 transition-transform ${
                    isYearly ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`${isYearly ? 'text-white font-bold' : 'text-neutral-500'}`}>Yearly</span>
              {isYearly && (
                <div className="ml-4 px-4 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                  <span className="text-sm font-bold text-green-400">Save 20%</span>
                </div>
              )}
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="px-6 max-w-7xl mx-auto mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative group transition-all duration-300 ${
                    plan.highlighted ? 'md:scale-105' : ''
                  }`}
                >
                  {/* Glow Effect for Highlighted Plan */}
                  {plan.highlighted && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-sm blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  )}

                  <div
                    className={`h-full flex flex-col p-12 rounded-sm border transition-all duration-300 ${
                      plan.highlighted
                        ? 'border-white/30 bg-surface-container-high'
                        : 'border-white/10 bg-surface-container-low hover:border-white/20'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                        <div className="px-4 py-1 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Plan Name */}
                    <h3 className="font-headline text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-neutral-500 text-sm mb-8">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="font-headline text-5xl font-black text-white">₹{plan.price.toLocaleString()}</span>
                        <span className="text-neutral-500">/{plan.period}</span>
                      </div>
                      {isYearly && plan.yearlyPrice && plan.price !== 0 && (
                        <p className="text-xs text-green-400">
                          ₹{plan.yearlyPrice.toLocaleString()}/year (Save {discount}%)
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-green-400 text-sm mt-0.5">check_circle</span>
                            <span className="text-neutral-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-4 font-headline font-bold text-sm uppercase tracking-widest rounded-sm transition-all duration-300 ${
                        plan.highlighted
                          ? 'bg-white text-black hover:bg-neutral-200 shadow-lg'
                          : 'bg-surface-container-highest text-white border border-white/10 hover:border-white/30 hover:bg-white/5'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Note */}
          <section className="text-center px-6 mb-24">
            <div className="max-w-2xl mx-auto p-8 bg-surface-container-low border border-white/5 rounded-sm">
              <p className="text-neutral-400 text-sm">
                <span className="font-bold text-white">Cancel anytime.</span> No hidden fees. Upgrade or downgrade your plan
                at any time.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-3xl mx-auto px-6 mb-24">
            <h2 className="font-headline text-3xl font-bold text-white text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Can I upgrade or downgrade anytime?',
                  a: 'Yes! You can change your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'What happens if I exceed my message limit?',
                  a: 'We\'ll notify you when you\'re approaching your limit. You can upgrade anytime to get more messages.',
                },
                {
                  q: 'Do you offer refunds?',
                  a: 'We offer a 14-day money-back guarantee if you\'re not satisfied with our service.',
                },
                {
                  q: 'Is there a free trial for Pro?',
                  a: 'Start with our Free plan to explore features. Upgrade to Pro whenever you\'re ready.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-surface-container-low border border-white/10 rounded-sm p-6 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <summary className="flex items-center justify-between font-headline font-bold text-white">
                    {faq.q}
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="text-neutral-400 mt-4">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MonolithFooter />
    </div>
  );
};

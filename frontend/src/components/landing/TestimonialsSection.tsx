import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company?: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'ChatterBox AI has transformed how I work. It\'s like having an expert assistant available 24/7. The responsiveness and accuracy are impressive.',
    author: 'Sarah Chen',
    title: 'Product Manager',
    company: 'Tech Innovations Inc.',
    avatar: 'SC',
    rating: 5,
  },
  {
    quote:
      'The speed and accuracy of ChatterBox AI responses is incredible. It saves me hours every day on repetitive tasks and complex problem-solving.',
    author: 'Marcus Rodriguez',
    title: 'Senior Developer',
    company: 'Digital Solutions Ltd.',
    avatar: 'MR',
    rating: 5,
  },
  {
    quote:
      'Finally, an AI assistant that actually understands context and nuance. The integration into our workflow was seamless. Highly recommended!',
    author: 'Emily Thompson',
    title: 'Design Director',
    company: 'Creative Studio Co.',
    avatar: 'ET',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
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

  return (
    <section id="testimonials" ref={sectionRef} className="relative z-20 py-20 bg-gray-950 px-4 sm:px-6 lg:px-8 w-full" style={{ display: 'block' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Loved by Users Worldwide
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            See what our users are saying about ChatterBox AI
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="bg-black rounded-xl p-8 border border-gray-800 hover:border-gray-700 transition-all"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-300 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-400">
                    {testimonial.title}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

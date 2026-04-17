import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaggeredAnimation } from "@/hooks/useAnimations";
import { supabase } from "@/integrations/supabase/client";
import type { Testimonial } from "@/types/admin-content";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  useStaggeredAnimation(200);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('published', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(
      currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    );
  };

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-20 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-md">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">
              Patient Testimonials
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight" style={{ color: 'hsl(207 61% 35%)' }}>
            What Our Patients Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from thousands of satisfied
            patients who have experienced the LifeBloom difference.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto stagger-animate animate-on-scroll stagger-2">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center animate-pulse">
              <div className="h-8 bg-slate-200 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-6 bg-slate-200 rounded w-full mb-4"></div>
              <div className="h-6 bg-slate-200 rounded w-5/6 mx-auto"></div>
            </div>
          ) : testimonials.length > 0 ? (
            <>
              {/* Main Testimonial */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 lg:p-16 transition-all duration-300 hover:shadow-xl">
                <div className="mb-10">
                  <Quote className="w-16 h-16 text-primary/20 mx-auto mb-8" />
                  <p className="text-xl lg:text-2xl text-slate-700 leading-relaxed font-normal mb-10 italic">
                    "{testimonials[currentIndex].testimonial_text}"
                  </p>

                  {/* Rating */}
                  <div className="flex justify-center space-x-1 mb-8">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="flex items-center justify-center space-x-4 pt-8 border-t border-slate-200">
                  {testimonials[currentIndex].image_url && (
                    <img
                      src={testimonials[currentIndex].image_url}
                      alt={testimonials[currentIndex].customer_name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-200"
                    />
                  )}
                  <div className="text-left">
                    <h4 className="text-lg font-semibold text-slate-900">
                      {testimonials[currentIndex].customer_name}
                    </h4>
                    {testimonials[currentIndex].customer_role && (
                      <p className="text-sm text-slate-500">
                        {testimonials[currentIndex].customer_role}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white shadow-md border-slate-200 hover:bg-slate-50 hover:border-primary transition-all"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white shadow-md border-slate-200 hover:bg-slate-50 hover:border-primary transition-all"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                  </Button>

                  {/* Dots Indicator */}
                  <div className="flex justify-center space-x-2 mt-10">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? "bg-primary w-8"
                            : "bg-slate-300 w-2 hover:bg-slate-400"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No testimonials available</p>
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-animate animate-on-scroll stagger-3">
          <div className="space-y-2 p-6 bg-white rounded-xl border border-slate-200">
            <div className="text-4xl font-bold text-primary">4.9/5</div>
            <div className="text-sm text-slate-600 font-medium">Average Rating</div>
          </div>
          <div className="space-y-2 p-6 bg-white rounded-xl border border-slate-200">
            <div className="text-4xl font-bold text-primary">500+</div>
            <div className="text-sm text-slate-600 font-medium">Happy Patients</div>
          </div>
          <div className="space-y-2 p-6 bg-white rounded-xl border border-slate-200">
            <div className="text-4xl font-bold text-primary">99%</div>
            <div className="text-sm text-slate-600 font-medium">
              Satisfaction Rate
            </div>
          </div>
          <div className="space-y-2 p-6 bg-white rounded-xl border border-slate-200">
            <div className="text-4xl font-bold text-primary">2+</div>
            <div className="text-sm text-slate-600 font-medium">
              Years of Service
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

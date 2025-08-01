import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaggeredAnimation } from "@/hooks/useAnimations";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  useStaggeredAnimation(200);

  const testimonials = [
    {
      name: "Sumu Ahmed",
      role: "Patient",
      image: "src/assets/sumu.jpg",
      rating: 5,
      text: "LifeBloom Pharmacy is my go-to place for medicines. The staff is friendly, and they always explain how to use my medicines clearly.",
    },
    {
      name: "Mrinmoy Jyoti Das",
      role: "Regular Customer",
      image: "https://cdn-icons-png.flaticon.com/512/9187/9187532.png",
      rating: 5,
      text: "LifeBloom always has the medicines I need. The service is quick and the staff is helpful",
    },
    {
      name: "Elon Musk",
      role: "Family Patient",
      image:
        "https://futureoflife.org/wp-content/uploads/2020/08/elon_musk_royal_society.jpg",
      rating: 5,
      text: "Best pharmacy in the area. Reasonable prices and supportive staff",
    },
  ];

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
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Quote className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Patient Testimonials
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
            What Our Patients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from thousands of satisfied
            patients who have experienced the LifeBloom difference.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto stagger-animate animate-on-scroll stagger-2">
          {/* Main Testimonial */}
          <div className="glass-card p-8 lg:p-12 text-center hover-lift">
            <div className="mb-8">
              <Quote className="w-12 h-12 text-secondary/30 mx-auto mb-6" />
              <p className="text-xl lg:text-2xl text-foreground leading-relaxed font-medium mb-8">
                "{testimonials[currentIndex].text}"
              </p>

              {/* Rating */}
              <div className="flex justify-center space-x-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            {/* Patient Info */}
            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-secondary/20"
              />
              <div className="text-left">
                <h4 className="text-lg font-semibold text-primary">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-muted-foreground">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 glass-card hover:bg-primary hover:text-white"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 glass-card hover:bg-primary hover:text-white"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center stagger-animate animate-on-scroll stagger-3">
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text">500+</div>
            <div className="text-sm text-muted-foreground">Happy Patients</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text">99%</div>
            <div className="text-sm text-muted-foreground">
              Satisfaction Rate
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold gradient-text">2+</div>
            <div className="text-sm text-muted-foreground">
              Years of Service
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default TestimonialsSection;

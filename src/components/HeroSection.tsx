import { useEffect, useState } from "react";
import {
  ArrowRight,
  Play,
  Shield,
  Award,
  Users,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStaggeredAnimation } from "@/hooks/useAnimations";
import heroBg from "@/assets/hero-bg1.jpg";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useStaggeredAnimation(200);

  useEffect(() => {
    setIsLoaded(true);
  }, []);
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="LifeBloom Healthcare"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen pt-20">
          {/* Left Content */}
          <div
            className={`space-y-8 ${
              isLoaded ? "animate-fade-in-up" : "opacity-0"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30 stagger-animate animate-on-scroll stagger-1">
              <Award className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-secondary">
                Trusted Healthcare Partner
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4 stagger-animate animate-on-scroll stagger-2">
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                <span className="text-primary">Prevent.</span>{" "}
                <span className="text-secondary">Preserve.</span>{" "}
                <span className="gradient-text">Prosper.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Experience premium healthcare services with LifeBloom - where
                modern medicine meets compassionate care for your wellness
                journey.
              </p>
            </div>

            {/* Offer Badge */}
            <div className="relative inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-green-300 bg-gradient-to-r from-green-50/60 to-white/30 backdrop-blur-md shadow-md ring-1 ring-green-400/30 hover:ring-green-500/60 transition-all duration-300 group stagger-animate animate-on-scroll stagger-1.5">
              <BadgePercent className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-semibold text-green-700 group-hover:text-green-800">
                Up to 10% Off on Medicine & Lab Tests
              </span>
            </div>

            {/* CTA Buttons */}
            {/* <div className="flex flex-col sm:flex-row gap-4 stagger-animate animate-on-scroll stagger-3">
              <Button className="btn-premium group">
                Book a Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-outline-premium group">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
            </div> */}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-6 stagger-animate animate-on-scroll stagger-4">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Users className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">500+</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Happy Patients
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Shield className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">24/7</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Support
                </p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Award className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">2+</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Years Excellence
                </p>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Elements */}
          <div
            className={`relative hidden lg:block ${
              isLoaded ? "animate-fade-in-left" : "opacity-0"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <div className="relative">
              {/* Main Floating Card */}
              <div className="glass-card floating-card p-8 max-w-md mx-auto animate-float">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto glow-effect animate-glow">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">
                    Your Health, Our Priority
                  </h3>
                  <p className="text-muted-foreground">
                    Comprehensive healthcare solutions tailored to your needs
                  </p>
                </div>
              </div>

              {/* Floating Badges */}
              <div
                className="absolute -top-10 -left-1 glass-card floating-card p-4 animate-bounce-in"
                style={{ animationDelay: "1s" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">99%</div>
                  <div className="text-xs text-muted-foreground">
                    Satisfaction
                  </div>
                </div>
              </div>

              <div
                className="absolute -bottom-10 -right-5 glass-card floating-card p-4 animate-bounce-in"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Quality</div>
                  <div className="text-xs text-muted-foreground">Assured</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div
        className="absolute bottom-1/4 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse-slow"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="scroll-indicator"></div>
      </div>
    </section>
  );
};

export default HeroSection;

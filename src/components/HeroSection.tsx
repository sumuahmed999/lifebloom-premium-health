import { ArrowRight, Play, Shield, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
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
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
              <Award className="w-5 h-5 text-secondary" />
              <span className="text-sm font-medium text-secondary">Trusted Healthcare Partner</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-display font-bold leading-tight">
                <span className="text-primary">Prevent.</span>{' '}
                <span className="text-secondary">Preserve.</span>{' '}
                <span className="gradient-text">Prosper.</span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Experience premium healthcare services with LifeBloom - where modern medicine meets compassionate care for your wellness journey.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-premium group">
                Book a Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="btn-outline-premium group">
                <Play className="w-5 h-5 mr-2" />
                Watch Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Users className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">50K+</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Happy Patients</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Shield className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">24/7</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Available Support</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start space-x-2">
                  <Award className="w-6 h-6 text-secondary" />
                  <span className="text-3xl font-bold text-primary">15+</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Years Excellence</p>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Elements */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main Floating Card */}
              <div className="glass-card floating-card p-8 max-w-md mx-auto">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto glow-effect">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary">Your Health, Our Priority</h3>
                  <p className="text-muted-foreground">Comprehensive healthcare solutions tailored to your needs</p>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-10 -left-10 glass-card floating-card p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">99%</div>
                  <div className="text-xs text-muted-foreground">Satisfaction</div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 glass-card floating-card p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">ISO</div>
                  <div className="text-xs text-muted-foreground">Certified</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
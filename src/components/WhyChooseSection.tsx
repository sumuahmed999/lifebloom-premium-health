import { Shield, Clock, Award, Users, ThumbsUp, Star, Zap, Heart } from 'lucide-react';
import { useStaggeredAnimation } from '@/hooks/useAnimations';

const WhyChooseSection = () => {
  useStaggeredAnimation(120);
  const reasons = [
    {
      icon: Users,
      title: "Trusted by Thousands",
      description: "Over 50,000 satisfied patients trust us for their healthcare needs",
      stat: "50K+",
      statLabel: "Happy Patients"
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Round-the-clock availability for emergencies and consultations",
      stat: "24/7",
      statLabel: "Available"
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "ISO certified processes ensuring the highest quality standards",
      stat: "100%",
      statLabel: "Quality"
    },
    {
      icon: Award,
      title: "Expert Team",
      description: "Certified pharmacists and healthcare professionals at your service",
      stat: "15+",
      statLabel: "Years Experience"
    },
    {
      icon: ThumbsUp,
      title: "Affordable Care",
      description: "Competitive pricing with insurance coverage and payment plans",
      stat: "30%",
      statLabel: "Cost Savings"
    },
    {
      icon: Star,
      title: "Premium Service",
      description: "Luxury healthcare experience with personalized attention",
      stat: "5★",
      statLabel: "Rating"
    }
  ];

  const badges = [
    { icon: Shield, label: "ISO Certified", color: "from-blue-500 to-blue-600" },
    { icon: Award, label: "Healthcare Excellence", color: "from-green-500 to-green-600" },
    { icon: Zap, label: "Fast Service", color: "from-yellow-500 to-yellow-600" },
    { icon: Heart, label: "Patient Care", color: "from-pink-500 to-pink-600" }
  ];

  return (
    <section id="why-choose" className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Star className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Why Choose LifeBloom</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
            Experience the LifeBloom Difference
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover why thousands of patients choose LifeBloom for their healthcare needs and experience premium medical services that prioritize your well-being.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <div key={index} className="group stagger-animate animate-on-scroll" style={{ animationDelay: `${index * 0.15}s` }}>
                <div className="glass-card floating-card p-8 h-full text-center hover-lift">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 glow-effect hover-glow">
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary group-hover:text-secondary transition-colors duration-300">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {reason.description}
                    </p>

                    {/* Stat */}
                    <div className="pt-4 border-t border-border/50">
                      <div className="text-3xl font-bold gradient-text">{reason.stat}</div>
                      <div className="text-sm text-muted-foreground">{reason.statLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12 stagger-animate animate-on-scroll" style={{ animationDelay: '1s' }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-primary mb-4">
              Our Certifications & Awards
            </h3>
            <p className="text-lg text-muted-foreground">
              Recognized for excellence in healthcare services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="group stagger-animate animate-on-scroll" style={{ animationDelay: `${1.2 + index * 0.1}s` }}>
                  <div className="glass-card floating-card p-6 text-center hover-lift">
                    <div className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 hover-glow`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-primary">{badge.label}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center stagger-animate animate-on-scroll" style={{ animationDelay: '1.6s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">ISO</div>
              <div className="text-sm text-muted-foreground">9001:2015</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">FDA</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">WHO</div>
              <div className="text-sm text-muted-foreground">Standards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">GMP</div>
              <div className="text-sm text-muted-foreground">Certified</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
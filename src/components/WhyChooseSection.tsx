import {
  Shield,
  Clock,
  Award,
  Users,
  ThumbsUp,
  Star,
  Zap,
  Heart,
  UserCheck,
} from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useAnimations";

const WhyChooseSection = () => {
  useStaggeredAnimation(120);
  const additionalServices = [
    {
      icon: UserCheck,
      title: "Expert Consultation",
      description: "Certified pharmacists and healthcare professionals",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer service and emergency support",
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Authentic medicines with proper storage and handling",
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Personalized care plans and health monitoring",
    },
  ];

  const badges = [
    {
      icon: Shield,
      label: "Quality Assured",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Award,
      label: "Healthcare Excellence",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Zap,
      label: "Fast Service",
      color: "from-yellow-500 to-yellow-600",
    },
    { icon: Heart, label: "Patient Care", color: "from-pink-500 to-pink-600" },
  ];

  return (
    <section
      id="why-choose"
      className="py-2 bg-gradient-to-b from-muted/30 to-background"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-6 mb-16 stagger-animate animate-on-scroll">
          <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
            <Star className="w-5 h-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Why Choose LifeBloom
            </span>
          </div>

          {/* Additional Services */}
          <div
            className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12 stagger-animate animate-on-scroll"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-display font-bold text-primary mb-4">
                Why Choose LifeBloom?
              </h3>
              <p className="text-lg text-muted-foreground">
                Experience the difference with our premium healthcare services
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {additionalServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div
                    key={index}
                    className="text-center space-y-4 stagger-animate animate-on-scroll"
                    style={{ animationDelay: `${1 + index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 glow-effect hover-glow">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-primary">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Badges Section */}
        <div
          className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl p-8 lg:p-12 stagger-animate animate-on-scroll"
          style={{ animationDelay: "1s" }}
        >
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
                <div
                  key={index}
                  className="group stagger-animate animate-on-scroll"
                  style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                >
                  <div className="glass-card floating-card p-6 text-center hover-lift">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${badge.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 hover-glow`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-primary">
                      {badge.label}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;

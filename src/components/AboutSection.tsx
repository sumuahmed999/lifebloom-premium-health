import { Target, Heart, Users2, CheckCircle } from "lucide-react";
import { useStaggeredAnimation } from "@/hooks/useAnimations";
import pharmacyInterior from "@/assets/pharmacy-interior.jpg";

const AboutSection = () => {
  useStaggeredAnimation(150);
  const achievements = [
    "2+ Years of Healthcare Excellence",
    "500+ Satisfied Patients",
    "24/7 Emergency Support",
    "Quality Assured",
    "Expert Medical Team",
  ];

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div className="space-y-8 stagger-animate animate-on-scroll">
            {/* Section Header */}
            <div className="space-y-4 stagger-animate animate-on-scroll stagger-1">
              <div className="inline-flex items-center space-x-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-secondary/30">
                <Heart className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  About LifeBloom
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary leading-tight">
                Your Trusted Healthcare Partner
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                At LifeBloom, we believe healthcare should begin before
                hospitals - in awareness, daily habits, and empowered choices.
                We combine modern medical practices with compassionate service
                to help individuals lead healthier, fuller lives.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid sm:grid-cols-2 gap-6 stagger-animate animate-on-scroll stagger-2">
              <div className="glass-card floating-card p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Our Mission
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  To empower communities through accessible, affordable, and
                  preventive healthcare - blending modern medicine with
                  compassionate care to help individuals live healthier, more
                  fulfilling lives.
                </p>
              </div>

              <div className="glass-card floating-card p-6 hover-lift">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <Users2 className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">
                    Our Vision
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  To build a future where healthcare begins at home - empowering
                  individuals with awareness and preventive care before illness
                  takes hold, shaping a healthier tomorrow for all.
                </p>
              </div>
            </div>

            {/* Achievements List */}
            <div className="space-y-4 stagger-animate animate-on-scroll stagger-3">
              <h3 className="text-xl font-semibold text-primary">
                Why Choose LifeBloom?
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative stagger-animate animate-on-scroll stagger-4">
            <div className="relative overflow-hidden rounded-3xl hover-lift">
              <img
                src={pharmacyInterior}
                alt="LifeBloom Pharmacy Interior"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>

            {/* Floating Stats Cards */}
            <div
              className="absolute -top-6 -left-6 glass-card floating-card p-4 animate-bounce-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">2+</div>
                <div className="text-sm text-muted-foreground">Years</div>
              </div>
            </div>

            <div
              className="absolute -bottom-6 -right-6 glass-card floating-card p-4 animate-bounce-in"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-muted-foreground">Patients</div>
              </div>
            </div>

            <div
              className="absolute top-1/2 -right-8 glass-card floating-card p-4 animate-bounce-in"
              style={{ animationDelay: "0.9s" }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">24/7</div>
                <div className="text-xs text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

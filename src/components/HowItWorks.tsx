import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Truck, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Toto Scouts the Goods",
      subtitle: "Pick Your Bundle",
      description: "Toto sneaks into the 'bureau' to curate the perfect mix! Users select pet type (cat/dog), bundle size, and preferences (toys, treats, collars).",
      icon: Search,
      color: "from-secondary/60 to-secondary/40",
      bgColor: "bg-secondary/5",
      borderColor: "border-secondary/20"
    },
    {
      number: "02", 
      title: "Enlist in Toto's Crew",
      subtitle: "Subscribe & Customize",
      description: "Join the fun with a quick signup—Toto 'approves' your choices! Enter details, pick frequency (monthly/quarterly), and add extras like stickers.",
      icon: UserPlus,
      color: "from-teal/60 to-teal/40",
      bgColor: "bg-teal/5",
      borderColor: "border-teal/20"
    },
    {
      number: "03",
      title: "The Mystery Arrives",
      subtitle: "Delivery Day", 
      description: "Toto dispatches your box with stealthy speed! Track it via email, arriving in your branded eco-box. Free shipping tease: 'Faster than a cat's pounce!'",
      icon: Truck,
      color: "from-primary/60 to-primary/40",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20"
    },
    {
      number: "04",
      title: "Unleash the Mischief",
      subtitle: "Enjoy & Repeat",
      description: "Watch your pet go wild—Toto's job done! Unbox treats/toys, share photos for community features, and auto-renew for endless fun.",
      icon: Heart,
      color: "from-forest/60 to-forest/40",
      bgColor: "bg-forest/5",
      borderColor: "border-forest/20"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-background to-amber-50/15">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs font-medium">
              How it works
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Monthly mystery boxes curated by Toto
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Treats, toys, and surprises in eco-packaging delivered right to your door
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className={`relative p-6 sm:p-8 rounded-2xl ${step.bgColor} border-2 ${step.borderColor} hover:shadow-md transition-all duration-300 group ${
                    index === 0 ? 'bg-secondary/5 border-secondary/20' :
                    index === 1 ? 'bg-primary/5 border-primary/20' :
                    index === 2 ? 'bg-accent/5 border-accent/20' :
                    'bg-forest/5 border-forest/20'
                  }`}
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <h4 className="text-sm sm:text-base font-semibold text-muted-foreground">
                      {step.subtitle}
                    </h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <Link to="/products?category=subscription">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105">
                Ready for more adventures?
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Truck, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Pick Your Bundle",
      subtitle: "Toto Scouts the Goods",
      description: "Select pet type, bundle size, and preferences for the perfect curated mix.",
      icon: Search,
      color: "from-secondary/60 to-secondary/40",
      bgColor: "bg-secondary/5",
      borderColor: "border-secondary/20"
    },
    {
      number: "02", 
      title: "Subscribe & Customize",
      subtitle: "Enlist in Toto's Crew",
      description: "Quick signup, choose frequency (monthly/quarterly), and add extras.",
      icon: UserPlus,
      color: "from-teal/60 to-teal/40",
      bgColor: "bg-teal/5",
      borderColor: "border-teal/20"
    },
    {
      number: "03",
      title: "Delivery Day",
      subtitle: "The Mystery Arrives", 
      description: "Track your eco-box delivery with free shipping—faster than a cat's pounce!",
      icon: Truck,
      color: "from-primary/60 to-primary/40",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/20"
    },
    {
      number: "04",
      title: "Enjoy & Repeat",
      subtitle: "Unleash the Mischief",
      description: "Watch your pet go wild! Unbox, share photos, and auto-renew for endless fun.",
      icon: Heart,
      color: "from-forest/60 to-forest/40",
      bgColor: "bg-forest/5",
      borderColor: "border-forest/20"
    }
  ];

  return (
    <section className="py-6 sm:py-8 md:py-10 bg-gradient-to-b from-background to-amber-50/15">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <Badge variant="secondary" className="mb-2 px-3 py-1 text-xs font-medium">
              How it works
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Monthly mystery boxes curated by Toto
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Treats, toys, and surprises in eco-packaging delivered right to your door
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className={`relative p-4 sm:p-6 rounded-xl ${step.bgColor} border-2 ${step.borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer ${
                    index === 0 ? 'bg-secondary/5 border-secondary/20' :
                    index === 1 ? 'bg-primary/5 border-primary/20' :
                    index === 2 ? 'bg-accent/5 border-accent/20' :
                    'bg-forest/5 border-forest/20'
                  }`}
                >
                  {/* Step Number */}
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                    <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">
                      {step.subtitle}
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-8 sm:mt-10">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/products?category=subscription">
                <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105">
                  Subscription Boxes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:scale-105">
                  Get to Know Toto
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

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
      color: "from-secondary/80 to-secondary/60",
      bgColor: "bg-secondary/15",
      borderColor: "border-secondary/40"
    },
    {
      number: "02", 
      title: "Subscribe & Customize",
      subtitle: "Enlist in Toto's Crew",
      description: "Quick signup, choose frequency (monthly/quarterly), and add extras.",
      icon: UserPlus,
      color: "from-teal/80 to-teal/60",
      bgColor: "bg-teal/15",
      borderColor: "border-teal/40"
    },
    {
      number: "03",
      title: "Delivery Day",
      subtitle: "The Mystery Arrives", 
      description: "Track your eco-box delivery with free shipping—faster than a cat's pounce!",
      icon: Truck,
      color: "from-primary/80 to-primary/60",
      bgColor: "bg-primary/15",
      borderColor: "border-primary/40"
    },
    {
      number: "04",
      title: "Enjoy & Repeat",
      subtitle: "Unleash the Mischief",
      description: "Watch your pet go wild! Unbox, share photos, and auto-renew for endless fun.",
      icon: Heart,
      color: "from-forest/80 to-forest/60",
      bgColor: "bg-forest/15",
      borderColor: "border-forest/40"
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

          {/* Circular Steps Layout */}
          <div className="relative max-w-2xl mx-auto">
            {/* Mobile: Vertical Stack */}
            <div className="block md:hidden space-y-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={index}
                    className={`relative p-4 rounded-xl ${step.bgColor} border-2 ${step.borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Step Number Circle */}
                      <div className="w-10 h-10 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {step.number}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-foreground mb-1">
                          {step.title}
                        </h3>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                          {step.subtitle}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: Circular Layout */}
            <div className="hidden md:block relative">
              {/* Circular Container */}
              <div className="relative w-80 h-80 mx-auto">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  const angle = (index * 90) - 45; // Start at -45 degrees
                  const radius = 120;
                  const x = Math.cos(angle * Math.PI / 180) * radius;
                  const y = Math.sin(angle * Math.PI / 180) * radius;
                  
                  return (
                    <div
                      key={index}
                      className={`absolute w-32 h-32 p-4 rounded-2xl ${step.bgColor} border-2 ${step.borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                    >
                      {/* Step Number */}
                      <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {step.number}
                      </div>

                      {/* Content */}
                      <div className="text-center h-full flex flex-col justify-center">
                        <div className={`w-8 h-8 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-4 w-4 text-white" />
                        </div>
                        <h3 className="text-xs font-bold text-foreground mb-1 leading-tight">
                          {step.title}
                        </h3>
                        <h4 className="text-xs font-semibold text-muted-foreground leading-tight">
                          {step.subtitle}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connecting Arrows */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 relative">
                  {/* Arrow 1 -> 2 */}
                  <ArrowRight className="absolute top-8 right-0 h-4 w-4 text-muted-foreground/50" />
                  {/* Arrow 2 -> 3 */}
                  <ArrowRight className="absolute bottom-0 right-8 h-4 w-4 text-muted-foreground/50 rotate-90" />
                  {/* Arrow 3 -> 4 */}
                  <ArrowRight className="absolute bottom-8 left-0 h-4 w-4 text-muted-foreground/50 rotate-180" />
                  {/* Arrow 4 -> 1 */}
                  <ArrowRight className="absolute top-0 left-8 h-4 w-4 text-muted-foreground/50 -rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8 sm:mt-10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link to="/products?category=subscription">
                <Button size="sm" className="text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105">
                  Subscription Boxes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="sm" className="text-sm sm:text-base px-4 sm:px-6 py-3 sm:py-4 border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 hover:scale-105">
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

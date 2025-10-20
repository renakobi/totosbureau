import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Truck, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
    const steps = [
      {
        number: "1",
        title: "Pick Your Bundle",
        subtitle: "Toto Scouts the Goods",
      description: "Select pet type, bundle size, and preferences for the perfect curated mix.",
      icon: Search,
      color: "from-secondary/80 to-secondary/60",
      bgColor: "bg-secondary/40 md:bg-secondary/15",
      borderColor: "border-secondary/60 md:border-secondary/40"
    },
      {
        number: "2", 
        title: "Subscribe & Customize",
        subtitle: "Enlist in Toto's Crew",
      description: "Quick signup, choose frequency (monthly/quarterly), and add extras.",
      icon: UserPlus,
      color: "from-teal/80 to-teal/60",
      bgColor: "bg-teal/40 md:bg-teal/15",
      borderColor: "border-teal/60 md:border-teal/40"
    },
      {
        number: "3",
        title: "Delivery Day",
        subtitle: "The Mystery Arrives",
      description: "Track your eco-box delivery with free shipping—faster than a cat's pounce!",
      icon: Truck,
      color: "from-primary/80 to-primary/60",
      bgColor: "bg-primary/40 md:bg-primary/15",
      borderColor: "border-primary/60 md:border-primary/40"
    },
      {
        number: "4",
        title: "Enjoy & Repeat",
        subtitle: "Unleash the Mischief",
      description: "Watch your pet go wild! Unbox, share photos, and auto-renew for endless fun.",
      icon: Heart,
      color: "from-forest/80 to-forest/60",
      bgColor: "bg-forest/40 md:bg-forest/15",
      borderColor: "border-forest/60 md:border-forest/40"
    }
  ];

  return (
    <section className="py-6 sm:py-8 md:py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <Badge variant="secondary" className="mb-2 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-base font-medium">
                How it works
              </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Monthly mystery boxes curated by Toto
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Treats, toys, and surprises in eco-packaging delivered right to your door
            </p>
          </div>

          {/* Mobile 2x2 Grid Layout */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
              {/* Step 1 - Top Left */}
              <div className={`relative p-3 rounded-lg ${steps[0].bgColor} border-2 ${steps[0].borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {steps[0].number}
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${steps[0].color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(steps[0].icon, { className: "h-4 w-4 text-white" })}
                </div>
                <h3 className="text-xs font-bold text-foreground mb-1">
                  {steps[0].title}
                </h3>
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {steps[0].subtitle}
                </h4>
              </div>

              {/* Step 2 - Top Right */}
              <div className={`relative p-3 rounded-lg ${steps[1].bgColor} border-2 ${steps[1].borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {steps[1].number}
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${steps[1].color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(steps[1].icon, { className: "h-4 w-4 text-white" })}
                </div>
                <h3 className="text-xs font-bold text-foreground mb-1">
                  {steps[1].title}
                </h3>
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {steps[1].subtitle}
                </h4>
              </div>

              {/* Step 3 - Bottom Left */}
              <div className={`relative p-3 rounded-lg ${steps[2].bgColor} border-2 ${steps[2].borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {steps[2].number}
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${steps[2].color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(steps[2].icon, { className: "h-4 w-4 text-white" })}
                </div>
                <h3 className="text-xs font-bold text-foreground mb-1">
                  {steps[2].title}
                </h3>
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {steps[2].subtitle}
                </h4>
              </div>

              {/* Step 4 - Bottom Right */}
              <div className={`relative p-3 rounded-lg ${steps[3].bgColor} border-2 ${steps[3].borderColor} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-r from-primary/80 to-forest/80 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {steps[3].number}
                </div>
                <div className={`w-8 h-8 bg-gradient-to-r ${steps[3].color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(steps[3].icon, { className: "h-4 w-4 text-white" })}
                </div>
                <h3 className="text-xs font-bold text-foreground mb-1">
                  {steps[3].title}
                </h3>
                <h4 className="text-xs font-semibold text-muted-foreground">
                  {steps[3].subtitle}
                </h4>
              </div>
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                  <div
                    key={index}
                    className={`relative p-3 sm:p-4 rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer flex items-center border-2`}
                    style={{ 
                      aspectRatio: '3/1',
                      minHeight: '120px',
                      width: '100%',
                      backgroundColor: index % 2 === 0 ? '#9aedb660' : '#fd9f4860',
                      borderColor: index % 2 === 0 ? '#9aedb680' : '#fd9f4880'
                    }}
                  >
                  {/* Step Number */}
                  <div 
                    className="absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: index === 0 || index === 2 ? '#fd9f48' : '#9aedb6' }}
                  >
                    {step.number}
                  </div>

                  {/* Icon on the left */}
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                    style={{ backgroundColor: index % 2 === 0 ? '#9aedb6' : '#fd9f48' }}
                  >
                    <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>

                  {/* Content on the right */}
                  <div className="space-y-1 text-left flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-foreground">
                      {step.title}
                    </h3>
                    <h4 className="text-xs font-semibold text-muted-foreground">
                      {step.subtitle}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {step.description}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-6 sm:mt-10">
            <Link to="/products?category=subscription">
              <Button size="sm" className="text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-4 bg-primary hover:bg-primary/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105">
                Subscription Boxes
                <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

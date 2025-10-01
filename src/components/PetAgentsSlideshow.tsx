import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const PetAgentsSlideshow = () => {
  const agents = [
    {
      name: "Yuki",
      type: "Cat",
      emoji: "🐱",
      quote: "I demand the finest treats, human! Toto's Bureau never disappoints my royal taste buds.",
      owner: "Yuki's Mom"
    },
    {
      name: "Loki",
      type: "Dog", 
      emoji: "🐕",
      quote: "Woof! These toys are the best! I can play for hours without getting bored.",
      owner: "Loki's Dad"
    },
    {
      name: "Goofy",
      type: "Dog",
      emoji: "🐕‍🦺", 
      quote: "My humans say I'm too energetic, but Toto's toys help me burn off all this energy!",
      owner: "Goofy's Family"
    },
    {
      name: "Raven",
      type: "Cat",
      emoji: "🐈‍⬛",
      quote: "I'm a sophisticated cat, and these eco-friendly treats match my refined palate perfectly.",
      owner: "Raven's Owner"
    },
    {
      name: "Stella",
      type: "Dog",
      emoji: "🐩",
      quote: "The subscription box is like Christmas every month! I love the surprise element.",
      owner: "Stella's Mom"
    },
    {
      name: "Misha",
      type: "Cat",
      emoji: "🐈",
      quote: "Finally, treats that don't upset my sensitive stomach. Toto really knows what cats need!",
      owner: "Misha's Family"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % agents.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [agents.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + agents.length) % agents.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % agents.length);
  };

  const currentAgent = agents[currentIndex];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-amber-50/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Meet Our Agents
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Pet Community Stars
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Real pets, real stories, real love for Toto's Bureau
            </p>
          </div>

          {/* Slideshow */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-card to-primary/5 rounded-3xl p-8 sm:p-12 border border-border/50 shadow-strong">
              <div className="text-center">
                {/* Pet Avatar */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary to-forest rounded-full flex items-center justify-center mx-auto mb-6 text-4xl sm:text-5xl">
                  {currentAgent.emoji}
                </div>

                {/* Pet Info */}
                <div className="mb-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {currentAgent.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Badge variant="outline" className="text-sm">
                      {currentAgent.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Agent #{currentIndex + 1}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentAgent.owner}
                  </p>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/30" />
                  <blockquote className="text-lg sm:text-xl text-muted-foreground italic leading-relaxed px-4">
                    "{currentAgent.quote}"
                  </blockquote>
                  <Quote className="absolute -bottom-2 -right-2 h-6 w-6 text-primary/30 rotate-180" />
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-medium hover:shadow-strong transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {agents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* All Agents Preview */}
          <div className="mt-12 sm:mt-16">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-foreground mb-6">
              Meet All Our Agents
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {agents.map((agent, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    index === currentIndex
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-card/50 hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2">
                      {agent.emoji}
                    </div>
                    <h4 className="text-sm font-semibold text-foreground">
                      {agent.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {agent.type}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetAgentsSlideshow;

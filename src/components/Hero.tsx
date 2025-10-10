import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Gift, Heart, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/tempbackground.webp";
import mobileHeroImage from "@/assets/mobile.jpeg";

const Hero = () => {
  // Force rebuild timestamp
  const buildTime = new Date().toISOString();
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center overflow-hidden section-spacing">
      {/* Background Images - Desktop and Mobile */}
      <div className="absolute inset-0">
        {/* Desktop Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat block sm:hidden"
          style={{
            backgroundImage: `url(${mobileHeroImage})`
          }}
        />
        {/* Dark charcoal overlay for optimal text readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(45, 45, 45, 0.6)' }}></div>
        {/* Warm, natural overlay */}
        <div className="absolute inset-0 bg-amber-50/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/3 via-transparent to-amber-50/5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto container-spacing">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-6 px-4">
            
            {/* Text Content Block */}
            <div className="space-y-4 max-w-3xl">
              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <span style={{ color: '#fd9f48' }}>
                  Pamper Your Pets with
                </span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl" style={{ color: '#fd9f48' }}>
                  Toto's Bureau!
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-sm sm:text-base md:text-lg text-stone-100 max-w-2xl mx-auto">
                Cool bundles, mischievous treats, and eco-friendly fun for cats and dogs - 
                no fuss, just tail-wags and purrs.
              </p>
            </div>
            
            {/* CTA Buttons Block */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
              <Link to="/products">
                <Button size="md" className="text-sm sm:text-base px-6 py-3 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full" style={{ backgroundColor: '#fd9f48' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e88f3f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fd9f48'}>
                  Start shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/products?category=subscription">
                <Button size="md" className="text-sm sm:text-base px-6 py-3 bg-forest hover:bg-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full">
                  <Gift className="mr-2 h-4 w-4" />
                  Subscription Boxes
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
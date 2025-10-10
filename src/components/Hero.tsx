import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Gift, Heart, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
// import heroImage from "@/assets/tempbackground.webp";
// import mobileHeroImage from "@/assets/mobile.jpeg";

const Hero = () => {
  // Force rebuild timestamp
  const buildTime = new Date().toISOString();
  return (
    <section className="relative min-h-[70vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden section-spacing">
      {/* Background Images - Desktop and Mobile */}
      <div className="absolute inset-0">
        {/* Desktop Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden sm:block"
          style={{
            backgroundImage: `url('./tempbackground.webp?v=${Date.now()}')`
          }}
        />
        {/* Mobile Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat block sm:hidden"
          style={{
            backgroundImage: `url('./mobile.jpeg?v=${Date.now()}')`
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
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            
            {/* Text Content Block */}
            <div className="flex-1 space-y-6 px-4">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-left">
                <span style={{ color: '#fd9f48' }}>
                  Pamper Your Pets with
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#fd9f48' }}>
                  Toto's Bureau!
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl text-stone-100 max-w-2xl text-left">
                Cool bundles, mischievous treats, and eco-friendly fun for cats and dogs - 
                no fuss, just tail-wags and purrs.
              </p>
            </div>
            
            {/* CTA Buttons Block */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 sm:gap-6 lg:gap-4 w-full lg:w-auto lg:min-w-[280px] px-4">
              <Link to="/products">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full" style={{ backgroundColor: '#fd9f48' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e88f3f'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fd9f48'}>
                  Start shopping
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/products?category=subscription">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 bg-forest hover:bg-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full">
                  <Gift className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
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
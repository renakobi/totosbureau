import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Gift, Heart, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/backgroundnew.jpg";
import mobileHeroImage from "@/assets/mobile.jpeg";

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
        {/* Subtle dark overlay to dim background */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto container-spacing">
        <div className="max-w-4xl">
          <div className="flex flex-col items-start space-y-8">
            
            {/* Text Content Block */}
            <div className="space-y-6 px-4 max-w-lg text-center">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span style={{ color: '#fd9f48' }}>
                  Pamper Your Pets with
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ color: '#fd9f48' }}>
                  Toto's Bureau!
                </span>
              </h1>
              
              {/* Subheading */}
              <p className="text-base sm:text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-semibold" style={{ color: 'black' }}>
                Cool bundles, mischievous treats, and eco-friendly fun for cats and dogs -<br />
                no fuss, just tail-wags and purrs.
              </p>
            </div>
            
            {/* CTA Buttons Block */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md px-4">
              <Link to="/products">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full" style={{ backgroundColor: '#9aedb6' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8dd4a3'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9aedb6'}>
                  Start shopping
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/products?category=subscription">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-6 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105 w-full" style={{ backgroundColor: '#9aedb6' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#8dd4a3'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9aedb6'}>
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
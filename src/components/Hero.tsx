import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Gift, Heart, Star, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/tempbackground.webp";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden section-spacing">
      {/* Natural Background Image */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`
          }}
        />
        {/* Warm, natural overlay */}
        <div className="absolute inset-0 bg-amber-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/20 via-transparent to-amber-50/30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto container-spacing">
        <div className="max-w-5xl mx-auto text-center space-content">
          
          
          {/* Main Heading */}
          <h1 className="text-hierarchy-1">
            <span className="text-foreground">
              Premium Pet Products
            </span>
            <br />
            <span className="text-hierarchy-2 text-forest">
              for Cats & Dogs
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-body-large text-muted-foreground max-w-4xl mx-auto">
            Discover carefully curated subscription boxes filled with premium toys, 
            treats, and surprises. Each delivery brings joy and adventure to your beloved pets.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/products">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white shadow-strong hover:shadow-strong/80 transition-all duration-300 hover:scale-105">
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/products?category=subscription">
              <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-2 hover:bg-primary/5 transition-all duration-300">
                <Gift className="mr-2 h-5 w-5" />
                Subscription Boxes
              </Button>
            </Link>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-16">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Loved by Pets</h3>
              <p className="text-muted-foreground text-sm">Carefully tested and approved by our furry friends</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300 group">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-sm">Only the finest products from trusted brands</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-medium transition-all duration-300 group">
              <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-forest/20 transition-colors">
                <Shield className="h-6 w-6 text-forest" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground text-sm">100% safe materials and secure delivery</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
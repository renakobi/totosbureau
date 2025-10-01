import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, PawPrint, ArrowRight } from "lucide-react";
import logoImage from "@/assets/logo.jpg";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing! We'll send updates to ${email}`);
      setEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-amber-50/5 to-forest/1 border-t border-border/50">
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-teal/90 to-forest/90 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12 text-center mb-8 sm:mb-12 md:mb-16 text-white shadow-strong">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <PawPrint className="h-6 w-6 sm:h-8 sm:w-8" />
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Stay in the Loop!</h3>
            </div>
            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 opacity-90 leading-relaxed">
              Get the latest deals, pet care tips, and new product alerts delivered to your inbox. 
              Join thousands of happy pet parents!
            </p>
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input 
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 h-10 sm:h-12 text-sm sm:text-base"
                required
              />
              <Button type="submit" className="bg-white text-forest hover:bg-white/90 h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="space-y-6 sm:space-y-0">
          {/* Company Info - Full width on mobile */}
          <div className="sm:hidden mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-medium overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Toto's Bureau Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Logo failed, using fallback...');
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-forest rounded-full"><span class="text-white font-bold text-lg">TB</span></div>';
                    }
                  }}
                />
              </div>
              <div className="text-lg font-bold text-secondary">
                Toto's Bureau
              </div>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              Your one-stop shop for premium pet supplies. We believe every pet deserves the best care, 
              love, and happiness in their lives.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Company Info */}
          <div className="hidden sm:block lg:col-span-1">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-medium overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Toto's Bureau Logo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Logo failed, using fallback...');
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-forest rounded-full"><span class="text-white font-bold text-lg">TB</span></div>';
                    }
                  }}
                />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
                Toto's Bureau
              </div>
            </div>
            <p className="text-muted-foreground mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Your one-stop shop for premium pet supplies. We believe every pet deserves the best care, 
              love, and happiness in their lives.
            </p>
            <div className="flex space-x-2 sm:space-x-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Grid - Shop, Support, Contact side by side */}
          <div className="grid grid-cols-3 gap-4 sm:hidden">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-xs mb-2 text-foreground">Shop</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
              <li><Link to="/products?category=dogs" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Dog Supplies
              </Link></li>
              <li><Link to="/products?category=cats" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Cat Essentials
              </Link></li>
              <li><Link to="/products?type=subscription" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Subscription Boxes
              </Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Premium Products
              </Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                All Products
              </Link></li>
            </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-xs mb-2 text-foreground">Support</h4>
              <ul className="space-y-1 text-muted-foreground text-xs">
              <li><Link to="/profile" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Account
              </Link></li>
              <li><Link to="/cart" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Cart
              </Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Browse Products
              </Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Shipping Info
              </Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                Pet Care Guide
              </Link></li>
            </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-xs mb-2 text-foreground">Contact</h4>
              <div className="space-y-1 text-muted-foreground text-xs">
              <div className="flex items-center group">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">1-800-TOTO-BUREAU</span>
              </div>
              <div className="flex items-center group">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">totosbureau.com</span>
              </div>
              <div className="flex items-center group">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">Pet Paradise Plaza, Suite 100</span>
              </div>
            </div>
            </div>
          </div>

          {/* Desktop Grid - Shop, Support, Contact */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Shop</h4>
              <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                <li><Link to="/products?category=dogs" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Dog Supplies
                </Link></li>
                <li><Link to="/products?category=cats" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cat Essentials
                </Link></li>
                <li><Link to="/products?type=subscription" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Subscription Boxes
                </Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Premium Products
                </Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  All Products
                </Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Support</h4>
              <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                <li><Link to="/profile" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Account
                </Link></li>
                <li><Link to="/cart" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cart
                </Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Browse Products
                </Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Shipping Info
                </Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors duration-300 group flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Pet Care Guide
                </Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-base sm:text-lg mb-4 sm:mb-6 text-foreground">Contact Us</h4>
              <div className="space-y-3 sm:space-y-4 text-muted-foreground text-sm sm:text-base">
                <div className="flex items-center group">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-foreground transition-colors">1-800-TOTO-BUREAU</span>
                </div>
                <div className="flex items-center group">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-foreground transition-colors">totosbureau@gmail.com</span>
                </div>
                <div className="flex items-center group">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-primary group-hover:text-primary transition-colors" />
                  <span className="group-hover:text-foreground transition-colors">Pet Paradise Plaza, Suite 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link to="/community" className="inline-block bg-gradient-to-r from-amber-50/25 to-orange-50/25 hover:from-amber-100/25 hover:to-orange-100/25 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-medium">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Join Our Pet Community
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto mb-4">
              Connect with thousands of happy pet parents and share your pet's journey with us!
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-medium">
              <span>Explore Community</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-8">
            <Link to="/products" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
            <Link to="/products" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
            <Link to="/products" className="hover:text-primary transition-colors duration-300">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-2">
            <PawPrint className="h-4 w-4 text-primary" />
            <span>© 2024 Toto's Bureau. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
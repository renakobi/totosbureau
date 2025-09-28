import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, PawPrint, ArrowRight } from "lucide-react";

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
    <footer className="bg-gradient-to-b from-amber-50/40 to-forest/5 border-t border-border/50">
      <div className="container mx-auto px-4 py-20">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-teal to-forest rounded-2xl p-8 md:p-12 text-center mb-16 text-white shadow-strong">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PawPrint className="h-8 w-8" />
              <h3 className="text-3xl md:text-4xl font-bold">Stay in the Loop!</h3>
            </div>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Get the latest deals, pet care tips, and new product alerts delivered to your inbox. 
              Join thousands of happy pet parents!
            </p>
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex gap-3">
              <Input 
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 h-12 text-base"
                required
              />
              <Button type="submit" className="bg-white text-forest hover:bg-white/90 h-12 px-6">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-forest rounded-xl flex items-center justify-center shadow-medium">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-forest to-primary bg-clip-text text-transparent">
                Toto's Bureau
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your one-stop shop for premium pet supplies. We believe every pet deserves the best care, 
              love, and happiness in their lives.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Shop</h4>
            <ul className="space-y-3 text-muted-foreground">
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
            <h4 className="font-bold text-lg mb-6 text-foreground">Support</h4>
            <ul className="space-y-3 text-muted-foreground">
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
            <h4 className="font-bold text-lg mb-6 text-foreground">Contact Us</h4>
            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center group">
                <Phone className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">1-800-TOTO-BUREAU</span>
              </div>
              <div className="flex items-center group">
                <Mail className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">hello@totosbureau.com</span>
              </div>
              <div className="flex items-center group">
                <MapPin className="h-5 w-5 mr-3 text-primary group-hover:text-primary transition-colors" />
                <span className="group-hover:text-foreground transition-colors">Pet Paradise Plaza, Suite 100</span>
              </div>
            </div>
          </div>
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
            <Heart className="h-4 w-4 text-primary" />
            <span>© 2024 Toto's Bureau. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
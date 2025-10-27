import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, PawPrint, ArrowRight, ChevronRight } from "lucide-react";
import { InstagramIcon, WhatsAppIcon, TikTokIcon } from "@/components/SocialIcons";
import logoImage from "@/assets/logo.jpg";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

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
        <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center mb-6 sm:mb-8 md:mb-10 shadow-strong max-w-3xl mx-auto" style={{ backgroundColor: '#fd9f48' }}>
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <PawPrint className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'black' }} />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: 'black' }}>Stay in the Loop!</h3>
            </div>
            <p className="text-xs sm:text-sm md:text-base mb-3 sm:mb-4 leading-relaxed" style={{ color: 'black' }}>
              Get the latest deals, pet care tips, and new product alerts delivered to your inbox. 
              Join thousands of happy pet parents!
            </p>
            <form onSubmit={handleSubscribe} className="max-w-lg mx-auto flex flex-col sm:flex-row gap-2">
              <Input 
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-black/30 text-black placeholder:text-black/50 h-8 sm:h-9 text-xs sm:text-sm"
                required
              />
              <Button type="submit" className="bg-black text-white hover:bg-black/90 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm">
                <Mail className="h-3 w-3 mr-1 sm:mr-2" />
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
                  className="w-full h-full object-cover rounded-full"
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
        <div className="text-lg font-bold" style={{ color: '#9aedb6' }}>
          Toto's Bureau
        </div>
            </div>
            <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
              Your one-stop shop for premium pet supplies. We believe every pet deserves the best care, 
              love, and happiness in their lives.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <InstagramIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <WhatsAppIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8">
                <TikTokIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Desktop Company Info */}
          <div className="hidden sm:block lg:col-span-1 text-center">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-medium overflow-hidden">
                <img 
                  src={logoImage} 
                  alt="Toto's Bureau Logo" 
                  className="w-full h-full object-cover rounded-full"
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
            <div className="flex justify-center space-x-2 sm:space-x-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <WhatsAppIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-8 w-8 sm:h-10 sm:w-10">
                <TikTokIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Dropdowns */}
          <div className="space-y-4 sm:hidden">
            {/* Shop Dropdown */}
            <div>
              <button 
                className="flex items-center justify-between w-full text-left font-bold text-sm text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'shop' ? null : 'shop')}
              >
                <span>Shop</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === 'shop' ? 'rotate-90' : ''}`} />
              </button>
              {activeDropdown === 'shop' && (
                <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                  <Link to="/products?type=subscription" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Subscription Boxes
                  </Link>
                  <Link to="/products" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    All Products
                  </Link>
                </div>
              )}
            </div>

            {/* Support Dropdown */}
            <div>
              <button 
                className="flex items-center justify-between w-full text-left font-bold text-sm text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'support' ? null : 'support')}
              >
                <span>Support</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === 'support' ? 'rotate-90' : ''}`} />
              </button>
              {activeDropdown === 'support' && (
                <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                  <Link to="/profile" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Account
                  </Link>
                  <Link to="/cart" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Cart
                  </Link>
                  <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                    Get to Know Toto
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Dropdown */}
            <div>
              <button 
                className="flex items-center justify-between w-full text-left font-bold text-sm text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setActiveDropdown(activeDropdown === 'contact' ? null : 'contact')}
              >
                <span>Contact Us</span>
                <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === 'contact' ? 'rotate-90' : ''}`} />
              </button>
              {activeDropdown === 'contact' && (
                <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center group">
                    <Mail className="h-4 w-4 mr-2 text-primary group-hover:text-primary transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">totosbureau@gmail.com</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Dropdowns - Centered */}
          <div className="hidden sm:flex justify-center">
            <div className="flex space-x-12">
              {/* Shop Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center justify-between text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setActiveDropdown(activeDropdown === 'shop' ? null : 'shop')}
                >
                  <span>Shop</span>
                  <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${activeDropdown === 'shop' ? 'rotate-90' : ''}`} />
                </button>
                {activeDropdown === 'shop' && (
                  <div className="absolute mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <Link to="/products?type=subscription" className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        Subscription Boxes
                      </Link>
                      <Link to="/products" className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        All Products
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Support Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center justify-between text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setActiveDropdown(activeDropdown === 'support' ? null : 'support')}
                >
                  <span>Support</span>
                  <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${activeDropdown === 'support' ? 'rotate-90' : ''}`} />
                </button>
                {activeDropdown === 'support' && (
                  <div className="absolute mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <Link to="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        Account
                      </Link>
                      <Link to="/cart" className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        Cart
                      </Link>
                      <Link to="/about" className="block px-4 py-2 text-sm text-foreground hover:bg-primary/10 transition-colors">
                        Get to Know Toto
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center justify-between text-left font-bold text-base sm:text-lg text-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setActiveDropdown(activeDropdown === 'contact' ? null : 'contact')}
                >
                  <span>Contact Us</span>
                  <ChevronRight className={`h-4 w-4 ml-2 transition-transform ${activeDropdown === 'contact' ? 'rotate-90' : ''}`} />
                </button>
                {activeDropdown === 'contact' && (
                  <div className="absolute mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <div className="flex items-center px-4 py-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span>totosbureau@gmail.com</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Community Section */}
        <div className="mt-12 sm:mt-16 text-center max-w-5xl mx-auto">
          <Link to="/community" className="block rounded-xl py-4 sm:py-5 px-8 transition-all duration-300 hover:shadow-medium" style={{ backgroundColor: '#9aedb6' }}>
            <div className="flex items-center justify-center gap-3 mb-2">
              <PawPrint className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'black' }} />
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: 'black' }}>
                Join Our Pet Community
              </h3>
            </div>
            <p className="text-xs sm:text-sm max-w-2xl mx-auto mb-2" style={{ color: 'black' }}>
              Connect with thousands of happy pet parents and share your pet's journey with us!
            </p>
            <div className="flex items-center justify-center gap-2 font-medium text-sm" style={{ color: 'black' }}>
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
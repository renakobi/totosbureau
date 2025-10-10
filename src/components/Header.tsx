import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Search, Menu, X, User, ChevronRight, PawPrint } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUser } from "@/contexts/UserContext";
import ThemeToggle from "./ThemeToggle";
import logoImage from "@/assets/logo.jpg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-105 overflow-hidden">
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
            </div>
            <div className="text-sm sm:text-xl md:text-2xl font-bold text-secondary">
              Toto's Bureau
            </div>
          </Link>

               {/* Desktop Navigation - Removed */}

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 py-2 w-full bg-background/80 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300 ${
                    isSearchFocused ? 'shadow-medium' : ''
                  }`}
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative hover:bg-accent/10 transition-smooth">
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs bg-accent text-accent-foreground animate-bounce"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-forest/10 transition-smooth"
              onClick={() => {
                navigate(currentUser ? "/profile" : "/login");
              }}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden hover:bg-primary/10 transition-smooth"
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 py-2 w-full bg-background/80 border-border/50 focus:bg-background focus:border-primary/50 transition-all duration-300 ${
                    isSearchFocused ? 'shadow-medium' : ''
                  }`}
                />
              </div>
            </form>
          </div>
        </div>

        {/* Category Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
            <div className="container mx-auto px-4 pt-16 pb-4">
              <div className="max-w-xs max-h-[60vh] overflow-y-auto space-y-2 bg-card/95 backdrop-blur-md p-4 pb-6 rounded-lg shadow-strong border border-border" onClick={(e) => e.stopPropagation()}>
                {/* Home Link */}
                <div>
                  <Link 
                    to="/" 
                    className="block text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Home</span>
                  </Link>
                </div>
                
                {/* Shop Category */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setActiveDropdown(activeDropdown === 'shop' ? null : 'shop')}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Shop</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeDropdown === 'shop' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeDropdown === 'shop' && (
                    <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                      {/* Dogs Section */}
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground py-1">Dogs</div>
                        <Link to="/products?category=dogs" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">All Dog Products</span>
                        </Link>
                        <Link to="/products?category=dogs&type=treats" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Treats</span>
                        </Link>
                        <Link to="/products?category=dogs&type=toys" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Toys</span>
                        </Link>
                        <Link to="/products?category=dogs&type=clothes" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Clothes</span>
                        </Link>
                        <Link to="/products?category=dogs&type=subscription" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Subscription Box</span>
                        </Link>
                      </div>
                      
                      {/* Cats Section */}
                      <div className="space-y-1">
                        <div className="text-lg font-medium text-foreground py-1">Cats</div>
                        <Link to="/products?category=cats" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">All Cat Products</span>
                        </Link>
                        <Link to="/products?category=cats&type=treats" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Treats</span>
                        </Link>
                        <Link to="/products?category=cats&type=toys" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Toys</span>
                        </Link>
                        <Link to="/products?category=cats&type=clothes" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Clothes</span>
                        </Link>
                        <Link to="/products?category=cats&type=subscription" className="block text-base text-muted-foreground hover:text-primary transition-smooth py-1 group" onClick={() => setIsMenuOpen(false)}>
                          <span className="group-hover:translate-x-2 transition-transform inline-block">Subscription Box</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subscription Boxes Link */}
                <div>
                  <Link 
                    to="/products?category=subscription" 
                    className="block text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Subscription Boxes</span>
                  </Link>
                </div>

                {/* Get to know Toto (About Us) Link */}
                <div>
                  <Link 
                    to="/about" 
                    className="block text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Get to know Toto</span>
                  </Link>
                </div>

                {/* Liked Items Link */}
                <div>
                  <Link 
                    to="/favorites" 
                    className="block text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Liked Items ({favorites.length})</span>
                  </Link>
                </div>

                {/* Contact Link */}
                <div>
                  <Link 
                    to="/contact" 
                    className="block text-sm font-semibold text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Contact</span>
                  </Link>
                </div>

                {/* Account Links */}
                <div className="pt-2 space-y-1">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-smooth py-1 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform">Sign In</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
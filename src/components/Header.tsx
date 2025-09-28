import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Search, Menu, X, User, ChevronRight, PawPrint } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative z-50 hover:bg-primary/10 transition-smooth"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-forest rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-strong transition-all duration-300 group-hover:scale-105">
                <PawPrint className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-forest to-primary bg-clip-text text-transparent">
                Toto's Bureau
              </div>
              <div className="text-xs text-muted-foreground font-medium -mt-1 hidden sm:block">
                Premium Pet Care
              </div>
            </div>
          </Link>

          {/* Search Bar */}
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
            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-primary/10 transition-smooth">
              <Search className="h-4 w-4" />
            </Button>
            <Link to="/favorites">
              <Button variant="ghost" size="icon" className="relative hover:bg-secondary/10 transition-smooth">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-xs bg-secondary text-secondary-foreground animate-bounce"
                  >
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
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
                const isLoggedIn = localStorage.getItem("totos-bureau-user") === "true" || localStorage.getItem("totos-bureau-admin") === "true";
                navigate(isLoggedIn ? "/profile" : "/login");
              }}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}>
            <div className="container mx-auto px-4 pt-24" onClick={(e) => e.stopPropagation()}>
              <div className="max-w-md space-y-4 bg-gradient-to-br from-card to-primary/5 p-8 rounded-2xl shadow-strong border border-border/50">
                {/* Home Link */}
                <div>
                  <Link 
                    to="/" 
                    className="block text-2xl font-semibold text-foreground hover:text-primary transition-smooth py-3 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Home</span>
                  </Link>
                </div>
                
                {/* Dogs Category */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left text-2xl font-semibold text-foreground hover:text-primary transition-smooth py-3 group"
                    onClick={() => setActiveDropdown(activeDropdown === 'dogs' ? null : 'dogs')}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Dogs</span>
                    <ChevronRight className={`h-6 w-6 transition-transform ${activeDropdown === 'dogs' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeDropdown === 'dogs' && (
                    <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                      <Link to="/products?category=dogs" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">All Dog Products</span>
                      </Link>
                      <Link to="/products?category=dogs&type=treats" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Treats</span>
                      </Link>
                      <Link to="/products?category=dogs&type=toys" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Toys</span>
                      </Link>
                      <Link to="/products?category=dogs&type=clothes" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Clothes</span>
                      </Link>
                      <Link to="/products?category=dogs&type=subscription" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Subscription Box</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Cats Category */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left text-2xl font-semibold text-foreground hover:text-primary transition-smooth py-3 group"
                    onClick={() => setActiveDropdown(activeDropdown === 'cats' ? null : 'cats')}
                  >
                    <span className="group-hover:translate-x-2 transition-transform inline-block">Cats</span>
                    <ChevronRight className={`h-6 w-6 transition-transform ${activeDropdown === 'cats' ? 'rotate-90' : ''}`} />
                  </button>
                  {activeDropdown === 'cats' && (
                    <div className="pl-4 space-y-2 mt-2 animate-in slide-in-from-top-2 duration-200">
                      <Link to="/products?category=cats" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">All Cat Products</span>
                      </Link>
                      <Link to="/products?category=cats&type=treats" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Treats</span>
                      </Link>
                      <Link to="/products?category=cats&type=toys" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Toys</span>
                      </Link>
                      <Link to="/products?category=cats&type=clothes" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Clothes</span>
                      </Link>
                      <Link to="/products?category=cats&type=subscription" className="block text-lg text-muted-foreground hover:text-primary transition-smooth py-2 group" onClick={() => setIsMenuOpen(false)}>
                        <span className="group-hover:translate-x-2 transition-transform inline-block">Subscription Box</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Account Links */}
                <div className="pt-4 space-y-2">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-between text-lg font-medium text-foreground hover:text-primary transition-smooth py-3 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform">Sign In</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center justify-between text-lg font-medium text-foreground hover:text-primary transition-smooth py-3 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:translate-x-2 transition-transform">Sign Up</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                            setIsMenuOpen(false);
                          }
                        }}
                        className="pl-10 pr-4 py-3 w-full bg-background/80 border-border/50 focus:bg-background focus:border-primary/50"
                      />
                    </div>
                    <Button 
                      onClick={() => {
                        handleSearch();
                        setIsMenuOpen(false);
                      }}
                      className="w-full" 
                      size="lg"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search Products
                    </Button>
                  </div>
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
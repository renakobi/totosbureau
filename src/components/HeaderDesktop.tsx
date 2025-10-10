import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Search, ChevronRight, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useUser } from "@/contexts/UserContext";
import ThemeToggle from "./ThemeToggle";
import logoImage from "@/assets/logo.jpg";

const HeaderDesktop = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { favorites } = useFavorites();
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-secondary">
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
                navigate(currentUser ? "/profile" : "/login");
              }}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDesktop;

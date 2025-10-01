import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ShoppingCart, Search, Filter, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductContext";


const Products = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { products } = useProducts();
  
  const categoryFilter = searchParams.get("category") || "all";
  const typeFilter = searchParams.get("type") || "all";
  const searchQuery = searchParams.get("search") || "";


  // Set search term from URL parameter
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesType = typeFilter === "all" || product.type === typeFilter;
    
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: "📦" // Using emoji as placeholder
    });
  };

  return (
    <div className="min-h-screen bg-forest/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {categoryFilter !== "all" ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products` : "All Products"}
          </h1>
          <p className="text-muted-foreground">
            {typeFilter !== "all" && ` - ${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}`} 
            ({sortedProducts.length} products found)
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {sortedProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block h-full">
              <Card className="group hover:shadow-soft transition-all duration-200 overflow-hidden cursor-pointer bg-secondary/5 border-secondary/20 h-full flex flex-col">
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="relative bg-secondary/10 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
                  {product.image && (product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🐾
                    </div>
                  )}
                  <div className="w-full h-full flex items-center justify-center text-6xl" style={{display: 'none'}}>
                    🐾
                  </div>
                  
                  {product.onSale && (
                    <Badge variant="destructive" className="absolute top-3 left-3">
                      Sale
                    </Badge>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={`absolute top-3 right-3 transition-all duration-200 bg-white/90 hover:bg-white shadow-medium hover:scale-105 ${
                      isFavorite(product.id) ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 md:p-4 lg:p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  </div>
                  
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base md:text-lg">{product.name}</h3>
                  
                  <div className="flex items-center gap-1 mb-1 sm:mb-2">
                    <Badge variant="outline" className="capitalize text-xs px-1 py-0.5">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="capitalize bg-primary/10 text-primary border-primary/30 text-xs px-1 py-0.5">
                      {product.type}
                    </Badge>
                  </div>

                  {/* Flavors */}
                  {product.flavors && product.flavors.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {product.flavors.slice(0, 3).map((flavor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0.5">
                            {flavor}
                          </Badge>
                        ))}
                        {product.flavors.length > 3 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0.5">
                            +{product.flavors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products found matching your criteria.</p>
            <Button onClick={() => setSearchTerm("")}>Clear Filters</Button>
          </div>
        )}

        {/* Load More - Currently showing all products */}
        {sortedProducts.length > 0 && sortedProducts.length >= 6 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                // For now, just scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Back to Top
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Products;
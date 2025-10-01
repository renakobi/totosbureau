import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductContext";
import OptimizedImage from "./OptimizedImage";


const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getFeaturedProducts } = useProducts();
  
  const featuredProducts = getFeaturedProducts();

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-amber-50/40 to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
            Featured Products
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
            <span className="text-foreground">
              Top Picks
            </span>
            <br />
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-forest">
              for Your Furry Friends
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-4xl mx-auto px-4">
            Hand-selected products that pets and their parents absolutely love. 
            Each item is carefully chosen for quality, safety, and maximum pet happiness.
          </p>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 xl:gap-6 mb-8 sm:mb-12 md:mb-16 px-4 sm:px-0">
            {featuredProducts.slice(0, 3).map((product, index) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block h-full group">
              <Card 
                className={`group hover:shadow-medium transition-all duration-200 overflow-hidden cursor-pointer backdrop-blur-sm border-border/50 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom-4 ${
                  index === 0 ? 'bg-secondary/5 border-secondary/20' :
                  index === 1 ? 'bg-primary/5 border-primary/20' :
                  'bg-accent/5 border-accent/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                  {product.image && (product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover relative z-10"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        const nextElement = target.nextElementSibling as HTMLElement;
                        target.style.display = 'none';
                        if (nextElement) nextElement.style.display = 'flex';
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
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-3 right-3 transition-all duration-200 bg-background/90 hover:bg-background shadow-medium hover:scale-105 ${
                      isFavorite(product.id.toString()) ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id.toString());
                    }}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(product.id.toString()) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {product.badge && (
                    <Badge 
                      className={`absolute top-3 left-3 shadow-medium ${
                        product.badge === "Best Seller" ? "bg-secondary text-secondary-foreground" :
                        product.badge === "New" ? "bg-primary text-primary-foreground" :
                        product.badge === "20% Off" ? "bg-accent text-accent-foreground" :
                        product.badge === "Premium" ? "bg-forest text-forest-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 px-2 py-1">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-forest/10 text-forest border-forest/20 px-2 py-1">
                      {product.type}
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h3>

                  {/* Flavors */}
                  {product.flavors && product.flavors.length > 0 && (
                    <div className="mb-2 sm:mb-3">
                      <div className="flex flex-wrap gap-1">
                        {product.flavors.slice(0, 2).map((flavor, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-1 py-0.5">
                            {flavor}
                          </Badge>
                        ))}
                        {product.flavors.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0.5">
                            +{product.flavors.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed hidden sm:block">
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-accent text-accent" />
                      <span className="text-xs sm:text-sm font-semibold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 mt-auto">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-3 sm:p-4 md:p-6 pt-0">
                <Button 
                  className="w-full bg-teal hover:bg-teal/90 text-white shadow-medium hover:shadow-strong transition-all duration-200 hover:scale-102"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
              </Card>
            </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 md:py-20">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
              No Featured Products Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Products will appear here once they're added through the admin panel. 
              Check back soon for amazing pet products!
            </p>
            <Link to="/products">
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                Browse All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 hover:bg-primary/5 transition-all duration-300 hover:scale-105">
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
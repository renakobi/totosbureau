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
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Top Picks for Your Furry Friends
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Hand-selected products that pets and their parents absolutely love
          </p>
        </div>

        {/* Products Grid - Etsy Style */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6 px-2 sm:px-0">
            {featuredProducts.slice(0, 10).map((product, index) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block h-full group">
              <Card 
                className="group hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer bg-white border border-gray-200 h-full flex flex-col rounded-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
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
                    className={`absolute top-2 right-2 transition-all duration-200 bg-white/90 hover:bg-white shadow-sm hover:scale-105 rounded-full h-6 w-6 ${
                      isFavorite(product.id.toString()) ? 'text-red-500' : 'text-gray-600'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product.id.toString());
                    }}
                  >
                    <Heart className={`h-3 w-3 ${isFavorite(product.id.toString()) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  {product.badge && (
                    <Badge 
                      className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 shadow-sm rounded"
                    >
                      {product.badge}
                    </Badge>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-2 flex-1 flex flex-col">
                  <h3 className="text-xs font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-2.5 w-2.5 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-1 mt-auto">
                    <span className="text-sm font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              
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
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductContext";

const Favorites = () => {
  const { addToCart } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { products } = useProducts();

  // Filter products to only show favorited ones
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-500" />
            My Favorites
          </h1>
          <p className="text-muted-foreground">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding products to your favorites by clicking the heart icon on any product.
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block h-full group">
                <Card className="group hover:shadow-medium transition-all duration-200 overflow-hidden cursor-pointer bg-accent/5 border-accent/20 backdrop-blur-sm h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    {/* Product Image */}
                    <div className="relative h-56 bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                      {product.image.startsWith('data:') || product.image.startsWith('blob:') || product.image.startsWith('http') ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover relative z-10"
                        />
                      ) : (
                        <div className="relative z-10 text-6xl">{product.image}</div>
                      )}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`absolute top-3 right-3 transition-all duration-200 bg-background/90 hover:bg-background shadow-medium hover:scale-105 ${
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
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {product.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-forest/10 text-forest border-forest/20">
                          {product.type}
                        </Badge>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {product.description}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-semibold ml-1">{product.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mb-6 mt-auto">
                        <span className="text-2xl font-bold text-foreground">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0">
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import OptimizedImage from "./OptimizedImage";

const featuredProducts = [
  {
    id: 1,
    name: "Secret Mission Box - Cats",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviews: 124,
    category: "Cat",
    type: "Mission Box",
    image: "📦",
    badge: "Best Seller",
    description: "Monthly surprise box for your feline agent"
  },
  {
    id: 2,
    name: "Interactive Cat Toy Set",
    price: 19.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    category: "Cat",
    type: "Toys",
    image: "🐱",
    badge: "New",
    description: "Keep your cat entertained for hours"
  },
  {
    id: 3,
    name: "Secret Mission Box - Dogs",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.7,
    reviews: 67,
    category: "Dog",
    type: "Mission Box",
    image: "📦",
    badge: "20% Off",
    description: "Monthly surprise box for your canine agent"
  },
  {
    id: 4,
    name: "Premium Pet Bed",
    price: 59.99,
    originalPrice: 69.99,
    rating: 4.9,
    reviews: 156,
    category: "Both",
    type: "Comfort",
    image: "🛏️",
    badge: "Premium",
    description: "Memory foam support for joint health"
  },
  {
    id: 5,
    name: "Catnip Scratch Tower",
    price: 34.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 93,
    category: "Cat",
    type: "Furniture",
    image: "🏗️",
    badge: "Popular",
    description: "Multi-level scratching and climbing"
  },
  {
    id: 6,
    name: "Dental Treat Bundle",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.8,
    reviews: 201,
    category: "Dog",
    type: "Treats",
    image: "🦴",
    badge: "Vet Approved",
    description: "Promotes healthy teeth and gums"
  }
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

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
    <section className="section-spacing bg-gradient-to-b from-amber-50/40 to-muted/20">
      <div className="container mx-auto container-spacing">
        {/* Section Header */}
        <div className="text-center space-content">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium">
            <Star className="h-4 w-4" />
            Featured Products
          </div>
          <h2 className="text-hierarchy-2">
            <span className="text-foreground">
              Top Picks
            </span>
            <br />
            <span className="text-hierarchy-3 text-forest">
              for Your Furry Friends
            </span>
          </h2>
          <p className="text-body-large text-muted-foreground max-w-4xl mx-auto">
            Hand-selected products that pets and their parents absolutely love. 
            Each item is carefully chosen for quality, safety, and maximum pet happiness.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featuredProducts.map((product, index) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block h-full group">
              <Card 
                className="group hover:shadow-medium transition-all duration-200 overflow-hidden cursor-pointer bg-card/90 backdrop-blur-sm border-border/50 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
              <CardContent className="p-0 flex-1 flex flex-col">
                {/* Product Image */}
                <div className="relative h-56 bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full relative z-10"
                    fallback={product.image}
                    lazy={true}
                  />
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
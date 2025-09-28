import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock product data - in a real app this would come from an API
const products = {
  "1": {
    id: 1,
    name: "Secret Mission Box - Cats",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviews: 124,
    category: "Cat",
    type: "Subscription Box",
    image: "📦",
    badge: "Best Seller",
    description: "Monthly surprise box filled with premium toys, treats, and accessories for your feline agent.",
    variants: [
      { id: "small", name: "Small", description: "Perfect for kittens", price: 29.99 },
      { id: "medium", name: "Medium", description: "Most popular choice", price: 39.99 },
      { id: "large", name: "Large", description: "For multiple cats", price: 49.99 },
      { id: "premium", name: "Premium", description: "Luxury items included", price: 59.99 }
    ],
    images: ["📦", "🎾", "🪀", "🧸", "🎁"]
  },
  "2": {
    id: 2,
    name: "Interactive Cat Toy Set",
    price: 19.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    category: "Cat",
    type: "Toy",
    image: "🐱",
    badge: "New",
    description: "Keep your cat entertained for hours with this interactive toy collection.",
    variants: [
      { id: "basic", name: "Basic Set", description: "3 essential toys", price: 19.99 },
      { id: "deluxe", name: "Deluxe Set", description: "5 premium toys", price: 29.99 },
      { id: "ultimate", name: "Ultimate Set", description: "8 toys + treats", price: 39.99 }
    ],
    images: ["🐱", "🎯", "🪁", "🎪", "🎨"]
  }
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = products[id as keyof typeof products];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: `${product.name} - ${currentVariant.name}`,
        price: currentVariant.price,
        image: product.image
      });
    }
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} - ${currentVariant.name} added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    toast({
      title: isFavorite(product.id) ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite(product.id) 
        ? `${product.name} removed from your favorites.`
        : `${product.name} added to your favorites.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/30 flex items-center justify-center text-8xl">
                  {product.images[selectedImage]}
                </div>
              </CardContent>
            </Card>

            {/* Image Thumbnails */}
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <Button
                  key={index}
                  variant={selectedImage === index ? "default" : "outline"}
                  size="icon"
                  className="flex-shrink-0 w-16 h-16 text-2xl"
                  onClick={() => setSelectedImage(index)}
                >
                  {image}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <Badge variant="outline">{product.category}</Badge>
              <Badge variant="outline">{product.type}</Badge>
              {product.badge && (
                <Badge variant="secondary">{product.badge}</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Star className="h-5 w-5 fill-accent text-accent" />
                <span className="text-lg font-medium ml-1">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground">{product.description}</p>

            {/* Variants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Choose Size:</h3>
              <div className="flex gap-3">
                {product.variants.map((variant, index) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === index ? "default" : "outline"}
                    className="flex flex-col items-center p-4 h-auto"
                    onClick={() => setSelectedVariant(index)}
                  >
                    <div className="w-4 h-4 rounded-full border-2 border-current mb-2" />
                    <span className="font-medium">{variant.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ${variant.price}
                    </span>
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentVariant.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">${currentVariant.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className={`w-12 h-12 ${
                  isFavorite(product.id) ? 'text-red-500 border-red-500' : ''
                }`}
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Additional Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ Free shipping on orders over $50</p>
              <p>✓ 30-day return policy</p>
              <p>✓ Secure checkout</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;

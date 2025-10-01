import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Star, ShoppingCart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { getProductById } = useProducts();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);

  const product = getProductById(parseInt(id || "0"));

  // Set default flavor when product loads
  useEffect(() => {
    if (product?.flavors && product.flavors.length > 0) {
      setSelectedFlavor(product.flavors[0]);
    }
  }, [product]);

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

  const handleAddToCart = () => {
    // Check if product has flavors but none is selected
    if (product.flavors && product.flavors.length > 0 && !selectedFlavor) {
      toast({
        title: product.type === "subscription" ? "Please select a size" : "Please select a flavor",
        description: product.type === "subscription" ? "Choose a size before adding to cart." : "Choose a flavor before adding to cart.",
        variant: "destructive"
      });
      return;
    }

    const productName = selectedFlavor ? `${product.name} - ${selectedFlavor}` : product.name;
    
    // Calculate price based on selected size for subscription boxes
    const finalPrice = product.type === "subscription" && selectedFlavor ? 
      (selectedFlavor === "Monthly" ? product.price : 
       selectedFlavor === "Quarterly" ? product.price * 0.9 : 
       selectedFlavor === "Annual" ? product.price * 0.8 : product.price) : 
      product.price;
    
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: productName,
        price: finalPrice,
        image: product.image
      });
    }
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${productName} added to your cart.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id.toString());
    toast({
      title: isFavorite(product.id.toString()) ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite(product.id.toString()) 
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
                <div className="aspect-square bg-muted/30 flex items-center justify-center">
                  {product.image.startsWith('data:') || product.image.startsWith('blob:') || product.image.startsWith('http') ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-8xl">{product.image}</div>
                  )}
                </div>
              </CardContent>
            </Card>
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

            {/* Flavors/Sizing */}
            {product.flavors && product.flavors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                  {product.type === "subscription" ? "Choose Sizing:" : "Choose Flavor:"}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.flavors.map((flavor, index) => {
                    return (
                      <Button
                        key={index}
                        variant={selectedFlavor === flavor ? "default" : "outline"}
                        size="lg"
                        className={`px-6 py-3 min-w-[120px] ${
                          selectedFlavor === flavor 
                            ? "bg-primary text-primary-foreground shadow-md" 
                            : "hover:bg-primary/10"
                        }`}
                        onClick={() => setSelectedFlavor(flavor)}
                      >
                        {flavor}
                      </Button>
                    );
                  })}
                </div>
                {selectedFlavor && (
                  <p className="text-sm text-muted-foreground">
                    Selected: <span className="font-medium text-foreground">{selectedFlavor}</span>
                  </p>
                )}
                
                {/* Pricing breakdown for subscription boxes */}
                {product.type === "subscription" && (
                  <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium mb-2">Pricing Options:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Monthly:</span>
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarterly:</span>
                        <span className="font-medium">${(product.price * 0.9).toFixed(2)} <span className="text-green-600 text-xs">(10% off)</span></span>
                      </div>
                      <div className="flex justify-between">
                        <span>Annual:</span>
                        <span className="font-medium">${(product.price * 0.8).toFixed(2)} <span className="text-green-600 text-xs">(20% off)</span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold">
                ${product.type === "subscription" && selectedFlavor ? 
                  (selectedFlavor === "Monthly" ? product.price : 
                   selectedFlavor === "Quarterly" ? (product.price * 0.9).toFixed(2) : 
                   selectedFlavor === "Annual" ? (product.price * 0.8).toFixed(2) : product.price) : 
                  product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.type === "subscription" && selectedFlavor && selectedFlavor !== "Monthly" && (
                <span className="text-sm text-green-600 font-medium">
                  {selectedFlavor === "Quarterly" ? "10% off" : "20% off"}
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

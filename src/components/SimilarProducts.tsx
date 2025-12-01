import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/contexts/ProductContext";

interface SimilarProductsProps {
  productId: number;
  category: string;
  subcategory?: string;
}

const SimilarProducts = ({ productId, category, subcategory }: SimilarProductsProps) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        setIsLoading(true);
        
        // First, try to get products by category and subcategory
        let query = supabase
          .from('products')
          .select('*')
          .neq('id', productId)
          .eq('category', category)
          .eq('inStock', true)
          .limit(4);

        // If subcategory is provided, also filter by subcategory
        if (subcategory) {
          query = query.eq('subcategory', subcategory);
        }

        const { data: categoryProducts, error: categoryError } = await query;

        if (categoryError) {
          console.error('Error fetching similar products by category:', categoryError);
        }

        let products: Product[] = categoryProducts || [];

        // If we have fewer than 4 products, fill with recent products from same category
        if (products.length < 4) {
          const remaining = 4 - products.length;
          const existingIds = [productId, ...products.map(p => p.id)];
          
          let recentQuery = supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('inStock', true)
            .order('createdAt', { ascending: false })
            .limit(remaining + existingIds.length);

          const { data: recentProducts, error: recentError } = await recentQuery;

          if (recentError) {
            console.error('Error fetching recent products:', recentError);
          } else if (recentProducts) {
            // Filter out existing products
            const filtered = recentProducts.filter(p => !existingIds.includes(p.id));
            products = [...products, ...filtered.slice(0, remaining)];
          }
        }

        // If still fewer than 4, fill with most recent products from any category
        if (products.length < 4) {
          const remaining = 4 - products.length;
          const existingIds = [productId, ...products.map(p => p.id)];
          
          let allRecentQuery = supabase
            .from('products')
            .select('*')
            .eq('inStock', true)
            .order('createdAt', { ascending: false })
            .limit(remaining + existingIds.length);

          const { data: allRecentProducts, error: allRecentError } = await allRecentQuery;

          if (allRecentError) {
            console.error('Error fetching all recent products:', allRecentError);
          } else if (allRecentProducts) {
            // Filter out existing products
            const filtered = allRecentProducts.filter(p => !existingIds.includes(p.id));
            products = [...products, ...filtered.slice(0, remaining)];
          }
        }

        // Transform Supabase data to Product interface
        const transformedProducts: Product[] = products.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: parseFloat(p.price),
          originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : undefined,
          category: p.category,
          subcategory: p.subcategory,
          image: p.image,
          badge: p.badge || undefined,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
          inStock: p.inStock,
          stockQuantity: p.stockQuantity || 0,
          flavors: Array.isArray(p.flavors) ? p.flavors : (p.flavors ? JSON.parse(p.flavors) : undefined),
          type: p.type,
          onSale: p.onSale || false,
          ingredients: p.ingredients || undefined,
          aboutProduct: p.aboutProduct || undefined,
        }));

        setSimilarProducts(transformedProducts.slice(0, 4));
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [productId, category, subcategory]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: undefined
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} added to your cart.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId);
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted/30" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted/30 rounded w-3/4" />
                    <div className="h-3 bg-muted/30 rounded w-1/2" />
                    <div className="h-4 bg-muted/30 rounded w-1/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (similarProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block h-full group">
              <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer backdrop-blur-sm border-border/50 h-full flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  {/* Product Image */}
                  <div className="relative h-48 bg-muted/30 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                    {product.image && (product.image.startsWith('http') || product.image.startsWith('data:')) ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full flex items-center justify-center text-6xl" style={{ display: product.image && !product.image.startsWith('http') && !product.image.startsWith('data:') ? 'flex' : 'none' }}>
                      🐾
                    </div>
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-3 right-3 transition-all duration-200 bg-background/90 hover:bg-background shadow-md hover:scale-105 ${
                        isFavorite(product.id.toString()) ? 'text-red-500' : 'text-muted-foreground'
                      }`}
                      onClick={(e) => handleToggleFavorite(e, product.id.toString())}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id.toString()) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    {product.badge && (
                      <Badge 
                        className={`absolute top-3 left-3 shadow-md ${
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
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-2">
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20 px-1 py-0">
                        {product.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-forest/10 text-forest border-forest/20 px-1 py-0">
                        {product.type}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs font-semibold ml-1">{product.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2 mt-auto">
                      <span className="text-lg font-bold text-foreground">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full text-sm py-2 h-9 bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
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
      </div>
    </section>
  );
};

export default SimilarProducts;


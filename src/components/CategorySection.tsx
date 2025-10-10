import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Package, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/contexts/ProductContext";

const CategorySection = () => {
  const { products } = useProducts();

  // Calculate dynamic product counts
  const dogProducts = products.filter(p => p.category === 'dogs').length;
  const catProducts = products.filter(p => p.category === 'cats').length;
  const subscriptionProducts = products.filter(p => p.type === 'subscription').length;
  const totalProducts = products.length;

  const categories = [
    {
      id: 1,
      title: "Dog Supplies",
      description: "Premium food, toys, and accessories for your furry friend",
      icon: Dog,
      color: "bg-secondary/10 text-secondary",
      products: `${dogProducts} Product${dogProducts !== 1 ? 's' : ''}`,
      featured: true,
      link: "/products?category=dogs"
    },
    {
      id: 2,
      title: "Cat Essentials",
      description: "Everything your feline companion needs to stay happy",
      icon: Cat,
      color: "bg-primary/10 text-primary",
      products: `${catProducts} Product${catProducts !== 1 ? 's' : ''}`,
      featured: false,
      link: "/products?category=cats"
    },
    {
      id: 3,
      title: "Surprise Boxes",
      description: "Monthly curated boxes filled with premium pet products",
      icon: Package,
      color: "bg-accent/10 text-accent",
      products: `${subscriptionProducts} Box${subscriptionProducts !== 1 ? 'es' : ''}`,
      featured: true,
      link: "/products?type=subscription"
    },
    {
      id: 4,
      title: "Premium Products",
      description: "High-quality, veterinarian-approved items for health & wellness",
      icon: Sparkles,
      color: "bg-forest/10 text-forest",
      products: `${totalProducts} Product${totalProducts !== 1 ? 's' : ''}`,
      featured: false,
      link: "/products"
    }
  ];
  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Find Everything for Your Best Friend
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Browse our carefully organized categories
          </p>
        </div>

        {/* Category Grid - Etsy Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={category.link} className="block h-full group">
                <Card 
                  className="group hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden bg-white border border-gray-200 h-full flex flex-col rounded-lg"
                >
                  {category.featured && (
                    <Badge 
                      className="absolute top-2 right-2 z-10 bg-orange-500 text-white shadow-sm text-xs px-2 py-1 rounded"
                    >
                      Popular
                    </Badge>
                  )}
                  
                  <CardContent className="p-3 text-center flex-1 flex flex-col">
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${category.color} flex items-center justify-center transition-all duration-200 group-hover:scale-110`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <h3 className="text-xs font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors duration-200">
                      {category.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {category.products}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default CategorySection;
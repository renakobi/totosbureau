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
      color: "bg-secondary/35 text-secondary",
      badgeColor: "bg-secondary/20 text-secondary",
      products: `${dogProducts} Product${dogProducts !== 1 ? 's' : ''}`,
      featured: true,
      link: "/products?category=dogs"
    },
    {
      id: 2,
      title: "Cat Essentials",
      description: "Everything your feline companion needs to stay happy",
      icon: Cat,
      color: "bg-primary/35 text-primary",
      badgeColor: "bg-primary/20 text-primary",
      products: `${catProducts} Product${catProducts !== 1 ? 's' : ''}`,
      featured: false,
      link: "/products?category=cats"
    },
    {
      id: 3,
      title: "Surprise Boxes",
      description: "Monthly curated boxes filled with premium pet products",
      icon: Package,
      color: "bg-accent/35 text-accent",
      badgeColor: "bg-accent/20 text-accent",
      products: `${subscriptionProducts} Box${subscriptionProducts !== 1 ? 'es' : ''}`,
      featured: true,
      link: "/products?type=subscription"
    },
    {
      id: 4,
      title: "Premium Products",
      description: "High-quality, veterinarian-approved items for health & wellness",
      icon: Sparkles,
      color: "bg-forest/35 text-forest",
      badgeColor: "bg-forest/20 text-forest",
      products: `${totalProducts} Product${totalProducts !== 1 ? 's' : ''}`,
      featured: false,
      link: "/products"
    }
  ];
  return (
    <section className="py-4 sm:py-8 md:py-10 bg-gradient-to-b from-amber-50/5 to-accent/2">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-6">
          <Badge variant="secondary" className="mb-2 px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-base font-medium">
            Categories
          </Badge>
          <h2 className="text-xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="text-foreground">
              Find Everything
            </span>
            <br />
            <span className="text-xl md:text-4xl text-forest">
              for Your Best Friend
            </span>
          </h2>
          <p className="text-sm sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Browse our carefully organized categories to find exactly what your pet needs. 
            From daily essentials to special treats, we've got it all covered.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={category.link} className="block h-full group">
                <Card 
                  className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden backdrop-blur-sm border-border/50 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom-4 ${category.color.replace('text-', 'border-').split(' ')[0].replace('bg-', 'border-') + '/20'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`absolute inset-0 ${category.color.split(' ')[0]} opacity-100`} style={{ zIndex: 0 }}></div>
                  <div className="relative z-10 flex-1 flex flex-col">
                  {category.featured && (
                    <Badge 
                      className="absolute top-2 right-2 z-10 bg-secondary text-secondary-foreground shadow-medium text-xs px-2 py-1"
                    >
                      Popular
                    </Badge>
                  )}
                  
                  <CardContent className="p-4 sm:p-5 text-center flex-1 flex flex-col">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-lg ${category.color} flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-medium`}>
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    
                    <h3 className="text-sm sm:text-base font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-3 text-xs leading-relaxed flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {category.description}
                    </p>
                    
                    <Badge 
                      variant="outline" 
                      className={`mb-3 ${category.badgeColor} border-current/20 text-xs text-center mx-auto`}
                    >
                      {category.products}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:scale-105 text-xs py-2"
                    >
                      Explore
                    </Button>
                  </CardContent>
                  </div>
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
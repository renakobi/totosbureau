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
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/5 to-accent/2">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            Categories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-foreground">
              Find Everything
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-forest">
              for Your Best Friend
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Browse our carefully organized categories to find exactly what your pet needs. 
            From daily essentials to special treats, we've got it all covered.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={category.link} className="block h-full group">
                <Card 
                  className={`group hover:shadow-strong transition-all duration-500 hover:-translate-y-4 cursor-pointer relative overflow-hidden backdrop-blur-sm border-border/50 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom-4 ${
                    index === 0 ? 'bg-secondary/5 border-secondary/20' :
                    index === 1 ? 'bg-primary/5 border-primary/20' :
                    index === 2 ? 'bg-accent/5 border-accent/20' :
                    'bg-forest/5 border-forest/20'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {category.featured && (
                    <Badge 
                      className="absolute top-4 right-4 z-10 bg-secondary text-secondary-foreground shadow-medium"
                    >
                      Popular
                    </Badge>
                  )}
                  
                  <CardContent className="p-4 sm:p-6 md:p-8 text-center flex-1 flex flex-col">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl ${category.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-medium`}>
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10" />
                    </div>
                    
                    <h3 className="text-sm sm:text-base md:text-xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm leading-relaxed flex-1 hidden sm:block">
                      {category.description}
                    </p>
                    
                    <Badge 
                      variant="outline" 
                      className={`mb-3 sm:mb-4 md:mb-6 ${category.color} border-current/20 text-xs`}
                    >
                      {category.products}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:scale-105 text-xs sm:text-sm py-2"
                    >
                      Explore Category
                    </Button>
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
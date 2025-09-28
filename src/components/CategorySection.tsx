import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, Cat, Package, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    title: "Dog Supplies",
    description: "Premium food, toys, and accessories for your furry friend",
    icon: Dog,
    color: "bg-secondary/10 text-secondary",
    products: "120+ Products",
    featured: true,
    link: "/products?category=dogs"
  },
  {
    id: 2,
    title: "Cat Essentials",
    description: "Everything your feline companion needs to stay happy",
    icon: Cat,
    color: "bg-primary/10 text-primary",
    products: "80+ Products",
    featured: false,
    link: "/products?category=cats"
  },
  {
    id: 3,
    title: "Surprise Boxes",
    description: "Monthly curated boxes filled with premium pet products",
    icon: Package,
    color: "bg-accent/10 text-accent",
    products: "5 Box Types",
    featured: true,
    link: "/products?type=subscription"
  },
  {
    id: 4,
    title: "Premium Products",
    description: "High-quality, veterinarian-approved items for health & wellness",
    icon: Sparkles,
    color: "bg-forest/10 text-forest",
    products: "60+ Products",
    featured: false,
    link: "/products"
  }
];

const CategorySection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-amber-50/30 to-accent/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Package className="h-4 w-4" />
            Categories
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={category.link} className="block h-full group">
                <Card 
                  className="group hover:shadow-strong transition-all duration-500 hover:-translate-y-4 cursor-pointer relative overflow-hidden bg-card/90 backdrop-blur-sm border-border/50 h-full flex flex-col animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {category.featured && (
                    <Badge 
                      className="absolute top-4 right-4 z-10 bg-secondary text-secondary-foreground shadow-medium"
                    >
                      Popular
                    </Badge>
                  )}
                  
                  <CardContent className="p-8 text-center flex-1 flex flex-col">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${category.color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-medium`}>
                      <IconComponent className="h-10 w-10" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {category.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed flex-1">
                      {category.description}
                    </p>
                    
                    <Badge 
                      variant="outline" 
                      className={`mb-6 ${category.color} border-current/20`}
                    >
                      {category.products}
                    </Badge>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group-hover:scale-105"
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
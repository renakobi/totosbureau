import { Badge } from "@/components/ui/badge";
import { PawPrint, Heart, Star } from "lucide-react";

const CommunitySection = () => {


  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-amber-50/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-3 px-3 py-1 text-xs font-medium">
              Our Community
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Approved by our pet community
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Convenient for all pet sizes and types - from tiny kittens to giant dogs
            </p>
          </div>



        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

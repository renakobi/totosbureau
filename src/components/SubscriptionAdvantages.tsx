import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Leaf, Clock, Heart, Shield } from "lucide-react";

const SubscriptionAdvantages = () => {
  const advantages = [
    {
      icon: Gift,
      title: "Curated Surprises",
      description: "Hand-picked treats and toys tailored to your pet's preferences, delivered monthly",
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Packaging",
      description: "Sustainable, recyclable packaging that's safe for your pets and the environment",
      color: "from-green-400 to-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Clock,
      title: "Convenience",
      description: "No more last-minute shopping - everything arrives automatically at your door",
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Heart,
      title: "Pet Happiness",
      description: "Keep your furry friends entertained and happy with new toys and treats regularly",
      color: "from-pink-400 to-pink-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Only premium, vet-approved products from trusted brands make it into your box",
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: CheckCircle,
      title: "Cost Savings",
      description: "Get more value with exclusive discounts and bulk pricing on premium pet products",
      color: "from-teal-400 to-teal-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-background to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm font-medium">
              Why Choose Subscription?
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why is a subscription box better?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover all the advantages of our monthly pet subscription service
            </p>
          </div>

          {/* Advantages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <div
                  key={index}
                  className={`p-6 sm:p-8 rounded-2xl ${advantage.bgColor} border-2 ${advantage.borderColor} hover:shadow-lg transition-all duration-300 group`}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${advantage.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {advantage.title}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-forest/10 border border-primary/20">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Join thousands of happy pet parents today!
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionAdvantages;

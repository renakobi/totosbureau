import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import DiscountPopup from "@/components/DiscountPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20">
      <SEO 
        title="Toto's Bureau - Premium Pet Care & Supplies"
        description="Discover premium pet care products for your furry friends. Quality food, toys, accessories, and more for dogs, cats, and all pets. Shop now for the best pet supplies!"
        keywords="pet care, dog food, cat toys, pet accessories, premium pet products, pet supplies, pet store"
      />
      <Header />
      <main>
        <Hero />
        <CategorySection />
        <FeaturedProducts />
      </main>
      <Footer />
      <DiscountPopup />
    </div>
  );
};

export default Index;

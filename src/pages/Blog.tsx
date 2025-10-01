import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Blog = () => {
  return (
    <div className="min-h-screen bg-forest/5">
      <SEO 
        title="Blog - Toto's Bureau"
        description="Pet care tips, product reviews, and helpful articles from Toto's Bureau."
        keywords="pet care blog, pet tips, dog care, cat care, pet health"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
            Pet Care Blog
          </h1>
          
          <div className="space-y-8 sm:space-y-12">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                Coming Soon: Expert Pet Care Tips
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We're working on bringing you the best pet care advice, product reviews, 
                and helpful tips from our team of experts and fellow pet parents.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Stay tuned for articles on nutrition, training, health, and more!
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                What to Expect
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-secondary mr-3">•</span>
                  <span>Product reviews and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-3">•</span>
                  <span>Training tips for dogs and cats</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-3">•</span>
                  <span>Nutrition and feeding guides</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-3">•</span>
                  <span>Health and wellness advice</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-3">•</span>
                  <span>Community stories and experiences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

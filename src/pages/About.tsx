import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-forest/5">
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Toto's Bureau
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner in premium pet care
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Toto's Bureau, we believe that every pet deserves the best care and attention. 
                Our mission is to provide premium quality products and services that enhance the 
                lives of pets and their families. We carefully curate our selection to ensure 
                only the highest quality, safest, and most effective products make it to your doorstep.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Premium Products</h3>
                  <p className="text-muted-foreground">
                    From nutritious treats to engaging toys, we offer a wide range of products 
                    for both dogs and cats, carefully selected for quality and safety.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Subscription Boxes</h3>
                  <p className="text-muted-foreground">
                    Monthly surprise boxes filled with carefully curated items that will 
                    delight your furry friends and keep them engaged.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Expert Curation</h3>
                  <p className="text-muted-foreground">
                    Our team of pet care experts reviews and selects every product to ensure 
                    it meets our high standards for quality and safety.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Customer Support</h3>
                  <p className="text-muted-foreground">
                    We're here to help with any questions or concerns about our products 
                    or services. Your satisfaction is our priority.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Toto's Bureau was founded with a simple belief: that pets are family. 
                We started as a small team of pet lovers who were frustrated with the 
                lack of high-quality, trustworthy pet products available online. 
                Today, we've grown into a trusted name in pet care, serving thousands 
                of happy pets and their families across the country.
              </p>
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Explore our collection of premium pet products and discover why thousands 
                of pet parents trust Toto's Bureau.
              </p>
              <a 
                href="/products" 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

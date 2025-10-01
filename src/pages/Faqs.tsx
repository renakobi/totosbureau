import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Faqs = () => {
  return (
    <div className="min-h-screen bg-forest/5">
      <SEO 
        title="FAQs - Toto's Bureau"
        description="Frequently asked questions about Toto's Bureau pet care products and services."
        keywords="pet care faqs, pet supplies questions, toto's bureau help"
      />
      <Header />
      <main className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h1>
          
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                What products do you offer?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer a wide range of premium pet care products including food, toys, accessories, 
                and monthly subscription boxes for both cats and dogs. All our products are carefully 
                selected for quality and safety.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                How does the subscription service work?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Our subscription boxes are delivered monthly and contain a curated selection of 
                products tailored to your pet's needs. You can customize the contents and 
                pause or cancel anytime.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                What is your return policy?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                We offer a 30-day return policy for all products. If you're not satisfied with 
                your purchase, you can return it for a full refund or exchange.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                Do you ship internationally?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Currently, we ship within the United States. We're working on expanding our 
                shipping to other countries soon.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                How can I contact customer support?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                You can reach our customer support team through the contact form on our website, 
                or email us directly at support@totosbureau.com. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Faqs;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { OrderProvider } from "./contexts/OrderContext";
import { UserProvider } from "./contexts/UserContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CommunityProvider } from "./contexts/CommunityContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Cart = lazy(() => import("./pages/Cart"));
const Profile = lazy(() => import("./pages/Profile"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const EmailTest = lazy(() => import("./pages/EmailTest"));
const Admin = lazy(() => import("./pages/Admin"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Orders = lazy(() => import("./pages/Orders"));
const About = lazy(() => import("./pages/About"));
const Community = lazy(() => import("./pages/Community"));
const Faqs = lazy(() => import("./pages/Faqs"));
const Blog = lazy(() => import("./pages/Blog"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <UserProvider>
            <OrderProvider>
              <ProductProvider>
                <CommunityProvider>
                  <CartProvider>
                    <FavoritesProvider>
                  <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <ScrollToTopButton />
                <Suspense fallback={<LoadingSpinner size="lg" text="Loading..." className="min-h-screen" />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/email-test" element={<EmailTest />} />
            <Route path="/admin" element={<Admin />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/faqs" element={<Faqs />} />
                    <Route path="/blog" element={<Blog />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
                  </TooltipProvider>
                    </FavoritesProvider>
                  </CartProvider>
                </CommunityProvider>
              </ProductProvider>
            </OrderProvider>
          </UserProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;

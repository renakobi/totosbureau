import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQuantity: number;
  flavors?: string[];
  type: string;
  onSale?: boolean;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: React.ReactNode;
}

// Helper function to get sample products
const getSampleProducts = (): Product[] => [
  {
    id: 1,
    name: "Premium Dog Food - Chicken & Rice",
    description: "High-quality nutrition for your furry friend with real chicken and brown rice",
    price: 29.99,
    originalPrice: 34.99,
    category: "dogs",
    subcategory: "food",
    type: "treats",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 324,
    inStock: true,
    stockQuantity: 50,
    flavors: ["Chicken & Rice", "Beef & Sweet Potato", "Salmon & Peas"],
    onSale: true
  },
  {
    id: 2,
    name: "Interactive Cat Feather Toy",
    description: "Interactive toys to keep your cat entertained and active",
    price: 15.99,
    category: "cats",
    subcategory: "toys",
    type: "toys",
    image: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop&crop=center",
    badge: "New",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    stockQuantity: 30,
    flavors: ["Feather", "Mouse", "Ball"]
  },
  {
    id: 3,
    name: "Cat Subscription Box",
    description: "Monthly surprise box with toys, treats, and accessories for your cat",
    price: 39.99,
    category: "subscription",
    subcategory: "cats",
    type: "subscription",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop&crop=center",
    badge: "Popular",
    rating: 4.9,
    reviews: 512,
    inStock: true,
    stockQuantity: 100,
    flavors: ["Monthly", "Quarterly", "Annual"]
  }
];

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from localStorage on mount
  useEffect(() => {
    // Force clear localStorage for testing - remove this in production
    localStorage.removeItem('totos-bureau-products');
    
    const savedProducts = localStorage.getItem('totos-bureau-products');
    
    if (savedProducts) {
      try {
        const parsedProducts = JSON.parse(savedProducts);
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts);
        } else {
          // If localStorage has empty array, use sample products
          console.log('localStorage has empty products, using sample products');
          const sampleProducts = getSampleProducts();
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
        // Fall back to sample products if localStorage is corrupted
        console.log('localStorage corrupted, will use sample products');
        const sampleProducts = getSampleProducts();
        setProducts(sampleProducts);
      }
    } else {
      // Start with sample products for testing
      console.log('No saved products, loading sample products');
      const sampleProducts = getSampleProducts();
      setProducts(sampleProducts);
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('totos-bureau-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    try {
      // Validate required fields
      if (!productData.name || !productData.description || !productData.price) {
        throw new Error('Missing required product fields');
      }

      if (productData.price < 0) {
        throw new Error('Price cannot be negative');
      }

      if (productData.stockQuantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct: Product = {
        ...productData,
        id: newId,
        onSale: productData.originalPrice ? true : false
      };
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = (id: number, productData: Partial<Product>): void => {
    try {
      // Validate price if provided
      if (productData.price !== undefined && productData.price < 0) {
        throw new Error('Price cannot be negative');
      }

      // Validate stock quantity if provided
      if (productData.stockQuantity !== undefined && productData.stockQuantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, ...productData, onSale: productData.originalPrice ? true : product.onSale }
            : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = (id: number): void => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
  };

  const getFeaturedProducts = (): Product[] => {
    return products.filter(product => product.badge === "Best Seller" || product.badge === "Popular" || product.badge === "New").slice(0, 6);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      getFeaturedProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

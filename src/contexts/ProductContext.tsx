import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import type { TablesInsert } from '../integrations/supabase/types';

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
  ingredients?: string;
  aboutProduct?: string;
}

interface ProductContextType {
  products: Product[];
  isLoadingProducts: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  getProductById: (id: number) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFeaturedProducts: () => Product[];
  syncProductsToSupabase: () => Promise<void>;
  refreshProducts: () => Promise<void>;
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
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const loadProductsFromSupabase = async () => {
    try {
      setIsLoadingProducts(true);
      console.log('Loading products from Supabase...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error loading products from Supabase:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        // If it's a permission/RLS error, log it clearly
        if (error.code === 'PGRST301' || error.message?.includes('permission') || error.message?.includes('policy')) {
          console.error('⚠️ RLS Policy Error: Check Supabase Row Level Security policies for products table');
        }
        
        // Fallback to localStorage if Supabase fails
        try {
          const storedProducts = localStorage.getItem('totos-bureau-products');
          if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            setProducts(Array.isArray(parsed) ? parsed : []);
            console.log('Loaded products from localStorage fallback:', parsed.length);
            // Try to sync to Supabase
            if (parsed.length > 0) {
              console.log('🔄 Attempting to sync localStorage products to Supabase...');
              syncLocalStorageProductsToSupabase(parsed).catch(err => {
                console.error('Error syncing products to Supabase:', err);
              });
            }
          } else {
            console.warn('No products in localStorage fallback');
            // Use sample products if nothing in localStorage
            const sampleProducts = getSampleProducts();
            setProducts(sampleProducts);
          }
        } catch (e) {
          console.error('Error loading products from localStorage fallback:', e);
          const sampleProducts = getSampleProducts();
          setProducts(sampleProducts);
        }
      } else {
        console.log('Successfully loaded products from Supabase:', data?.length || 0);
        // Transform Supabase data to match Product interface
        const transformedProducts = (data || []).map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          category: product.category,
          subcategory: product.subcategory,
          image: product.image,
          badge: product.badge || undefined,
          rating: Number(product.rating),
          reviews: product.reviews,
          inStock: product.inStock,
          stockQuantity: product.stockQuantity,
          flavors: product.flavors ? (Array.isArray(product.flavors) ? product.flavors : JSON.parse(product.flavors)) : undefined,
          type: product.type,
          onSale: product.onSale,
          ingredients: product.ingredients || undefined,
          aboutProduct: product.aboutProduct || undefined
        }));
        setProducts(transformedProducts);
        
        // Check if localStorage has products that aren't in Supabase
        try {
          const storedProducts = localStorage.getItem('totos-bureau-products');
          if (storedProducts) {
            const localProducts: Product[] = JSON.parse(storedProducts);
            // Always sync if Supabase has fewer products (including 0)
            if (localProducts.length > 0 && transformedProducts.length < localProducts.length) {
              console.log(`🔄 Found ${localProducts.length} products in localStorage vs ${transformedProducts.length} in Supabase. Syncing...`);
              // Sync localStorage products to Supabase
              syncLocalStorageProductsToSupabase(localProducts).catch(err => {
                console.error('Error syncing products to Supabase:', err);
              });
            } else if (transformedProducts.length === 0 && localProducts.length > 0) {
              // Force sync if Supabase is empty but localStorage has products
              console.log(`🔄 Supabase is empty but localStorage has ${localProducts.length} products. Force syncing...`);
              syncLocalStorageProductsToSupabase(localProducts).catch(err => {
                console.error('Error syncing products to Supabase:', err);
              });
            }
          }
        } catch (e) {
          console.error('Error checking localStorage for sync:', e);
        }
        
        // Sync to localStorage as backup
        localStorage.setItem('totos-bureau-products', JSON.stringify(transformedProducts));
      }
    } catch (error) {
      console.error('Error in loadProductsFromSupabase:', error);
      // Fallback to localStorage
      try {
        const storedProducts = localStorage.getItem('totos-bureau-products');
        if (storedProducts) {
          const parsed = JSON.parse(storedProducts);
          setProducts(Array.isArray(parsed) ? parsed : []);
        } else {
          const sampleProducts = getSampleProducts();
          setProducts(sampleProducts);
        }
      } catch (e) {
        console.error('Error in fallback:', e);
        const sampleProducts = getSampleProducts();
        setProducts(sampleProducts);
      }
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Helper function to sync localStorage products to Supabase
  const syncLocalStorageProductsToSupabase = async (localProducts: Product[]) => {
    try {
      console.log(`🔄 Syncing ${localProducts.length} localStorage products to Supabase...`);
      let syncedCount = 0;
      let errorCount = 0;

      for (const product of localProducts) {
        try {
          // Check if product already exists in Supabase
          const { data: existing, error: checkError } = await supabase
            .from('products')
            .select('id')
            .eq('id', product.id)
            .maybeSingle();

          if (checkError) {
            console.error(`Error checking product ${product.id}:`, checkError);
            errorCount++;
            continue;
          }

          if (!existing) {
            // Product doesn't exist in Supabase, insert it
            const productInsert: TablesInsert<'products'> = {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              "originalPrice": product.originalPrice || null,
              category: product.category,
              subcategory: product.subcategory,
              image: product.image,
              badge: product.badge || null,
              rating: product.rating,
              reviews: product.reviews,
              "inStock": product.inStock,
              "stockQuantity": product.stockQuantity,
              flavors: product.flavors ? JSON.stringify(product.flavors) : null,
              type: product.type,
              "onSale": product.onSale || false,
              ingredients: product.ingredients || null,
              "aboutProduct": product.aboutProduct || null
            };

            const { data: inserted, error: insertError } = await supabase
              .from('products')
              .insert([productInsert] as any)
              .select()
              .single();

            if (insertError) {
              console.error(`❌ Error syncing product "${product.name}" (id: ${product.id}) to Supabase:`, insertError);
              console.error('Error code:', insertError.code);
              console.error('Error message:', insertError.message);
              if (insertError.code === 'PGRST301' || insertError.message?.includes('permission') || insertError.message?.includes('policy')) {
                console.error('⚠️ RLS Policy Error: Check Supabase Row Level Security policies for products table');
              }
              errorCount++;
            } else {
              console.log(`✅ Synced product "${product.name}" (id: ${product.id}) to Supabase`);
              syncedCount++;
            }
          } else {
            console.log(`⏭️  Product "${product.name}" (id: ${product.id}) already exists in Supabase, skipping`);
          }
        } catch (productError) {
          console.error(`❌ Error processing product ${product.id}:`, productError);
          errorCount++;
        }
      }

      console.log(`📊 Sync complete: ${syncedCount} synced, ${errorCount} errors, ${localProducts.length - syncedCount - errorCount} skipped`);
      
      // Reload products from Supabase after sync
      if (syncedCount > 0) {
        console.log('🔄 Reloading products from Supabase...');
        await loadProductsFromSupabase();
      }
    } catch (error) {
      console.error('❌ Error in syncLocalStorageProductsToSupabase:', error);
    }
  };

  // Load products from Supabase on mount and set up realtime subscription
  useEffect(() => {
    loadProductsFromSupabase();

    // Set up realtime subscription to listen for changes in Supabase
    console.log('🔔 Setting up realtime subscription for products...');
    const productsChannel = supabase
      .channel('products-changes', {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Products table changed in Supabase:', payload.eventType, payload);
          // Reload products when changes are detected
          loadProductsFromSupabase();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to products changes');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to products changes. Make sure replication is enabled in Supabase.');
          console.error('💡 Run this SQL in Supabase: ALTER PUBLICATION supabase_realtime ADD TABLE products;');
        } else {
          console.log('🔄 Subscription status:', status);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      console.log('🔕 Cleaning up products subscription...');
      supabase.removeChannel(productsChannel);
    };
  }, []); // Empty dependency array - only run on mount

  // Save products to localStorage whenever products change (as backup)
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('totos-bureau-products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
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

      // Prepare product for Supabase insert
      const productInsert: TablesInsert<'products'> = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        "originalPrice": productData.originalPrice || null,
        category: productData.category,
        subcategory: productData.subcategory,
        image: productData.image,
        badge: productData.badge || null,
        rating: productData.rating || 0,
        reviews: productData.reviews || 0,
        "inStock": productData.inStock !== undefined ? productData.inStock : true,
        "stockQuantity": productData.stockQuantity || 0,
        flavors: productData.flavors ? JSON.stringify(productData.flavors) : null,
        type: productData.type,
        "onSale": productData.originalPrice ? true : (productData.onSale || false),
        ingredients: productData.ingredients || null,
        "aboutProduct": productData.aboutProduct || null
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([productInsert])
        .select()
        .single();

      if (error) {
        console.error('Error adding product to Supabase:', error);
        throw new Error('Failed to create product');
      }

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      // Transform Supabase response to Product interface
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: Number(data.price),
        originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
        category: data.category,
        subcategory: data.subcategory,
        image: data.image,
        badge: data.badge || undefined,
        rating: Number(data.rating),
        reviews: data.reviews,
        inStock: data.inStock,
        stockQuantity: data.stockQuantity,
        flavors: data.flavors ? (Array.isArray(data.flavors) ? data.flavors : JSON.parse(data.flavors as string)) : undefined,
        type: data.type,
        onSale: data.onSale,
        ingredients: data.ingredients || undefined,
        aboutProduct: data.aboutProduct || undefined
      };

      // Update local state
      setProducts(prev => [...prev, newProduct]);
      
      // Sync to localStorage as backup
      const updatedProducts = [...products, newProduct];
      localStorage.setItem('totos-bureau-products', JSON.stringify(updatedProducts));

      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>): Promise<void> => {
    try {
      // Validate price if provided
      if (productData.price !== undefined && productData.price < 0) {
        throw new Error('Price cannot be negative');
      }

      // Validate stock quantity if provided
      if (productData.stockQuantity !== undefined && productData.stockQuantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      // Prepare updates for Supabase
      const supabaseUpdates: any = {};
      if (productData.name !== undefined) supabaseUpdates.name = productData.name;
      if (productData.description !== undefined) supabaseUpdates.description = productData.description;
      if (productData.price !== undefined) supabaseUpdates.price = productData.price;
      if (productData.originalPrice !== undefined) supabaseUpdates.originalPrice = productData.originalPrice || null;
      if (productData.category !== undefined) supabaseUpdates.category = productData.category;
      if (productData.subcategory !== undefined) supabaseUpdates.subcategory = productData.subcategory;
      if (productData.image !== undefined) supabaseUpdates.image = productData.image;
      if (productData.badge !== undefined) supabaseUpdates.badge = productData.badge || null;
      if (productData.rating !== undefined) supabaseUpdates.rating = productData.rating;
      if (productData.reviews !== undefined) supabaseUpdates.reviews = productData.reviews;
      if (productData.inStock !== undefined) supabaseUpdates.inStock = productData.inStock;
      if (productData.stockQuantity !== undefined) supabaseUpdates.stockQuantity = productData.stockQuantity;
      if (productData.flavors !== undefined) supabaseUpdates.flavors = productData.flavors ? JSON.stringify(productData.flavors) : null;
      if (productData.type !== undefined) supabaseUpdates.type = productData.type;
      if (productData.onSale !== undefined) supabaseUpdates.onSale = productData.onSale;
      if (productData.originalPrice !== undefined) {
        supabaseUpdates.onSale = productData.originalPrice ? true : (productData.onSale || false);
      }
      if (productData.ingredients !== undefined) supabaseUpdates.ingredients = productData.ingredients || null;
      if (productData.aboutProduct !== undefined) supabaseUpdates.aboutProduct = productData.aboutProduct || null;
      supabaseUpdates.updatedAt = new Date().toISOString();

      // Update in Supabase
      const { error } = await supabase
        .from('products')
        .update(supabaseUpdates)
        .eq('id', id);

      if (error) {
        console.error('Error updating product in Supabase:', error);
        throw new Error('Failed to update product');
      }

      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product.id === id 
            ? { ...product, ...productData, onSale: productData.originalPrice ? true : (productData.onSale !== undefined ? productData.onSale : product.onSale) }
            : product
        )
      );

      // Sync to localStorage as backup
      const updatedProducts = products.map(product =>
        product.id === id 
          ? { ...product, ...productData, onSale: productData.originalPrice ? true : (productData.onSale !== undefined ? productData.onSale : product.onSale) }
          : product
      );
      localStorage.setItem('totos-bureau-products', JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    // Delete from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting product from Supabase:', error);
      throw new Error('Failed to delete product');
    }

    // Update local state
    setProducts(prev => prev.filter(product => product.id !== id));
    
    // Sync to localStorage as backup
    const updatedProducts = products.filter(product => product.id !== id);
    localStorage.setItem('totos-bureau-products', JSON.stringify(updatedProducts));
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

  // Manual sync function that can be called from anywhere
  const syncProductsToSupabase = async () => {
    try {
      const storedProducts = localStorage.getItem('totos-bureau-products');
      if (storedProducts) {
        const localProducts: Product[] = JSON.parse(storedProducts);
        if (localProducts.length > 0) {
          console.log('🔄 Manual sync triggered...');
          await syncLocalStorageProductsToSupabase(localProducts);
        } else {
          console.log('No products in localStorage to sync');
        }
      } else {
        console.log('No products in localStorage to sync');
      }
    } catch (error) {
      console.error('Error in manual sync:', error);
    }
  };

  const refreshProducts = async () => {
    console.log('🔄 Manual refresh triggered...');
    await loadProductsFromSupabase();
  };

  return (
    <ProductContext.Provider value={{
      products,
      isLoadingProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      getFeaturedProducts,
      syncProductsToSupabase,
      refreshProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

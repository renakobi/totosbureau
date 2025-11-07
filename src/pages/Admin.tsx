import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Edit, Trash2, Package, Users, DollarSign, TrendingUp, Tag, Save, ArrowLeft, Upload, Check, X, Eye, MessageCircle, Settings, Truck } from "lucide-react";
import { validateForm, validationRules, ValidationErrors } from "@/utils/validation";
import { useOrders } from "@/contexts/OrderContext";
import { useUser } from "@/contexts/UserContext";
import { useProducts, Product } from "@/contexts/ProductContext";
import { useCommunity } from "@/contexts/CommunityContext";
import { useToast } from "@/hooks/use-toast";
import { getShippingSettings, saveShippingSettings, ShippingSettings } from "@/utils/shippingSettings";

// Types

interface ProductForm {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  subcategory: string;
  type: string;
  image: string;
  badge: string;
  stockQuantity: string;
  flavors: string[];
  ingredients: string;
  aboutProduct: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: number;
  name: string;
  description: string;
  categoryId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'banned';
}

interface Discount {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxUses?: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  targetType: 'all' | 'product' | 'category' | 'subcategory';
  targetId?: number;
  targetName?: string;
  description?: string;
}

interface Analytics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: number[];
  topProducts: Array<{ id: number; name: string; sales: number }>;
  userGrowth: Array<{ month: string; count: number }>;
  orderStatus: Array<{ status: string; count: number }>;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { orders } = useOrders();
  const { getAllUsers } = useUser();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { posts, pendingPosts, approvePost, rejectPost, deletePost } = useCommunity();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Category management states
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 1,
      name: "Dogs",
      description: "Everything for your canine companion",
      subcategories: [
        { id: 1, name: "Food", description: "Dog food and treats", categoryId: 1 },
        { id: 2, name: "Toys", description: "Interactive dog toys", categoryId: 1 },
        { id: 3, name: "Accessories", description: "Collars, leashes, and more", categoryId: 1 }
      ]
    },
    {
      id: 2,
      name: "Cats",
      description: "Feline essentials and accessories",
      subcategories: [
        { id: 4, name: "Food", description: "Cat food and treats", categoryId: 2 },
        { id: 5, name: "Toys", description: "Cat toys and scratchers", categoryId: 2 },
        { id: 6, name: "Litter", description: "Litter boxes and supplies", categoryId: 2 }
      ]
    }
  ]);

  // User management states - will be loaded from UserContext
  const [users, setUsers] = useState<User[]>([]);

  // Discount management states
  const [discounts, setDiscounts] = useState<Discount[]>([
    { 
      id: 1, 
      code: "WELCOME10", 
      type: "percentage", 
      value: 10, 
      minOrderAmount: 50, 
      maxUses: 100, 
      usedCount: 45, 
      startDate: "2024-09-01", 
      endDate: "2024-12-31", 
      isActive: true,
      targetType: "all",
      description: "Welcome discount for new customers"
    },
    { 
      id: 2, 
      code: "SAVE20", 
      type: "fixed", 
      value: 20, 
      minOrderAmount: 100, 
      maxUses: 50, 
      usedCount: 12, 
      startDate: "2024-09-15", 
      endDate: "2024-10-15", 
      isActive: true,
      targetType: "all",
      description: "Fixed amount discount"
    },
    { 
      id: 3, 
      code: "DOG15", 
      type: "percentage", 
      value: 15, 
      minOrderAmount: 30, 
      maxUses: 200, 
      usedCount: 78, 
      startDate: "2024-09-01", 
      endDate: "2024-12-31", 
      isActive: true,
      targetType: "category",
      targetId: 1,
      targetName: "Dogs",
      description: "15% off all dog products"
    },
    { 
      id: 4, 
      code: "TOY10", 
      type: "percentage", 
      value: 10, 
      minOrderAmount: 20, 
      maxUses: 100, 
      usedCount: 23, 
      startDate: "2024-09-01", 
      endDate: "2024-12-31", 
      isActive: true,
      targetType: "subcategory",
      targetId: 2,
      targetName: "Toys",
      description: "10% off all toys"
    }
  ]);

  // Calculate real analytics data - wrapped in useMemo to avoid calling getAllUsers in component body
  const analytics: Analytics = useMemo(() => {
    const allUsers = getAllUsers();
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - (11 - i));
      return orders
        .filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === month.getMonth() && orderDate.getFullYear() === month.getFullYear();
        })
        .reduce((sum, order) => sum + order.total, 0);
    });

    const topProducts = products
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: orders.reduce((count, order) => 
          count + order.items.filter(item => item.id === product.id).reduce((sum, item) => sum + item.quantity, 0), 0
        )
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    const orderStatus = [
      { status: "Pending", count: orders.filter(o => o.status === 'pending').length },
      { status: "Processing", count: orders.filter(o => o.status === 'processing').length },
      { status: "Shipped", count: orders.filter(o => o.status === 'shipped').length },
      { status: "Delivered", count: orders.filter(o => o.status === 'delivered').length }
    ];

    return {
      totalUsers: allUsers.length,
      totalOrders: orders.length,
      totalRevenue,
      monthlyRevenue,
      topProducts,
      userGrowth: Array.from({ length: 6 }, (_, i) => {
        const month = new Date();
        month.setMonth(month.getMonth() - (5 - i));
        return {
          month: month.toLocaleDateString('en-US', { month: 'short' }),
          count: allUsers.filter(user => {
            if (!user.createdAt) return false;
            const userDate = new Date(user.createdAt);
            return userDate.getMonth() === month.getMonth() && userDate.getFullYear() === month.getFullYear();
          }).length
        };
      }),
      orderStatus
    };
  }, [orders, products, getAllUsers]);

  // Form states
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<ValidationErrors>({});
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  
  // Shipping settings state
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(getShippingSettings());

  // Product form state
  const [productForm, setProductForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    type: "",
    image: "",
    badge: "",
    stockQuantity: "",
    flavors: [],
    ingredients: "",
    aboutProduct: ""
  });
  const [newFlavor, setNewFlavor] = useState("");

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  // Subcategory form state
  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    description: "",
    categoryId: ""
  });

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    status: "active" as "active" | "inactive" | "banned"
  });

  // Discount form state
  const [discountForm, setDiscountForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minOrderAmount: "",
    maxUses: "",
    startDate: "",
    endDate: "",
    targetType: "all" as "all" | "product" | "category" | "subcategory",
    targetId: "",
    description: ""
  });

  useEffect(() => {
    const adminStatus = localStorage.getItem("totos-bureau-admin");
    if (adminStatus === "true") {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Load users from UserContext
  useEffect(() => {
    const contextUsers = getAllUsers();
    const mappedUsers = contextUsers.map((u, index) => {
      const today = new Date().toISOString().split('T')[0];
      return {
        id: index + 1,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
        email: u.email || '',
        role: u.isAdmin ? 'admin' as const : 'user' as const,
        joinDate: u.createdAt ? u.createdAt.split('T')[0] : today,
        lastLogin: u.createdAt ? u.createdAt.split('T')[0] : today,
        totalOrders: 0,
        totalSpent: 0,
        status: u.isActive ? 'active' as const : 'inactive' as const
      };
    });
    setUsers(mappedUsers);
  }, [getAllUsers]);

  const handleLogout = () => {
    localStorage.removeItem("totos-bureau-admin");
    localStorage.removeItem("totos-bureau-user");
    localStorage.removeItem("totos-bureau-username");
    navigate("/");
  };

  // Product CRUD operations
  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      type: "",
      image: "",
      badge: "",
      stockQuantity: "",
      flavors: [],
      ingredients: "",
      aboutProduct: ""
    });
    setNewFlavor("");
    setFormErrors({});
  };

  const handleAddProduct = () => {
    const formData = {
      name: productForm.name,
      price: productForm.price,
      stockQuantity: productForm.stockQuantity
    };
    const errors = validateForm(formData, {
      name: validationRules.name,
      price: validationRules.price,
      stockQuantity: validationRules.stock
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newProduct = addProduct({
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      category: productForm.category.toLowerCase(),
      subcategory: productForm.subcategory.toLowerCase(),
      type: productForm.type.toLowerCase(),
      image: productForm.image,
      badge: productForm.badge || undefined,
      rating: 4.0,
      reviews: 0,
      inStock: parseInt(productForm.stockQuantity) > 0,
      stockQuantity: parseInt(productForm.stockQuantity),
      flavors: productForm.flavors,
      ingredients: productForm.ingredients || undefined,
      aboutProduct: productForm.aboutProduct || undefined
    });
    resetProductForm();
    setIsProductDialogOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      subcategory: product.subcategory,
      type: product.type || "",
      image: product.image,
      badge: product.badge || "",
      stockQuantity: product.stockQuantity.toString(),
      flavors: product.flavors || [],
      ingredients: product.ingredients || "",
      aboutProduct: product.aboutProduct || ""
    });
    setIsProductDialogOpen(true);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    const formData = {
      name: productForm.name,
      price: productForm.price,
      stockQuantity: productForm.stockQuantity
    };
    const errors = validateForm(formData, {
      name: validationRules.name,
      price: validationRules.price,
      stockQuantity: validationRules.stock
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    updateProduct(editingProduct.id, {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      category: productForm.category.toLowerCase(),
      subcategory: productForm.subcategory.toLowerCase(),
      type: productForm.type.toLowerCase(),
      image: productForm.image,
      badge: productForm.badge || undefined,
      inStock: parseInt(productForm.stockQuantity) > 0,
      stockQuantity: parseInt(productForm.stockQuantity),
      flavors: productForm.flavors,
      ingredients: productForm.ingredients || undefined,
      aboutProduct: productForm.aboutProduct || undefined
    });
    resetProductForm();
    setEditingProduct(null);
    setIsProductDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
  };

  // CSV Upload handler with improved parsing
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      
      // Improved CSV parsing that handles quoted fields and commas within values
      const parseCSVLine = (line: string): string[] => {
        const result: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          const nextChar = line[i + 1];
          
          if (char === '"') {
            if (inQuotes && nextChar === '"') {
              // Escaped quote
              current += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            // Field separator
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        // Add last field
        result.push(current.trim());
        return result;
      };

      const lines = text.split(/\r?\n/).filter(line => line.trim());
      if (lines.length === 0) {
        toast({
          title: "CSV Upload Error",
          description: "CSV file is empty.",
          variant: "destructive"
        });
        return;
      }

      const headers = parseCSVLine(lines[0]);
      
      // Validate required headers
      const requiredHeaders = ['name', 'description', 'price', 'category', 'subcategory', 'type', 'image', 'stockQuantity'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast({
          title: "CSV Upload Error",
          description: `Missing required columns: ${missingHeaders.join(', ')}`,
          variant: "destructive"
        });
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        try {
          const values = parseCSVLine(lines[i]);
          
          // Ensure we have enough values for all headers
          while (values.length < headers.length) {
            values.push('');
          }
          
          const product: any = {};
          
          headers.forEach((header, index) => {
            product[header] = values[index] || '';
          });

          // Validate required fields
          if (!product.name || !product.description || !product.price || !product.category || !product.subcategory || !product.type || !product.image) {
            errors.push(`Line ${i + 1}: Missing required fields`);
            errorCount++;
            continue;
          }

          // Parse flavors if they exist (separated by semicolons)
          const flavors = product.flavors ? product.flavors.split(';').map((f: string) => f.trim()).filter((f: string) => f) : [];
          
          // Validate price is a valid number
          const price = parseFloat(product.price);
          if (isNaN(price) || price <= 0) {
            errors.push(`Line ${i + 1}: Invalid price "${product.price}"`);
            errorCount++;
            continue;
          }

          // Validate stock quantity
          const stockQty = parseInt(product.stockQuantity) || 0;
          if (isNaN(stockQty) || stockQty < 0) {
            errors.push(`Line ${i + 1}: Invalid stock quantity "${product.stockQuantity}"`);
            errorCount++;
            continue;
          }

          addProduct({
            name: product.name,
            description: product.description,
            price: price,
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined,
            category: product.category.toLowerCase(),
            subcategory: product.subcategory.toLowerCase(),
            type: product.type.toLowerCase(),
            image: product.image,
            badge: product.badge || undefined,
            stockQuantity: stockQty,
            flavors: flavors.length > 0 ? flavors : undefined,
            ingredients: product.ingredients || undefined,
            aboutProduct: product.aboutProduct || undefined,
            rating: 0,
            reviews: 0,
            inStock: stockQty > 0
          });
          successCount++;
        } catch (error) {
          errorCount++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          errors.push(`Line ${i + 1}: ${errorMsg}`);
          console.error(`Error adding product from line ${i + 1}:`, error);
        }
      }

      const description = errorCount > 0 
        ? `Successfully added ${successCount} products. ${errorCount} errors. ${errors.length > 0 ? `First few errors: ${errors.slice(0, 3).join('; ')}` : ''}`
        : `Successfully added ${successCount} products!`;

      toast({
        title: "CSV Upload Complete",
        description: description,
        variant: errorCount > 0 ? "destructive" : "default"
      });

      // Reset file input
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  // User CRUD operations
  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      id: users.length + 1,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      status: userForm.status
    };
    
    setUsers([...users, newUser]);
    setUserForm({ name: "", email: "", password: "", role: "user", status: "active" });
    setIsUserDialogOpen(false);
    
    toast({
      title: "User Added",
      description: "New user has been created successfully.",
    });
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "User Deleted",
      description: "User has been removed successfully.",
    });
  };

  // Category CRUD operations
  const handleAddCategory = () => {
    if (!categoryForm.name || !categoryForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newCategory: Category = {
      id: categories.length + 1,
      name: categoryForm.name,
      description: categoryForm.description,
      subcategories: []
    };
    
    setCategories([...categories, newCategory]);
    setCategoryForm({ name: "", description: "" });
    setIsCategoryDialogOpen(false);
    
    toast({
      title: "Category Added",
      description: "New category has been created successfully.",
    });
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
    toast({
      title: "Category Deleted",
      description: "Category has been removed successfully.",
    });
  };

  // Subcategory CRUD operations
  const handleAddSubcategory = () => {
    if (!subcategoryForm.name || !subcategoryForm.description || !subcategoryForm.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const categoryId = parseInt(subcategoryForm.categoryId);
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) {
      toast({
        title: "Error",
        description: "Category not found",
        variant: "destructive"
      });
      return;
    }

    const newSubcategory: Subcategory = {
      id: Date.now(),
      name: subcategoryForm.name,
      description: subcategoryForm.description,
      categoryId: categoryId
    };
    
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, subcategories: [...c.subcategories, newSubcategory] }
        : c
    ));
    
    setSubcategoryForm({ name: "", description: "", categoryId: "" });
    setIsSubcategoryDialogOpen(false);
    
    toast({
      title: "Subcategory Added",
      description: "New subcategory has been created successfully.",
    });
  };

  const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
    setCategories(categories.map(c => 
      c.id === categoryId 
        ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subcategoryId) }
        : c
    ));
    
    toast({
      title: "Subcategory Deleted",
      description: "Subcategory has been removed successfully.",
    });
  };

  // Flavor management functions
  const addFlavor = () => {
    if (newFlavor.trim() && !productForm.flavors.includes(newFlavor.trim())) {
      setProductForm(prev => ({
        ...prev,
        flavors: [...prev.flavors, newFlavor.trim()]
      }));
      setNewFlavor("");
    }
  };

  const removeFlavor = (flavor: string) => {
    setProductForm(prev => ({
      ...prev,
      flavors: prev.flavors.filter(f => f !== flavor)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProductForm(prev => ({
          ...prev,
          image: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  // Helper functions for discount targets
  const getTargetOptions = () => {
    switch (discountForm.targetType) {
      case 'product':
        return products.map(product => ({
          id: product.id,
          name: product.name,
          type: 'product'
        }));
      case 'category':
        return categories.map(category => ({
          id: category.id,
          name: category.name,
          type: 'category'
        }));
      case 'subcategory':
        return categories.flatMap(category => 
          category.subcategories.map(subcategory => ({
            id: subcategory.id,
            name: `${category.name} - ${subcategory.name}`,
            type: 'subcategory'
          }))
        );
      default:
        return [];
    }
  };

  const getTargetName = (targetType: string, targetId: number) => {
    switch (targetType) {
      case 'product':
        const product = products.find(p => p.id === targetId);
        return product?.name || 'Unknown Product';
      case 'category':
        const category = categories.find(c => c.id === targetId);
        return category?.name || 'Unknown Category';
      case 'subcategory':
        const subcategory = categories
          .flatMap(c => c.subcategories)
          .find(s => s.id === targetId);
        const parentCategory = categories.find(c => 
          c.subcategories.some(s => s.id === targetId)
        );
        return subcategory ? `${parentCategory?.name} - ${subcategory.name}` : 'Unknown Subcategory';
      default:
        return 'All Products';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Dashboard stats
  const stats = [
    { title: "Total Users", value: analytics.totalUsers.toString(), icon: Users, change: "+12%" },
    { title: "Total Orders", value: analytics.totalOrders.toString(), icon: Package, change: "+8%" },
    { title: "Total Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+22%" },
    { title: "Growth", value: "34%", icon: TrendingUp, change: "+8%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-background to-amber-50/20">
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Mobile-responsive header */}
        <div className="flex flex-col sm:flex-row sm:h-20 sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              onClick={() => activeTab === "dashboard" ? navigate("/") : setActiveTab("dashboard")}
              className="hover:bg-primary/10 transition-smooth flex-shrink-0"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{activeTab === "dashboard" ? "Back to Site" : "Back to Dashboard"}</span>
            </Button>
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-forest rounded-xl flex items-center justify-center shadow-medium flex-shrink-0">
                <Package className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-forest to-primary bg-clip-text text-transparent truncate">
                  Toto's Bureau
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="hover:bg-primary/10 w-full sm:w-auto flex-shrink-0" size="sm">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-8">
          {/* Scrollable tabs for mobile */}
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <TabsList className="inline-flex w-auto min-w-full sm:w-full bg-muted/50 h-auto p-1 sm:grid sm:grid-cols-8 gap-1 sm:gap-0">
              <TabsTrigger value="dashboard" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="products" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Categories
              </TabsTrigger>
              <TabsTrigger value="subcategories" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Subcategories
              </TabsTrigger>
              <TabsTrigger value="users" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Users
              </TabsTrigger>
              <TabsTrigger value="community" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Community
              </TabsTrigger>
              <TabsTrigger value="discounts" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Discounts
              </TabsTrigger>
              <TabsTrigger value="settings" className="whitespace-nowrap text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
        {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
                <Card key={index} className="bg-gradient-to-br from-card to-primary/5 border-border/50 hover:shadow-medium transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-primary">{stat.change}</p>
                  </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50 hover:shadow-medium transition-all duration-300">
          <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Product Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white"
                      onClick={() => setActiveTab("products")}
                    >
                <Plus className="h-4 w-4 mr-2" />
                      Add Products
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-primary/5"
                      onClick={() => setActiveTab("products")}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View All Products
              </Button>
            </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-secondary/5 border-border/50 hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-secondary" />
                    Category Management
                  </CardTitle>
          </CardHeader>
          <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                      onClick={() => setActiveTab("categories")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Categories
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-secondary/5"
                      onClick={() => setActiveTab("subcategories")}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Manage Subcategories
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-card to-forest/5 border-border/50 hover:shadow-medium transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-forest" />
                    Analytics & Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-forest to-primary hover:from-forest/90 hover:to-primary/90 text-white"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-forest/5"
                      onClick={() => setActiveTab("discounts")}
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Discount Management
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Section */}
            <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Order #{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${order.total.toFixed(2)}</p>
                            <Badge 
                              variant="outline" 
                              className={`${
                                order.status === 'delivered' ? 'text-white border-white' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }`}
                              style={order.status === 'delivered' ? { backgroundColor: '#9aedb6' } : {}}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <div className="text-center pt-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab("analytics")}
                            className="text-primary hover:bg-primary/5"
                          >
                            View All Orders
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Product Management
              </h2>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white w-full sm:w-auto"
                      onClick={() => {
                        resetProductForm();
                        setEditingProduct(null);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          placeholder="Enter product name"
                          className={formErrors.name ? "border-destructive" : ""}
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive">{formErrors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="originalPrice">Original Price ($)</Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stockQuantity">Stock Quantity</Label>
                        <Input
                          id="stockQuantity"
                          type="number"
                          value={productForm.stockQuantity}
                          onChange={(e) => setProductForm({...productForm, stockQuantity: e.target.value})}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={productForm.category} onValueChange={(value) => setProductForm({...productForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Select value={productForm.subcategory} onValueChange={(value) => setProductForm({...productForm, subcategory: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.find(c => c.name === productForm.category)?.subcategories.map((subcategory) => (
                              <SelectItem key={subcategory.id} value={subcategory.name}>
                                {subcategory.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="type">Product Type</Label>
                        <Input
                          id="type"
                          name="type"
                          value={productForm.type}
                          onChange={(e) => setProductForm({...productForm, type: e.target.value})}
                          placeholder="e.g., treats, toys, clothes, subscription"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="image">Product Image</Label>
                        <div className="space-y-2">
                          <Input
                            id="image"
                            name="image"
                            value={productForm.image}
                            onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                            placeholder="Enter image URL or upload file"
                          />
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <Label htmlFor="image-upload" className="cursor-pointer">
                              <Button type="button" variant="outline" size="sm" asChild>
                                <span>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Photo
                                </span>
                              </Button>
                            </Label>
                            {productForm.image && (
                              <div className="w-16 h-16 border rounded-lg overflow-hidden">
                                <img 
                                  src={productForm.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Product Flavors</Label>
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <Input
                              value={newFlavor}
                              onChange={(e) => setNewFlavor(e.target.value)}
                              placeholder="Add flavor (e.g., Chicken, Beef)"
                              onKeyPress={(e) => e.key === 'Enter' && addFlavor()}
                            />
                            <Button type="button" onClick={addFlavor} size="sm">
                              Add
                            </Button>
                          </div>
                          {productForm.flavors.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {productForm.flavors.map((flavor, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                  {flavor}
                                  <button
                                    type="button"
                                    onClick={() => removeFlavor(flavor)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="ingredients">Ingredients</Label>
                        <Textarea
                          id="ingredients"
                          value={productForm.ingredients}
                          onChange={(e) => setProductForm({...productForm, ingredients: e.target.value})}
                          placeholder="Enter ingredients (one per line or comma separated)"
                          rows={3}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="aboutProduct">About This Product</Label>
                        <Textarea
                          id="aboutProduct"
                          value={productForm.aboutProduct}
                          onChange={(e) => setProductForm({...productForm, aboutProduct: e.target.value})}
                          placeholder="Enter detailed product information, care instructions, etc."
                          rows={4}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="badge">Badge (e.g., New, Sale, Best Seller)</Label>
                        <Input
                          id="badge"
                          value={productForm.badge}
                          onChange={(e) => setProductForm({...productForm, badge: e.target.value})}
                          placeholder="Enter badge text"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-primary to-forest hover:from-primary/90 hover:to-forest/90 text-white"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingProduct ? "Updating..." : "Adding..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {editingProduct ? "Update" : "Add"} Product
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="csv-upload"
                  />
                  <Button 
                    className="bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white"
                    asChild
                  >
                    <label htmlFor="csv-upload" className="cursor-pointer flex items-center">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV
                    </label>
                  </Button>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-card to-primary/5 border-border/50">
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="text-2xl">{product.image}</div>
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.stockQuantity}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                                className="h-8 w-8 hover:bg-primary/10"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="h-8 w-8 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 bg-background/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="text-3xl flex-shrink-0">{product.image}</div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-base truncate">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8 hover:bg-primary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="h-8 w-8 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Price</p>
                          <p className="font-semibold">${product.price.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Stock</p>
                          <p className="font-semibold">{product.stockQuantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No products found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-secondary bg-clip-text text-transparent">
                Category Management
              </h2>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white w-full sm:w-auto"
                    onClick={() => {
                      setCategoryForm({ name: "", description: "" });
                      setEditingCategory(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-lg bg-gradient-to-br from-card to-secondary/5 mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {editingCategory ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                  </DialogHeader>
              <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                        placeholder="Enter category description"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                      onClick={handleAddCategory}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingCategory ? "Update" : "Add"} Category
                    </Button>
              </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gradient-to-br from-card to-secondary/5 border-border/50">
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Subcategories</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.subcategories.length}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-secondary/10"
                                onClick={() => {
                                  setEditingCategory(category);
                                  setCategoryForm({
                                    name: category.name,
                                    description: category.description
                                  });
                                  setIsCategoryDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {categories.map((category) => (
                    <div key={category.id} className="border rounded-lg p-4 bg-background/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{category.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                description: category.description
                              });
                              setIsCategoryDialogOpen(true);
                            }}
                            className="h-8 w-8 hover:bg-secondary/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="h-8 w-8 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">Subcategories</p>
                        <p className="font-semibold">{category.subcategories.length}</p>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No categories found</p>
                    </div>
                  )}
                </div>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Other tabs would go here - simplified for now */}
          <TabsContent value="subcategories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Subcategory Management
              </h2>
              <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white"
                    onClick={() => {
                      setSubcategoryForm({ name: "", description: "", categoryId: "" });
                      setEditingSubcategory(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subcategory
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg bg-gradient-to-br from-card to-accent/5">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
                    </DialogTitle>
                  </DialogHeader>
              <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subcategoryCategory">Parent Category</Label>
                      <Select value={subcategoryForm.categoryId} onValueChange={(value) => setSubcategoryForm({...subcategoryForm, categoryId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategoryName">Subcategory Name</Label>
                      <Input
                        id="subcategoryName"
                        value={subcategoryForm.name}
                        onChange={(e) => setSubcategoryForm({...subcategoryForm, name: e.target.value})}
                        placeholder="Enter subcategory name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subcategoryDescription">Description</Label>
                      <Textarea
                        id="subcategoryDescription"
                        value={subcategoryForm.description}
                        onChange={(e) => setSubcategoryForm({...subcategoryForm, description: e.target.value})}
                        placeholder="Enter subcategory description"
                        rows={3}
                      />
                  </div>
              </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white"
                      onClick={handleAddSubcategory}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingSubcategory ? "Update" : "Add"} Subcategory
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
        </div>

            <div className="space-y-6">
              {categories.map((category) => (
                <Card key={category.id} className="bg-gradient-to-br from-card to-accent/5 border-border/50">
            <CardHeader>
                    <CardTitle className="text-xl">{category.name} Subcategories</CardTitle>
            </CardHeader>
            <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="p-4 border rounded-lg bg-gradient-to-br from-background to-accent/5 hover:shadow-medium transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{subcategory.name}</h4>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-accent/10"
                              >
                                <Edit className="h-3 w-3" />
                </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                        </div>
                      ))}
              </div>
            </CardContent>
          </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                User Management
              </h2>
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white w-full sm:w-auto"
                    onClick={() => {
                      setUserForm({ name: "", email: "", password: "", role: "user", status: "active" });
                      setEditingUser(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-lg bg-gradient-to-br from-card to-accent/5 mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      {editingUser ? "Edit User" : "Add New User"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
              <div className="space-y-2">
                      <Label htmlFor="userName">Name</Label>
                      <Input
                        id="userName"
                        value={userForm.name}
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        placeholder="Enter user name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">Email</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        placeholder="Enter user email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Password</Label>
                      <Input
                        id="userPassword"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userRole">Role</Label>
                      <Select value={userForm.role} onValueChange={(value: "admin" | "user") => setUserForm({...userForm, role: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userStatus">Status</Label>
                      <Select value={userForm.status} onValueChange={(value: "active" | "inactive" | "banned") => setUserForm({...userForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                      Cancel
                </Button>
                    <Button
                      className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white"
                      onClick={handleAddUser}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingUser ? "Update" : "Add"} User
                </Button>
              </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50">
              <CardContent className="p-0">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'destructive'}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.totalOrders}</TableCell>
                          <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingUser(user);
                                  setUserForm({
                                    name: user.name,
                                    email: user.email,
                                    password: "",
                                    role: user.role,
                                    status: user.status
                                  });
                                  setIsUserDialogOpen(true);
                                }}
                                className="h-8 w-8 hover:bg-accent/10"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                                className="h-8 w-8 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4 bg-background/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base">{user.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingUser(user);
                              setUserForm({
                                name: user.name,
                                email: user.email,
                                password: "",
                                role: user.role,
                                status: user.status
                              });
                              setIsUserDialogOpen(true);
                            }}
                            className="h-8 w-8 hover:bg-accent/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 pt-2 border-t">
                        <div>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <div>
                          <Badge variant={user.status === 'active' ? 'default' : user.status === 'inactive' ? 'secondary' : 'destructive'} className="text-xs">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Orders</p>
                          <p className="font-semibold">{user.totalOrders}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                          <p className="font-semibold">${user.totalSpent.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Discount Management
              </h2>
              <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white w-full sm:w-auto"
                    onClick={() => {
                      setDiscountForm({
                        code: "",
                        type: "percentage",
                        value: "",
                        minOrderAmount: "",
                        maxUses: "",
                        startDate: "",
                        endDate: "",
                        targetType: "all",
                        targetId: "",
                        description: ""
                      });
                      setEditingDiscount(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Discount
                  </Button>
                </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card to-accent/5 mx-2 sm:mx-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                      {editingDiscount ? "Edit Discount" : "Add New Discount"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
              <div className="space-y-2">
                      <Label htmlFor="discountCode">Discount Code</Label>
                      <Input
                        id="discountCode"
                        value={discountForm.code}
                        onChange={(e) => setDiscountForm({...discountForm, code: e.target.value})}
                        placeholder="Enter discount code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountDescription">Description</Label>
                      <Input
                        id="discountDescription"
                        value={discountForm.description}
                        onChange={(e) => setDiscountForm({...discountForm, description: e.target.value})}
                        placeholder="Enter discount description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="targetType">Discount Target</Label>
                      <Select 
                        value={discountForm.targetType} 
                        onValueChange={(value: "all" | "product" | "category" | "subcategory") => 
                          setDiscountForm({...discountForm, targetType: value, targetId: ""})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="product">Specific Product</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                          <SelectItem value="subcategory">Subcategory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {discountForm.targetType !== 'all' && (
                      <div className="space-y-2">
                        <Label htmlFor="targetId">
                          {discountForm.targetType === 'product' ? 'Select Product' : 
                           discountForm.targetType === 'category' ? 'Select Category' : 
                           'Select Subcategory'}
                        </Label>
                        <Select 
                          value={discountForm.targetId} 
                          onValueChange={(value) => setDiscountForm({...discountForm, targetId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${discountForm.targetType}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {getTargetOptions().map((option) => (
                              <SelectItem key={option.id} value={option.id.toString()}>
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="discountType">Type</Label>
                      <Select value={discountForm.type} onValueChange={(value: "percentage" | "fixed") => setDiscountForm({...discountForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="discountValue">Value</Label>
                        <Input
                          id="discountValue"
                          type="number"
                          value={discountForm.value}
                          onChange={(e) => setDiscountForm({...discountForm, value: e.target.value})}
                          placeholder="Enter value"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minOrderAmount">Min Order (Optional)</Label>
                        <Input
                          id="minOrderAmount"
                          type="number"
                          value={discountForm.minOrderAmount}
                          onChange={(e) => setDiscountForm({...discountForm, minOrderAmount: e.target.value})}
                          placeholder="Min amount"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxUses">Maximum Uses (Optional)</Label>
                      <Input
                        id="maxUses"
                        type="number"
                        value={discountForm.maxUses}
                        onChange={(e) => setDiscountForm({...discountForm, maxUses: e.target.value})}
                        placeholder="Enter maximum uses"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={discountForm.startDate}
                          onChange={(e) => setDiscountForm({...discountForm, startDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={discountForm.endDate}
                          onChange={(e) => setDiscountForm({...discountForm, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>
                      Cancel
                </Button>
                    <Button
                      className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {editingDiscount ? "Update" : "Add"} Discount
                </Button>
              </div>
                </DialogContent>
              </Dialog>
        </div>

            <Card className="bg-gradient-to-br from-card to-accent/5 border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Min Order</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discounts.map((discount) => (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">{discount.code}</TableCell>
                        <TableCell>{discount.type}</TableCell>
                        <TableCell>
                          {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {discount.targetType === 'all' ? 'All Products' : 
                               discount.targetType === 'product' ? 'Product' :
                               discount.targetType === 'category' ? 'Category' : 'Subcategory'}
                            </span>
                            {discount.targetType !== 'all' && discount.targetId && (
                              <span className="text-xs text-muted-foreground">
                                {getTargetName(discount.targetType, discount.targetId)}
                              </span>
                            )}
      </div>
                        </TableCell>
                        <TableCell>
                          {discount.minOrderAmount ? `$${discount.minOrderAmount}` : 'None'}
                        </TableCell>
                        <TableCell>
                          {discount.usedCount}/{discount.maxUses || '∞'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={discount.isActive ? 'default' : 'secondary'}>
                            {discount.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingDiscount(discount);
                                setDiscountForm({
                                  code: discount.code,
                                  type: discount.type,
                                  value: discount.value.toString(),
                                  minOrderAmount: discount.minOrderAmount?.toString() || "",
                                  maxUses: discount.maxUses?.toString() || "",
                                  startDate: discount.startDate,
                                  endDate: discount.endDate,
                                  targetType: discount.targetType,
                                  targetId: discount.targetId?.toString() || "",
                                  description: discount.description || ""
                                });
                                setIsDiscountDialogOpen(true);
                              }}
                              className="h-8 w-8 hover:bg-accent/10"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDiscounts(discounts.filter(d => d.id !== discount.id))}
                              className="h-8 w-8 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
          </TabsContent>

          {/* Community Management Tab */}
          <TabsContent value="community" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Community Management
              </h2>
            </div>

            {/* Pending Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Pending Posts ({pendingPosts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending posts to review
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPosts.map((post) => (
                      <Card key={post.id} className="border-l-4 border-l-yellow-500">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="text-2xl">{post.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{post.user}</span>
                                <Badge variant="secondary">Pending</Badge>
                                <span className="text-sm text-muted-foreground">{post.time}</span>
                              </div>
                              <p className="text-foreground mb-3">{post.content}</p>
                              {post.image && (
                                <div className="mb-3">
                                  <img 
                                    src={post.image} 
                                    alt="Post image" 
                                    className="w-full max-w-md h-48 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => approvePost(post.id)}
                                  style={{ backgroundColor: '#9aedb6' }}
                                  className="hover:opacity-90"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => rejectPost(post.id)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approved Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Approved Posts ({posts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No approved posts yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <Card key={post.id} className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="text-2xl">{post.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">{post.user}</span>
                                <Badge variant="default" style={{ backgroundColor: '#9aedb6', color: 'white' }}>Approved</Badge>
                                <span className="text-sm text-muted-foreground">{post.time}</span>
                              </div>
                              <p className="text-foreground mb-3">{post.content}</p>
                              {post.image && (
                                <div className="mb-3">
                                  <img 
                                    src={post.image} 
                                    alt="Post image" 
                                    className="w-full max-w-md h-48 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {post.likes} likes • {post.comments} comments
                                </span>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                Settings
              </h2>
            </div>

            {/* Shipping Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="shipping-enabled"
                      checked={shippingSettings.enabled}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, enabled: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="shipping-enabled" className="text-base font-medium">
                      Enable Shipping Charges
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When disabled, all orders will have free shipping regardless of order total.
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="standard-cost">Standard Shipping Cost ($)</Label>
                    <Input
                      id="standard-cost"
                      name="standard-cost"
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingSettings.standardCost}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, standardCost: parseFloat(e.target.value) || 0 })}
                      placeholder="9.99"
                    />
                    <p className="text-sm text-muted-foreground">
                      The standard shipping cost charged when free shipping threshold is not met.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="free-threshold">Free Shipping Threshold ($)</Label>
                    <Input
                      id="free-threshold"
                      name="free-threshold"
                      type="number"
                      step="0.01"
                      min="0"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                      placeholder="50.00"
                    />
                    <p className="text-sm text-muted-foreground">
                      Orders at or above this amount will qualify for free shipping.
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Current Behavior:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Standard shipping: ${shippingSettings.standardCost.toFixed(2)}</li>
                    <li>Free shipping threshold: ${shippingSettings.freeShippingThreshold.toFixed(2)}</li>
                    <li>Orders under ${shippingSettings.freeShippingThreshold.toFixed(2)} will be charged ${shippingSettings.standardCost.toFixed(2)} shipping</li>
                    <li>Orders at or above ${shippingSettings.freeShippingThreshold.toFixed(2)} will have free shipping</li>
                    {!shippingSettings.enabled && <li className="text-primary font-medium">⚠️ Shipping is currently disabled - all orders will have free shipping</li>}
                  </ul>
                </div>

                <Button
                  onClick={() => {
                    saveShippingSettings(shippingSettings);
                    toast({
                      title: "Settings Saved",
                      description: "Shipping configuration has been updated successfully.",
                    });
                  }}
                  className="w-full md:w-auto"
                  style={{ backgroundColor: '#9aedb6' }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Shipping Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
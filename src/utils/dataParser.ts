// Product data parsing utilities
export interface ParsedProduct {
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
}

export interface ImportOptions {
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  defaultCategory?: string;
  defaultSubcategory?: string;
}

// Parse CSV data
export const parseCSV = (csvText: string): ParsedProduct[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const product: any = {};
    
    headers.forEach((header, i) => {
      const value = values[i] || '';
      product[header] = value;
    });
    
    return parseProductData(product, index + 1);
  });
};

// Parse JSON data
export const parseJSON = (jsonData: any[]): ParsedProduct[] => {
  return jsonData.map((item, index) => parseProductData(item, index + 1));
};

// Parse Excel/Spreadsheet data (simplified)
export const parseExcel = (excelData: any[][]): ParsedProduct[] => {
  const headers = excelData[0].map((h: string) => h.trim().toLowerCase());
  
  return excelData.slice(1).map((row, index) => {
    const product: any = {};
    
    headers.forEach((header, i) => {
      product[header] = row[i] || '';
    });
    
    return parseProductData(product, index + 1);
  });
};

// Parse individual product data
const parseProductData = (data: any, fallbackId: number): ParsedProduct => {
  return {
    id: parseInt(data.id) || fallbackId,
    name: data.name || data.product_name || data.title || 'Unnamed Product',
    description: data.description || data.desc || data.details || 'No description available',
    price: parseFloat(data.price) || 0,
    originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
    category: data.category || data.cat || 'General',
    subcategory: data.subcategory || data.sub_cat || data.type || 'Other',
    image: data.image || data.image_url || data.photo || '🛍️',
    badge: data.badge || data.tag || data.label || undefined,
    rating: parseFloat(data.rating) || 4.0,
    reviews: parseInt(data.reviews) || 0,
    inStock: data.in_stock !== 'false' && data.in_stock !== false && data.stock_quantity > 0,
    stockQuantity: parseInt(data.stock_quantity) || parseInt(data.stock) || 0
  };
};

// Parse from various file formats
export const parseFileData = async (file: File): Promise<ParsedProduct[]> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      const text = await file.text();
      return parseCSV(text);
    } else if (fileType === 'application/json' || fileName.endsWith('.json')) {
      const text = await file.text();
      const data = JSON.parse(text);
      return Array.isArray(data) ? parseJSON(data) : parseJSON([data]);
    } else if (fileType.includes('sheet') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // For Excel files, you'd need a library like xlsx
      throw new Error('Excel files require additional library. Please convert to CSV first.');
    } else {
      throw new Error('Unsupported file format. Please use CSV or JSON.');
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Validate product data
export const validateProductData = (products: ParsedProduct[]): { valid: ParsedProduct[], invalid: any[] } => {
  const valid: ParsedProduct[] = [];
  const invalid: any[] = [];
  
  products.forEach((product, index) => {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim() === '') {
      errors.push('Name is required');
    }
    
    if (!product.price || product.price <= 0) {
      errors.push('Price must be greater than 0');
    }
    
    if (!product.category || product.category.trim() === '') {
      errors.push('Category is required');
    }
    
    if (errors.length > 0) {
      invalid.push({ product, errors, index });
    } else {
      valid.push(product);
    }
  });
  
  return { valid, invalid };
};

// Sample data formats for reference
export const sampleCSV = `name,description,price,original_price,category,subcategory,image,badge,rating,reviews,stock_quantity
"Premium Dog Food","High-quality nutrition for your furry friend",29.99,34.99,"Dogs","Food","🐕","Best Seller",4.8,324,50
"Cat Toy Set","Interactive toys to keep your cat entertained",15.99,,"Cats","Toys","🐱","New",4.6,156,30
"Dog Leash","Durable and comfortable leash",12.99,,"Dogs","Accessories","🔗","",4.5,89,25`;

export const sampleJSON = [
  {
    "name": "Premium Dog Food",
    "description": "High-quality nutrition for your furry friend",
    "price": 29.99,
    "original_price": 34.99,
    "category": "Dogs",
    "subcategory": "Food",
    "image": "🐕",
    "badge": "Best Seller",
    "rating": 4.8,
    "reviews": 324,
    "stock_quantity": 50
  },
  {
    "name": "Cat Toy Set",
    "description": "Interactive toys to keep your cat entertained",
    "price": 15.99,
    "category": "Cats",
    "subcategory": "Toys",
    "image": "🐱",
    "badge": "New",
    "rating": 4.6,
    "reviews": 156,
    "stock_quantity": 30
  }
];

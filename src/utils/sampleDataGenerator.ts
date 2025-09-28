// Sample data generator for testing
import { ParsedProduct } from './dataParser';

export const generateSampleProducts = (count: number = 10): ParsedProduct[] => {
  const categories = ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Animals'];
  const subcategories = {
    'Dogs': ['Food', 'Toys', 'Accessories', 'Health', 'Clothing'],
    'Cats': ['Food', 'Toys', 'Litter', 'Scratching', 'Health'],
    'Birds': ['Food', 'Cages', 'Toys', 'Perches', 'Health'],
    'Fish': ['Food', 'Tanks', 'Filters', 'Decorations', 'Health'],
    'Small Animals': ['Food', 'Habitats', 'Toys', 'Bedding', 'Health']
  };

  const productNames = [
    'Premium Food', 'Interactive Toy', 'Comfortable Bed', 'Durable Leash',
    'Healthy Treats', 'Grooming Kit', 'Training Aid', 'Safety Collar',
    'Exercise Ball', 'Chew Toy', 'Water Bottle', 'Food Bowl',
    'Travel Carrier', 'Scratching Post', 'Litter Box', 'Cage Accessory'
  ];

  const descriptions = [
    'High-quality nutrition for your pet',
    'Interactive and engaging toy',
    'Comfortable and durable design',
    'Safe and reliable product',
    'Promotes healthy habits',
    'Easy to clean and maintain',
    'Suitable for all sizes',
    'Made from safe materials'
  ];

  const badges = ['Best Seller', 'New', 'Sale', 'Limited Edition', 'Premium', 'Eco-Friendly'];

  return Array.from({ length: count }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategory = subcategories[category as keyof typeof subcategories][
      Math.floor(Math.random() * subcategories[category as keyof typeof subcategories].length)
    ];
    const name = productNames[Math.floor(Math.random() * productNames.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const price = Math.round((Math.random() * 50 + 5) * 100) / 100;
    const originalPrice = Math.random() > 0.7 ? Math.round((price * 1.2) * 100) / 100 : undefined;
    const rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
    const reviews = Math.floor(Math.random() * 500);
    const stockQuantity = Math.floor(Math.random() * 100);
    const badge = Math.random() > 0.6 ? badges[Math.floor(Math.random() * badges.length)] : undefined;

    return {
      id: index + 1,
      name: `${name} - ${category}`,
      description: `${description} for ${category.toLowerCase()}.`,
      price,
      originalPrice,
      category,
      subcategory,
      image: getRandomEmoji(category),
      badge,
      rating,
      reviews,
      inStock: stockQuantity > 0,
      stockQuantity
    };
  });
};

const getRandomEmoji = (category: string): string => {
  const emojis = {
    'Dogs': ['🐕', '🐶', '🦴', '🎾', '🦮'],
    'Cats': ['🐱', '🐈', '🐾', '🧶', '🐈‍⬛'],
    'Birds': ['🐦', '🦜', '🦅', '🐤', '🦆'],
    'Fish': ['🐠', '🐟', '🐡', '🦈', '🐙'],
    'Small Animals': ['🐰', '🐹', '🐭', '🐾', '🦔']
  };
  
  const categoryEmojis = emojis[category as keyof typeof emojis] || ['🛍️'];
  return categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
};

// Generate sample CSV
export const generateSampleCSV = (count: number = 10): string => {
  const products = generateSampleProducts(count);
  const headers = [
    'name', 'description', 'price', 'original_price', 'category', 
    'subcategory', 'image', 'badge', 'rating', 'reviews', 'stock_quantity'
  ];
  
  const csvRows = [
    headers.join(','),
    ...products.map(product => [
      `"${product.name}"`,
      `"${product.description}"`,
      product.price,
      product.originalPrice || '',
      `"${product.category}"`,
      `"${product.subcategory}"`,
      `"${product.image}"`,
      product.badge ? `"${product.badge}"` : '',
      product.rating,
      product.reviews,
      product.stockQuantity
    ].join(','))
  ];
  
  return csvRows.join('\n');
};

// Generate sample JSON
export const generateSampleJSON = (count: number = 10): string => {
  const products = generateSampleProducts(count);
  return JSON.stringify(products, null, 2);
};

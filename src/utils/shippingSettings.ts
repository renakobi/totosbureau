// Shipping settings configuration
export interface ShippingSettings {
  standardCost: number;
  freeShippingThreshold: number;
  enabled: boolean;
}

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  standardCost: 9.99,
  freeShippingThreshold: 50,
  enabled: true,
};

const STORAGE_KEY = 'totosbureau_shipping_settings';

// Get shipping settings from localStorage
export const getShippingSettings = (): ShippingSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading shipping settings:', error);
  }
  return DEFAULT_SHIPPING_SETTINGS;
};

// Save shipping settings to localStorage
export const saveShippingSettings = (settings: ShippingSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving shipping settings:', error);
  }
};

// Calculate shipping cost based on subtotal and settings
export const calculateShipping = (subtotal: number): number => {
  const settings = getShippingSettings();
  
  if (!settings.enabled) {
    return 0;
  }
  
  // If subtotal meets or exceeds free shipping threshold, shipping is free
  if (subtotal >= settings.freeShippingThreshold) {
    return 0;
  }
  
  return settings.standardCost;
};

// Get amount needed for free shipping
export const getFreeShippingRemaining = (subtotal: number): number => {
  const settings = getShippingSettings();
  const remaining = settings.freeShippingThreshold - subtotal;
  return remaining > 0 ? remaining : 0;
};







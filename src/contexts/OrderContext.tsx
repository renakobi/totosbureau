import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useUser } from './UserContext';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
  trackingNumber?: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getRecentOrders: (limit?: number) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [orders, setOrders] = useState<Order[]>(() => {
    const storedOrders = localStorage.getItem('totos-bureau-orders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  });

  // Load orders from Supabase on mount
  useEffect(() => {
    const loadOrdersFromSupabase = async () => {
      try {
        let query = supabase.from('orders').select('*').order('orderDate', { ascending: false });
        
        // If user is logged in, filter by userId, otherwise get all (for admin)
        if (currentUser && !currentUser.isAdmin) {
          query = query.eq('userId', currentUser.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error loading orders from Supabase:', error);
          // Fallback to localStorage if Supabase fails
          return;
        }

        if (data) {
          // Transform Supabase data to Order interface
          const transformedOrders: Order[] = data.map((o: any) => ({
            id: o.id,
            orderNumber: o.orderNumber,
            items: Array.isArray(o.items) ? o.items : JSON.parse(o.items),
            subtotal: parseFloat(o.subtotal),
            shipping: parseFloat(o.shipping),
            tax: parseFloat(o.tax),
            total: parseFloat(o.total),
            status: o.status,
            orderDate: o.orderDate,
            estimatedDelivery: o.estimatedDelivery,
            shippingAddress: typeof o.shippingAddress === 'string' ? JSON.parse(o.shippingAddress) : o.shippingAddress,
            billingAddress: typeof o.billingAddress === 'string' ? JSON.parse(o.billingAddress) : o.billingAddress,
            paymentMethod: typeof o.paymentMethod === 'string' ? JSON.parse(o.paymentMethod) : o.paymentMethod,
            trackingNumber: o.trackingNumber || undefined
          }));

          setOrders(transformedOrders);
          localStorage.setItem('totos-bureau-orders', JSON.stringify(transformedOrders));
        }
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };

    loadOrdersFromSupabase();
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('totos-bureau-orders', JSON.stringify(orders));
  }, [orders]);

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TB-${timestamp}-${random}`;
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'orderDate' | 'status'>): Promise<Order> => {
    try {
      const newOrder: Order = {
        ...orderData,
        id: `order-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      // Save to Supabase
      const orderInsert = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        userId: currentUser?.id || null,
        items: newOrder.items as any,
        subtotal: newOrder.subtotal,
        shipping: newOrder.shipping,
        tax: newOrder.tax,
        total: newOrder.total,
        status: newOrder.status,
        orderDate: newOrder.orderDate,
        estimatedDelivery: newOrder.estimatedDelivery,
        shippingAddress: newOrder.shippingAddress as any,
        billingAddress: newOrder.billingAddress as any,
        paymentMethod: newOrder.paymentMethod as any,
        trackingNumber: newOrder.trackingNumber || null
      };

      const { error: insertError } = await supabase
        .from('orders')
        .insert([orderInsert] as any);

      if (insertError) {
        console.error('Error saving order to Supabase:', insertError);
        // Continue anyway - order is still created locally
      }

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const getRecentOrders = (limit: number = 10) => {
    return orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, limit);
  };

  return (
    <OrderContext.Provider value={{
      orders,
      addOrder,
      updateOrderStatus,
      getOrderById,
      getRecentOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

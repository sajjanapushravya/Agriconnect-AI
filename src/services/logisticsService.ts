import { Order, OptimizedRouteApiResponse } from '../types';

export interface RouteOptimizationPayload {
  start_location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  vehicle_capacity?: number;
  orders?: Array<{
    order_id: string | number;
    latitude: number;
    longitude: number;
    quantity: number;
    buyer_name?: string;
    buyer_type?: string;
    address?: string;
    priority?: number;
  }>;
}

export const logisticsService = {
  /**
   * Optimize delivery route via Google OR-Tools / VRP service
   */
  async optimizeRoute(payload: RouteOptimizationPayload): Promise<OptimizedRouteApiResponse> {
    const response = await fetch('/api/logistics/optimize-route', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to optimize delivery route');
    }

    return data;
  },

  /**
   * Fetch active confirmed orders awaiting dispatch/delivery
   */
  async getActiveDeliveries(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const allOrders: Order[] = await res.json();
      
      // Filter orders ready for delivery (confirmed, processing, ready, out for delivery)
      return allOrders.filter(
        (o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'
      );
    } catch (err) {
      console.error('Error fetching active deliveries:', err);
      return [];
    }
  },

  /**
   * Transition order status (e.g. to DELIVERED)
   */
  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<Order> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, note })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update order status');
    }

    return res.json();
  },

  /**
   * Mark an order as delivered
   */
  async markDelivered(orderId: string): Promise<Order> {
    return this.updateOrderStatus(
      orderId,
      'DELIVERED',
      'Delivered successfully to customer location via AgriConnect Route Plan'
    );
  }
};

export type UserRole = 'farmer' | 'fpo' | 'buyer' | 'admin';

export type BuyerType = 'consumer' | 'restaurant' | 'supermarket' | 'hotel' | 'retailer' | 'bulk_buyer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  buyerType?: BuyerType;
  farmName?: string;
  isPartOfFpo?: boolean;
  fpoName?: string;
  associatedFarmersCount?: number;
  passwordHash?: string;
  createdAt: string;
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Pulses'
  | 'Spices'
  | 'Oilseeds'
  | 'Plantation Crops'
  | 'Other';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerType: 'farmer' | 'fpo';
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // AgriConnect price per unit (INR)
  marketPrice?: number; // Wholesale mandi price per unit (INR) - optional if unavailable
  marketPriceAvailable?: boolean; // Explicit flag whether mandi price is available
  quantity: number; // Available quantity
  unit: string; // 'kg', 'quintal', 'tonne', 'litre', 'piece', 'dozen', 'other'
  imageUrl: string;
  location: string;
  rating: number;
  harvestDate: string;
  shelfLifeDays: number;
  isOrganic?: boolean;
  minOrderQuantity?: number;
  isCustomProduct?: boolean;
  is_custom_product?: boolean; // Stored in database as requested
  status?: 'AVAILABLE' | 'SOLD_OUT' | 'PENDING_APPROVAL';
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DISPATCH'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  price: number;
  marketPrice: number;
  savings: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: BuyerType;
  sellerId?: string;
  sellerName?: string;
  items: OrderItem[];
  totalAmount: number;
  marketAmount: number;
  totalSavings: number;
  deliveryAddress: string;
  deliveryLocation: {
    lat: number;
    lng: number;
    city: string;
  };
  preferredDeliveryDate: string;
  status: OrderStatus;
  statusUpdates: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
}

export interface DemandForecast {
  productId: string;
  productName: string;
  category: string;
  currentStock: number;
  unit: string;
  historicalSalesAverage: number;
  predictedDemandNext7Days: number;
  predictedDemandNext30Days: number;
  recommendedProcurement: number;
  demandTrend: 'Increasing' | 'Stable' | 'Decreasing' | 'High Spike';
  confidenceScore: number;
  forecastDaily: {
    day: string;
    date: string;
    actual?: number;
    predicted: number;
  }[];
  modelMetrics: {
    mae: number;
    rmse: number;
    r2: number;
    modelName: string;
  };
}

export interface PricePoint {
  date: string;
  marketPrice: number;
  agriPrice: number;
  volumeSold?: number;
}

export interface ProductPriceIntelligence {
  productId: string;
  productName: string;
  category: string;
  currentMarketPrice: number;
  currentAgriPrice: number;
  savingsPerUnit: number;
  savingsPercentage: number;
  historicalPrices: PricePoint[];
  forecastedPrices: PricePoint[];
  wholesaleMandi: string;
  lastUpdated: string;
}

export interface DeliveryStop {
  id: string;
  orderId: string;
  buyerName: string;
  buyerType: BuyerType;
  address: string;
  lat: number;
  lng: number;
  quantityKg: number;
  status: OrderStatus;
  sequenceOrder: number;
  estimatedArrival?: string;
}

export interface RouteOptimizationResult {
  id: string;
  depotName: string;
  depotLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  stops: DeliveryStop[];
  totalDistanceBeforeKm: number;
  totalDistanceOptimizedKm: number;
  distanceSavedKm: number;
  distanceSavedPercentage: number;
  estimatedTravelTimeMinutes: number;
  estimatedFuelSavedLiters: number;
  estimatedFuelSavedCostInr: number;
  co2SavedKg: number;
  vehicleCapacityKg: number;
  totalPayloadKg: number;
  status: 'OPTIMIZED' | 'EN_ROUTE' | 'COMPLETED';
}

export interface SustainabilityMetrics {
  directTransactionsCount: number;
  totalFarmerEarnings: number;
  totalBuyerSavings: number;
  estimatedFoodWasteAvoidedKg: number;
  deliveryDistanceOptimizedKm: number;
  estimatedTransportReductionPercentage: number;
  co2EmissionsAvoidedKg: number;
  localProduceSoldTons: number;
  activeFPOsCount: number;
  registeredFarmersCount: number;
}

export interface OptimizedRouteStop {
  sequence: number;
  order_id: string | number;
  latitude: number;
  longitude: number;
  buyer_name?: string;
  buyer_type?: string;
  address?: string;
  quantity: number;
  distance_from_prev_km?: number;
  estimated_arrival_time?: string;
}

export interface OptimizedRouteApiResponse {
  route: OptimizedRouteStop[];
  total_distance_km: number;
  estimated_time_minutes: number;
  total_quantity: number;
  number_of_stops: number;
  start_location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  vehicle_capacity?: number;
  status?: string;
  distance_model?: string;
  explanation?: string;
  algorithm_used?: string;
}


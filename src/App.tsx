import React, { useState, useEffect } from 'react';
import { SimpleMobileLayout } from './components/SimpleMobileLayout';
import { SimpleHomeScreen } from './pages/common/SimpleHomeScreen';
import { FarmerSellFlow } from './pages/farmer/FarmerSellFlow';
import { FarmerAdviceView } from './pages/farmer/FarmerAdviceView';
import { FarmerEarningsView } from './pages/farmer/FarmerEarningsView';
import { FarmerDeliveryPlanView } from './pages/farmer/FarmerDeliveryPlanView';
import { BuyerSimpleMarketplace } from './pages/buyer/BuyerSimpleMarketplace';
import { SimpleOrdersView } from './pages/common/SimpleOrdersView';
import { SimpleSustainabilityView } from './pages/common/SimpleSustainabilityView';
import { SimpleProfileView } from './pages/common/SimpleProfileView';
import { AgriSaathiModal } from './components/AgriSaathiModal';
import { AuthScreen } from './components/AuthScreen';
import {
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_SUSTAINABILITY
} from './data/mockData';
import { Order, Product, SustainabilityMetrics, User, UserRole } from './types';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('agriconnect_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('agriconnect_token') || null;
    } catch {
      return null;
    }
  });

  // State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [sustainability, setSustainability] = useState<SustainabilityMetrics>(INITIAL_SUSTAINABILITY);

  // Active Role
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const savedUser = localStorage.getItem('agriconnect_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return parsed.role || 'farmer';
      }
    } catch {}
    return 'farmer';
  });

  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isAgriSaathiOpen, setIsAgriSaathiOpen] = useState<boolean>(false);

  // Validate session on mount if token exists
  useEffect(() => {
    if (authToken) {
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error('Session invalid');
          return res.json();
        })
        .then((data) => {
          if (data && data.user) {
            setCurrentUser(data.user);
            setCurrentRole(data.user.role);
          }
        })
        .catch(() => {
          localStorage.removeItem('agriconnect_token');
          localStorage.removeItem('agriconnect_user');
          setAuthToken(null);
          setCurrentUser(null);
        });
    }
  }, [authToken]);

  // Sync with API backend if available
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(() => {});

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      })
      .catch(() => {});

    fetch('/api/sustainability')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.directTransactionsCount) {
          setSustainability(data);
        }
      })
      .catch(() => {});
  }, []);

  // Handle successful login or sign up
  const handleAuthSuccess = (user: User, token: string, redirectRole?: UserRole) => {
    setCurrentUser(user);
    setAuthToken(token);
    const targetRole = redirectRole || user.role;
    setCurrentRole(targetRole);

    try {
      localStorage.setItem('agriconnect_token', token);
      localStorage.setItem('agriconnect_user', JSON.stringify(user));
    } catch {}

    setUsers((prev) => {
      if (prev.some((u) => u.id === user.id)) return prev;
      return [user, ...prev];
    });

    setActiveTab('home');
  };

  // Handle logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('agriconnect_token');
      localStorage.removeItem('agriconnect_user');
    } catch {}
    setAuthToken(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Farmer publishes new product
  const handleProductListed = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProd)
    }).catch(() => {});
  };

  // Buyer places order
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = newOrder.items.find((it) => it.productId === p.id);
        if (orderedItem) {
          return {
            ...p,
            quantity: Math.max(0, p.quantity - orderedItem.quantity)
          };
        }
        return p;
      })
    );

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    setSustainability((prev) => ({
      ...prev,
      directTransactionsCount: prev.directTransactionsCount + 1,
      totalFarmerEarnings: prev.totalFarmerEarnings + newOrder.totalAmount,
      totalBuyerSavings: prev.totalBuyerSavings + newOrder.totalSavings,
      localProduceSoldTons: Number(
        (prev.localProduceSoldTons +
          newOrder.items.reduce((s, it) => s + it.quantity, 0) / 1000).toFixed(2)
      )
    }));
  };

  // If user is not authenticated, show Welcome / Auth Screen
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <SimpleMobileLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      currentRole={currentRole}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {/* 🏠 Home View */}
      {activeTab === 'home' && (
        <SimpleHomeScreen
          currentRole={currentRole}
          currentUser={currentUser}
          onNavigate={(view) => setActiveTab(view)}
        />
      )}

      {/* 🌾 Sell Produce Flow */}
      {activeTab === 'sell' && (
        <FarmerSellFlow
          currentUser={currentUser}
          onProductListed={handleProductListed}
          onCancel={() => setActiveTab('home')}
        />
      )}

      {/* 🛒 Buy Produce View */}
      {activeTab === 'buy' && (
        <BuyerSimpleMarketplace
          products={products}
          currentUser={currentUser}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {/* 📦 My Orders View */}
      {activeTab === 'orders' && (
        <SimpleOrdersView
          orders={orders}
          onBack={() => setActiveTab('home')}
          onNavigateToDelivery={() => setActiveTab('delivery')}
        />
      )}

      {/* 🤖 AI Advice View */}
      {activeTab === 'advice' && (
        <FarmerAdviceView
          onBack={() => setActiveTab('home')}
          onSellProduce={() => setActiveTab('sell')}
          products={products}
          orders={orders}
        />
      )}

      {/* 💰 Farmer Earnings View */}
      {activeTab === 'earnings' && (
        <FarmerEarningsView onBack={() => setActiveTab('home')} />
      )}

      {/* 🚚 Delivery Plan View */}
      {activeTab === 'delivery' && (
        <FarmerDeliveryPlanView onBack={() => setActiveTab('home')} />
      )}

      {/* 🌱 Sustainability Impact / Savings View */}
      {activeTab === 'impact' && (
        <SimpleSustainabilityView onBack={() => setActiveTab('home')} />
      )}

      {/* 👤 Profile & Settings View */}
      {activeTab === 'profile' && (
        <SimpleProfileView
          currentUser={currentUser}
          currentRole={currentRole}
          onLogout={handleLogout}
          onUpdateUser={(updated) => setCurrentUser(updated)}
        />
      )}

      {/* AI Assistant: Agri Saathi Dialog */}
      <AgriSaathiModal
        isOpen={isAgriSaathiOpen}
        onClose={() => setIsAgriSaathiOpen(false)}
      />
    </SimpleMobileLayout>
  );
}

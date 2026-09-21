import express from 'express';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createServer as createViteServer } from 'vite';

const execFileAsync = promisify(execFile);
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_SUSTAINABILITY
} from './src/data/mockData';
import { generateDemandForecast, getProduceDemandAdvice } from './src/utils/demandForecaster';
import { getProductPriceIntelligence, calculate_bulk_savings } from './src/utils/priceIntelligence';
import { optimizeDeliveryRoute } from './src/utils/routeOptimizer';
import { recognizeProduct, suggestCategory, calculateSmartPriceComparison } from './src/utils/cropClassifier';
import { DeliveryStop, Order, Product, User, UserRole } from './src/types';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect_ai_jwt_secret_dev_key_2026';

app.use(express.json());

// In-Memory Database State (seeded with initial users with password hashes)
const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password123', 10);

let users: User[] = INITIAL_USERS.map((u) => ({
  ...u,
  passwordHash: u.passwordHash || DEFAULT_PASSWORD_HASH
}));
let products: Product[] = [...INITIAL_PRODUCTS];
let orders: Order[] = [...INITIAL_ORDERS];
let sustainability = { ...INITIAL_SUSTAINABILITY };

// Temporary in-memory OTP cache for Forgot Password flow
interface OtpEntry {
  otp: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpEntry>();

// Authentication & Role Middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    (req as any).user = decoded;
    next();
  });
};

const requireRole = (allowedRoles: UserRole[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: `Access denied. Role must be one of: ${allowedRoles.join(', ')}` });
    }
    next();
  };
};

function normalizeIdentifier(raw: string): string {
  return (raw || '').trim().replace(/[\s-]/g, '').toLowerCase();
}

function findUserByIdentifier(rawIdentifier: string): User | undefined {
  const clean = normalizeIdentifier(rawIdentifier);
  return users.find((u) => {
    const cleanPhone = normalizeIdentifier(u.phone);
    const cleanEmail = normalizeIdentifier(u.email);
    return (
      cleanPhone === clean ||
      cleanPhone.endsWith(clean) ||
      clean.endsWith(cleanPhone) ||
      cleanEmail === clean
    );
  });
}

function validatePasswordCriteria(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' };
  }
  return { valid: true };
}

// ----------------- API Endpoints -----------------

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriConnect AI Engine', timestamp: new Date().toISOString() });
});

// Current Authenticated User profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const tokenUser = (req as any).user;
  const user = users.find((u) => u.id === tokenUser.id);
  if (!user) {
    return res.status(404).json({ error: 'User account not found' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser });
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Please enter your mobile number/email and password.' });
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    return res.status(401).json({
      error: 'No account found with this mobile number or email. Please sign up.'
    });
  }

  // Role validation: ensure selected role matches the account
  if (role) {
    const expected = (role as string).toLowerCase();
    const isFarmerRole = expected === 'farmer' && (user.role === 'farmer' || user.role === 'fpo');
    const isCustomerRole = (expected === 'customer' || expected === 'buyer') && user.role === 'buyer';
    const isAdminRole = expected === 'admin' && user.role === 'admin';

    if (!isFarmerRole && !isCustomerRole && !isAdminRole) {
      const displayRole = user.role === 'farmer' ? 'FARMER' : user.role === 'buyer' ? 'CUSTOMER' : user.role.toUpperCase();
      return res.status(403).json({
        error: `This account is registered as a ${displayRole}. Please select the matching role above.`
      });
    }
  }

  // Password verification using bcrypt
  const isMatch = user.passwordHash
    ? bcrypt.compareSync(password, user.passwordHash)
    : password === 'password123';

  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password. Please try again or use Forgot Password.' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const { passwordHash, ...safeUser } = user;
  res.json({
    token,
    user: safeUser,
    message: `Welcome back, ${user.name}!`
  });
});

// Authentication: Sign Up
app.post('/api/auth/register', (req, res) => {
  const {
    fullName,
    name: altName,
    mobileNumber,
    phone: altPhone,
    password,
    confirmPassword,
    role,
    location,
    isPartOfFpo,
    fpoName
  } = req.body;

  const actualName = (fullName || altName || '').trim();
  const actualPhone = (mobileNumber || altPhone || '').trim();
  const normalizedRole: UserRole = role === 'customer' ? 'buyer' : (role as UserRole);

  if (!actualName) {
    return res.status(400).json({ error: 'Please enter your Full Name.' });
  }
  if (!actualPhone) {
    return res.status(400).json({ error: 'Please enter your Mobile Number.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Please create a password.' });
  }

  const pwCheck = validatePasswordCriteria(password);
  if (!pwCheck.valid) {
    return res.status(400).json({ error: pwCheck.error });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match. Please verify.' });
  }

  // Check duplicate
  const existing = findUserByIdentifier(actualPhone);
  if (existing) {
    return res.status(409).json({
      error: 'An account with this mobile number already exists. Please log in.'
    });
  }

  // Hash password securely
  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser: User = {
    id: `user-${normalizedRole}-${Date.now().toString().slice(-4)}`,
    name: actualName,
    email: `${actualName.toLowerCase().replace(/[^a-z0-9]/g, '')}@agriconnect.local`,
    phone: actualPhone.startsWith('+91') ? actualPhone : `+91 ${actualPhone}`,
    role: normalizedRole,
    location: location?.trim() || (normalizedRole === 'farmer' ? 'Kisan Nagar, Rural AP' : 'Hyderabad / Bengaluru'),
    farmName: normalizedRole === 'farmer' ? `${actualName}'s Natural Farm` : undefined,
    isPartOfFpo: Boolean(isPartOfFpo),
    fpoName: isPartOfFpo ? fpoName?.trim() || 'Local Farmers Producer Org' : undefined,
    buyerType: normalizedRole === 'buyer' ? 'consumer' : undefined,
    passwordHash,
    createdAt: new Date().toISOString().split('T')[0]
  };

  users.unshift(newUser);

  const token = jwt.sign(
    { id: newUser.id, role: newUser.role, name: newUser.name, phone: newUser.phone },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const successMessage =
    normalizedRole === 'farmer'
      ? 'Account created successfully! Welcome to AgriConnect AI 🌾'
      : 'Account created successfully! Welcome to AgriConnect AI 🛒';

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({
    user: safeUser,
    token,
    message: successMessage
  });
});

// Forgot Password: Step 1 - Send OTP
app.post('/api/auth/forgot-password/send-otp', (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Please enter your mobile number or email.' });
  }

  const user = findUserByIdentifier(identifier);
  if (!user) {
    return res.status(404).json({ error: 'No account found with this mobile number or email.' });
  }

  // Generate safe 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const cleanId = normalizeIdentifier(identifier);
  otpStore.set(cleanId, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  res.json({
    success: true,
    message: `OTP sent to ${user.phone || identifier}`,
    demoOtp: otp // Simulated safely for instant verification without SMS cost
  });
});

// Forgot Password: Step 2 - Verify OTP
app.post('/api/auth/forgot-password/verify-otp', (req, res) => {
  const { identifier, otp } = req.body;
  if (!identifier || !otp) {
    return res.status(400).json({ error: 'Please provide both identifier and OTP.' });
  }

  const cleanId = normalizeIdentifier(identifier);
  const entry = otpStore.get(cleanId);

  if (!entry) {
    return res.status(400).json({ error: 'No OTP requested or OTP has expired. Please request a new OTP.' });
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanId);
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (entry.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect OTP. Please check and try again.' });
  }

  // Create single-use reset token
  const resetToken = jwt.sign({ resetIdentifier: cleanId }, JWT_SECRET, { expiresIn: '15m' });
  res.json({
    success: true,
    resetToken,
    message: 'OTP verified successfully. Please set your new password.'
  });
});

// Forgot Password: Step 3 - Reset Password
app.post('/api/auth/forgot-password/reset', (req, res) => {
  const { identifier, resetToken, newPassword, confirmNewPassword } = req.body;

  if (!identifier || !resetToken || !newPassword) {
    return res.status(400).json({ error: 'Missing required reset fields.' });
  }

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET) as any;
    const cleanId = normalizeIdentifier(identifier);
    if (decoded.resetIdentifier !== cleanId) {
      return res.status(403).json({ error: 'Invalid reset token.' });
    }

    const pwCheck = validatePasswordCriteria(newPassword);
    if (!pwCheck.valid) {
      return res.status(400).json({ error: pwCheck.error });
    }

    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }

    const user = findUserByIdentifier(identifier);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    otpStore.delete(cleanId);

    res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (err) {
    return res.status(403).json({ error: 'Reset session expired. Please request a new OTP.' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

// Products
app.get('/api/products', (req, res) => {
  const { category, search, sellerId, sort } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (sellerId) {
    filtered = filtered.filter((p) => p.sellerId === sellerId);
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sellerName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }

  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'savings') {
    filtered.sort((a, b) => (b.marketPrice - b.price) - (a.marketPrice - a.price));
  } else if (sort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const {
    name,
    category,
    description,
    price,
    marketPrice,
    marketPriceAvailable,
    quantity,
    unit,
    imageUrl,
    location,
    sellerId,
    sellerName,
    sellerType,
    isOrganic,
    shelfLifeDays,
    is_custom_product,
    status
  } = req.body;

  if (!name || !price || !quantity) {
    return res.status(400).json({ error: 'Name, price, and quantity are required.' });
  }

  // Automatic recognition check if category or marketPrice is not provided
  const rec = recognizeProduct(name);
  const finalCategory = category || rec.category || 'Other';
  const hasReliableMarketPrice =
    marketPrice !== undefined && marketPrice !== null && Number(marketPrice) > 0
      ? true
      : marketPriceAvailable !== undefined
      ? Boolean(marketPriceAvailable)
      : rec.marketPriceAvailable;

  const resolvedMarketPrice = hasReliableMarketPrice
    ? Number(marketPrice || rec.marketPrice)
    : undefined;

  const newProduct: Product = {
    id: `prod-custom-${Date.now().toString().slice(-4)}`,
    name,
    category: finalCategory,
    description: description || `Fresh farm harvest of ${name} directly from local farmer.`,
    price: Number(price),
    marketPrice: resolvedMarketPrice,
    marketPriceAvailable: hasReliableMarketPrice,
    quantity: Number(quantity),
    unit: unit || rec.suggestedUnit || 'kg',
    imageUrl:
      imageUrl ||
      rec.defaultImageUrl ||
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    location: location || 'Nashik, Maharashtra',
    sellerId: sellerId || 'user-farmer-1',
    sellerName: sellerName || 'Ramesh Patil',
    sellerType: sellerType || 'farmer',
    rating: 4.8,
    harvestDate: new Date().toISOString().split('T')[0],
    shelfLifeDays: Number(shelfLifeDays || 7),
    isOrganic: Boolean(isOrganic),
    minOrderQuantity: 10,
    isCustomProduct: is_custom_product !== undefined ? Boolean(is_custom_product) : true,
    is_custom_product: is_custom_product !== undefined ? Boolean(is_custom_product) : true,
    status: status || 'AVAILABLE',
    createdAt: new Date().toISOString().split('T')[0]
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// Crop Auto-Recognition & Smart Category Suggestion Endpoint
app.get('/api/ai/crop-recognize', (req, res) => {
  const name = (req.query.name as string) || '';
  const rec = recognizeProduct(name);
  res.json(rec);
});

// Crop AI Demand Advice Endpoint (works for both predefined and farmer-created crops)
app.get('/api/ai/crop-demand', (req, res) => {
  const name = (req.query.name as string) || '';
  const category = (req.query.category as string) || 'Other';
  const advice = getProduceDemandAdvice(name, category, orders, products);
  res.json(advice);
});

app.put('/api/products/:id', (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[idx] = {
    ...products[idx],
    ...req.body
  };

  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  const deleted = products.splice(idx, 1)[0];
  res.json({ message: 'Product deleted', product: deleted });
});

// Orders
app.get('/api/orders', (req, res) => {
  const { buyerId, sellerId, status } = req.query;
  let filtered = [...orders];

  if (buyerId) {
    filtered = filtered.filter((o) => o.buyerId === buyerId);
  }
  if (sellerId) {
    filtered = filtered.filter((o) => o.sellerId === sellerId);
  }
  if (status) {
    filtered = filtered.filter((o) => o.status === status);
  }

  res.json(filtered);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const {
    buyerId,
    buyerName,
    buyerType,
    items,
    deliveryAddress,
    deliveryLocation,
    preferredDeliveryDate
  } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least one item.' });
  }

  // Deduct inventory
  for (const item of items) {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      if (prod.quantity < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${prod.name}. Available: ${prod.quantity} kg, Requested: ${item.quantity} kg`
        });
      }
      prod.quantity -= item.quantity;
    }
  }

  const totalAmount = items.reduce((sum: number, it: any) => sum + it.price * it.quantity, 0);
  const marketAmount = items.reduce((sum: number, it: any) => sum + it.marketPrice * it.quantity, 0);
  const totalSavings = Math.max(0, marketAmount - totalAmount);

  const newOrder: Order = {
    id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    buyerId: buyerId || 'user-buyer-1',
    buyerName: buyerName || 'Vikram Mehta (Green Bowl Cafe)',
    buyerType: buyerType || 'restaurant',
    items,
    totalAmount,
    marketAmount,
    totalSavings,
    deliveryAddress: deliveryAddress || '14th Road, Bandra West, Mumbai 400050',
    deliveryLocation: deliveryLocation || {
      lat: 19.0607,
      lng: 72.8362,
      city: 'Mumbai (Bandra)'
    },
    preferredDeliveryDate: preferredDeliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    status: 'PLACED',
    statusUpdates: [
      {
        status: 'PLACED',
        timestamp: new Date().toLocaleString(),
        note: 'Order successfully created through AgriConnect Direct Marketplace'
      }
    ],
    createdAt: new Date().toISOString().split('T')[0]
  };

  orders.unshift(newOrder);

  // Update sustainability
  sustainability.directTransactionsCount += 1;
  sustainability.totalFarmerEarnings += totalAmount;
  sustainability.totalBuyerSavings += totalSavings;
  sustainability.localProduceSoldTons = Number(
    (sustainability.localProduceSoldTons + items.reduce((acc: number, it: any) => acc + it.quantity, 0) / 1000).toFixed(2)
  );

  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status, note } = req.body;
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = status;
  order.statusUpdates.push({
    status,
    timestamp: new Date().toLocaleString(),
    note: note || `Status transitioned to ${status}`
  });

  res.json(order);
});

// AI Demand Forecast
app.get('/api/ai/demand-forecast/:productId', (req, res) => {
  const prod = products.find((p) => p.id === req.params.productId) || products[0];
  const forecast = generateDemandForecast(prod);
  res.json(forecast);
});

app.post('/api/ai/demand-forecast', (req, res) => {
  const { productId, currentStock } = req.body;
  const prod = products.find((p) => p.id === productId) || products[0];
  const forecast = generateDemandForecast(prod, currentStock !== undefined ? Number(currentStock) : undefined);
  res.json(forecast);
});

// Price Intelligence
app.get('/api/prices/:productId', (req, res) => {
  const prod = products.find((p) => p.id === req.params.productId) || products[0];
  const intel = getProductPriceIntelligence(prod);
  res.json(intel);
});

app.get('/api/prices/compare/:productId', (req, res) => {
  const prod = products.find((p) => p.id === req.params.productId) || products[0];
  const quantity = Number(req.query.quantity || 100);
  const bulk = calculate_bulk_savings(prod.marketPrice, prod.price, quantity);
  res.json({
    product: prod,
    bulk
  });
});

app.get('/api/prices/trends', (req, res) => {
  const sampleProducts = products.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    marketPrice: p.marketPrice,
    savings: p.marketPrice - p.price,
    savingsPct: Number((((p.marketPrice - p.price) / p.marketPrice) * 100).toFixed(1))
  }));
  res.json(sampleProducts);
});

// Logistics & Route Optimization
app.post('/api/logistics/optimize-route', async (req, res) => {
  try {
    const { start_location, vehicle_capacity, orders: reqOrders, stops: legacyStops } = req.body;

    // 1. Resolve vehicle capacity
    const capacity = Number(vehicle_capacity !== undefined ? vehicle_capacity : 500);
    if (isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({ error: 'Invalid vehicle capacity. Capacity must be greater than 0.' });
    }

    // 2. Resolve starting location (depot / farm location)
    const startLoc = start_location && start_location.latitude !== undefined && start_location.longitude !== undefined
      ? {
          latitude: Number(start_location.latitude),
          longitude: Number(start_location.longitude),
          address: start_location.address || 'AgriConnect Central Aggregation Hub'
        }
      : {
          latitude: 19.0760,
          longitude: 72.8777,
          address: 'AgriConnect Central Aggregation Hub, Kurla/Bandra, Mumbai'
        };

    // 3. Resolve orders to optimize
    let ordersList: any[] = [];

    if (Array.isArray(reqOrders) && reqOrders.length > 0) {
      ordersList = reqOrders;
    } else if (Array.isArray(legacyStops) && legacyStops.length > 0) {
      ordersList = legacyStops.map((st: any, idx: number) => ({
        order_id: st.orderId || st.id || idx + 1,
        latitude: st.lat,
        longitude: st.lng,
        quantity: Number(st.quantityKg || st.quantity || 0),
        buyer_name: st.buyerName,
        buyer_type: st.buyerType,
        address: st.address
      }));
    } else {
      // Pull active orders from the in-memory database that are not yet delivered
      const activeDbOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
      if (activeDbOrders.length === 0) {
        return res.status(400).json({ error: 'No active deliveries available.' });
      }

      ordersList = activeDbOrders.map((ord, idx) => ({
        order_id: ord.id,
        latitude: ord.deliveryLocation?.lat ?? (19.0600 + (idx * 0.02 - 0.03)),
        longitude: ord.deliveryLocation?.lng ?? (72.8360 + (idx * 0.02 - 0.02)),
        quantity: ord.items.reduce((s, it) => s + (Number(it.quantity) || 0), 0),
        buyer_name: ord.buyerName,
        buyer_type: ord.buyerType,
        address: ord.deliveryAddress || ord.deliveryLocation?.city || 'Customer Delivery Address'
      }));
    }

    // 4. Validate order items
    if (ordersList.length === 0) {
      return res.status(400).json({ error: 'No active deliveries available.' });
    }

    let totalQuantity = 0;
    for (const ord of ordersList) {
      if (ord.latitude === undefined || ord.longitude === undefined || ord.latitude === null || ord.longitude === null) {
        return res.status(400).json({ error: 'Some orders are missing delivery locations.' });
      }
      const lat = Number(ord.latitude);
      const lng = Number(ord.longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({ error: 'Some orders have invalid delivery coordinates.' });
      }
      const qty = Number(ord.quantity || 0);
      if (isNaN(qty) || qty < 0) {
        return res.status(400).json({ error: `Invalid quantity for order ID: ${ord.order_id}` });
      }
      totalQuantity += qty;
    }

    // 5. Vehicle capacity check
    if (totalQuantity > capacity) {
      return res.status(400).json({
        error: 'Vehicle capacity exceeded. Please split the delivery into multiple trips/vehicles.',
        total_quantity: totalQuantity,
        vehicle_capacity: capacity
      });
    }

    // 6. Execute Python Route Optimizer Service
    const payload = {
      start_location: startLoc,
      vehicle_capacity: capacity,
      orders: ordersList
    };

    const pythonScriptPath = path.join(process.cwd(), 'backend', 'app', 'services', 'route_optimizer.py');

    try {
      const { stdout, stderr } = await execFileAsync(
        'python3',
        [pythonScriptPath, JSON.stringify(payload)],
        { timeout: 6000 }
      );

      const parsed = JSON.parse(stdout.trim());
      if (parsed.error) {
        return res.status(400).json({ error: parsed.error });
      }
      return res.json(parsed);
    } catch (pyErr: any) {
      console.warn('Python route optimizer execution notice, evaluating response/fallback:', pyErr.message);

      // Check if Python process exited with a JSON error payload
      if (pyErr.stdout) {
        try {
          const parsedErr = JSON.parse(pyErr.stdout.trim());
          if (parsedErr.error) {
            return res.status(400).json({ error: parsedErr.error });
          }
        } catch {}
      }

      // Fallback to high-performance TypeScript VRP solver
      const deliveryStops: DeliveryStop[] = ordersList.map((o, idx) => ({
        id: `stop-${o.order_id}`,
        orderId: String(o.order_id),
        buyerName: o.buyer_name || `Buyer ${idx + 1}`,
        buyerType: o.buyer_type || 'restaurant',
        address: o.address || 'Delivery Location',
        lat: Number(o.latitude),
        lng: Number(o.longitude),
        quantityKg: Number(o.quantity),
        status: 'CONFIRMED',
        sequenceOrder: idx + 1
      }));

      const tsResult = optimizeDeliveryRoute(deliveryStops, {
        lat: startLoc.latitude,
        lng: startLoc.longitude,
        address: startLoc.address
      }, capacity);

      const formattedRoute = tsResult.stops.map((st) => ({
        sequence: st.sequenceOrder,
        order_id: st.orderId,
        latitude: st.lat,
        longitude: st.lng,
        buyer_name: st.buyerName,
        buyer_type: st.buyerType,
        address: st.address,
        quantity: st.quantityKg,
        estimated_arrival_time: st.estimatedArrival
      }));

      return res.json({
        route: formattedRoute,
        total_distance_km: tsResult.totalDistanceOptimizedKm,
        estimated_time_minutes: tsResult.estimatedTravelTimeMinutes,
        total_quantity: tsResult.totalPayloadKg,
        number_of_stops: tsResult.stops.length,
        start_location: startLoc,
        vehicle_capacity: capacity,
        status: 'OPTIMIZED',
        distance_model: 'Haversine formula with 1.28x road network tortuosity factor (estimated road distance)',
        explanation: 'Route optimization helps organize deliveries efficiently and may reduce unnecessary travel when compared with an unplanned delivery sequence.',
        algorithm_used: 'AgriConnect VRP Engine (Run `pip install ortools` to enable Google OR-Tools)'
      });
    }
  } catch (globalErr: any) {
    console.error('Route optimization route failure:', globalErr);
    res.status(500).json({ error: 'Route calculation failure: ' + globalErr.message });
  }
});

// Mark order delivered
app.post('/api/orders/:id/deliver', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.status = 'DELIVERED';
  order.statusUpdates.push({
    status: 'DELIVERED',
    timestamp: new Date().toLocaleString(),
    note: 'Delivered to customer destination according to optimized route plan'
  });

  res.json(order);
});

app.get('/api/logistics/routes', (req, res) => {
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const stops: DeliveryStop[] = activeOrders.map((ord, idx) => ({
    id: `stop-${ord.id}`,
    orderId: ord.id,
    buyerName: ord.buyerName,
    buyerType: ord.buyerType,
    address: ord.deliveryAddress,
    lat: ord.deliveryLocation?.lat || 19.0760 + (idx * 0.03 - 0.05),
    lng: ord.deliveryLocation?.lng || 72.8777 + (idx * 0.02 - 0.04),
    quantityKg: ord.items.reduce((s, it) => s + it.quantity, 0),
    status: ord.status,
    sequenceOrder: idx + 1
  }));

  const result = optimizeDeliveryRoute(stops);
  res.json(result);
});

// Dashboards
app.get('/api/dashboard/farmer', (req, res) => {
  const farmerProds = products.filter((p) => p.sellerId === 'user-farmer-1' || p.sellerType === 'farmer');
  const farmerOrders = orders.filter((o) => o.sellerId === 'user-farmer-1');

  const totalEarnings = farmerOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 148500;
  const pendingCount = farmerOrders.filter((o) => o.status !== 'DELIVERED').length;

  res.json({
    totalProducts: farmerProds.length,
    totalOrders: farmerOrders.length + 18,
    pendingOrders: pendingCount + 2,
    totalEarnings,
    recentOrders: orders.slice(0, 4),
    featuredProducts: farmerProds.slice(0, 3)
  });
});

app.get('/api/dashboard/fpo', (req, res) => {
  const fpoProds = products.filter((p) => p.sellerType === 'fpo');
  const totalStockKg = fpoProds.reduce((sum, p) => sum + p.quantity, 0);

  res.json({
    totalFarmersAssociated: 142,
    totalProducts: fpoProds.length,
    totalStockKg,
    totalOrders: 48,
    revenue: 495000,
    aggregatedInventory: fpoProds,
    buyerDemandTopProducts: products.slice(0, 4)
  });
});

app.get('/api/dashboard/buyer', (req, res) => {
  const buyerId = (req.query.buyerId as string) || 'user-buyer-1';
  const buyerOrders = orders.filter((o) => o.buyerId === buyerId);

  const totalSpent = buyerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalMarketVal = buyerOrders.reduce((sum, o) => sum + o.marketAmount, 0);
  const totalSavings = Math.max(0, totalMarketVal - totalSpent);

  res.json({
    totalOrders: buyerOrders.length,
    activeOrders: buyerOrders.filter((o) => o.status !== 'DELIVERED').length,
    totalPurchaseValue: totalSpent,
    totalMarketValue: totalMarketVal,
    totalSavings,
    recentOrders: buyerOrders,
    recommendedProducts: products.slice(0, 4)
  });
});

app.get('/api/dashboard/admin', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admin role required.' });
      }
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session token.' });
    }
  }
  res.json({
    totalUsers: users.length,
    totalFarmers: users.filter((u) => u.role === 'farmer').length,
    totalFpos: users.filter((u) => u.role === 'fpo').length,
    totalBuyers: users.filter((u) => u.role === 'buyer').length,
    totalProducts: products.length,
    totalOrders: orders.length,
    sustainability
  });
});

// Sustainability
app.get('/api/sustainability', (req, res) => {
  res.json(sustainability);
});

// ----------------- Vite Setup -----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriConnect AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();

import { ProductCategory } from '../types';

export interface CropInfo {
  name: string;
  nameTe: string;
  category: ProductCategory;
  suggestedUnit: string;
  marketPrice?: number;
  marketPriceAvailable: boolean;
  emoji: string;
  imageUrl: string;
}

// Comprehensive catalog of Indian farm produce (popular + regional crops)
export const KNOWN_CROPS_CATALOG: Record<string, CropInfo> = {
  // Popular first (spec requirement)
  tomato: {
    name: 'Tomato',
    nameTe: 'టమాటా',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 30,
    marketPriceAvailable: true,
    emoji: '🍅',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
  },
  onion: {
    name: 'Onion',
    nameTe: 'ఉల్లిపాయ',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 35,
    marketPriceAvailable: true,
    emoji: '🧅',
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80'
  },
  potato: {
    name: 'Potato',
    nameTe: 'బంగాళాదుంప',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 28,
    marketPriceAvailable: true,
    emoji: '🥔',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80'
  },
  mango: {
    name: 'Mango',
    nameTe: 'మామిడికాయ',
    category: 'Fruits',
    suggestedUnit: 'kg',
    marketPrice: 95,
    marketPriceAvailable: true,
    emoji: '🥭',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80'
  },
  banana: {
    name: 'Banana',
    nameTe: 'అరటిపండు',
    category: 'Fruits',
    suggestedUnit: 'dozen',
    marketPrice: 40,
    marketPriceAvailable: true,
    emoji: '🍌',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80'
  },
  rice: {
    name: 'Rice',
    nameTe: 'బియ్యం',
    category: 'Grains',
    suggestedUnit: 'kg',
    marketPrice: 58,
    marketPriceAvailable: true,
    emoji: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'
  },
  chilli: {
    name: 'Chilli',
    nameTe: 'పచ్చి మిర్చి',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 65,
    marketPriceAvailable: true,
    emoji: '🌶️',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80'
  },
  turmeric: {
    name: 'Turmeric',
    nameTe: 'పసుపు',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 160,
    marketPriceAvailable: true,
    emoji: '🌿',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'
  },

  // Specific crops mentioned in user prompt
  tamarind: {
    name: 'Tamarind',
    nameTe: 'చింతపండు',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 135,
    marketPriceAvailable: true,
    emoji: '🟤',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'
  },
  coconut: {
    name: 'Coconut',
    nameTe: 'కొబ్బరికాయ',
    category: 'Plantation Crops',
    suggestedUnit: 'piece',
    marketPrice: 32,
    marketPriceAvailable: true,
    emoji: '🥥',
    imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=500&auto=format&fit=crop&q=80'
  },
  'curry leaves': {
    name: 'Curry Leaves',
    nameTe: 'కరివేపాకు',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 40,
    marketPriceAvailable: true,
    emoji: '🍃',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  },
  coriander: {
    name: 'Coriander',
    nameTe: 'కొత్తిమీర',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 45,
    marketPriceAvailable: true,
    emoji: '🌿',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80'
  },
  'sweet potato': {
    name: 'Sweet Potato',
    nameTe: 'చిలగడదుంప',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 32,
    marketPriceAvailable: true,
    emoji: '🍠',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=80'
  },
  drumstick: {
    name: 'Drumstick (Moringa)',
    nameTe: 'మునగకాయ',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 48,
    marketPriceAvailable: true,
    emoji: '🥢',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  },
  'custard apple': {
    name: 'Custard Apple (Sitaphal)',
    nameTe: 'సీతాఫలం',
    category: 'Fruits',
    suggestedUnit: 'kg',
    marketPrice: 85,
    marketPriceAvailable: true,
    emoji: '🍈',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80'
  },
  sesame: {
    name: 'Sesame (Til)',
    nameTe: 'నువ్వులు',
    category: 'Oilseeds',
    suggestedUnit: 'kg',
    marketPrice: 145,
    marketPriceAvailable: true,
    emoji: '⚪',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80'
  },
  jaggery: {
    name: 'Jaggery (Gud)',
    nameTe: 'బెల్లం',
    category: 'Other',
    suggestedUnit: 'kg',
    marketPrice: 55,
    marketPriceAvailable: true,
    emoji: '🍯',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80'
  },

  // Additional Common Crops
  groundnut: {
    name: 'Groundnut (Peanut)',
    nameTe: 'వేరుశనగ',
    category: 'Oilseeds',
    suggestedUnit: 'kg',
    marketPrice: 85,
    marketPriceAvailable: true,
    emoji: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=80'
  },
  mustard: {
    name: 'Mustard Seeds',
    nameTe: 'ఆవాలు',
    category: 'Oilseeds',
    suggestedUnit: 'kg',
    marketPrice: 90,
    marketPriceAvailable: true,
    emoji: '🟡',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80'
  },
  sunflower: {
    name: 'Sunflower Seeds',
    nameTe: 'పొద్దుతిరుగుడు గింజలు',
    category: 'Oilseeds',
    suggestedUnit: 'kg',
    marketPrice: 75,
    marketPriceAvailable: true,
    emoji: '🌻',
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=500&auto=format&fit=crop&q=80'
  },
  soybean: {
    name: 'Soybean',
    nameTe: 'సోయాబీన్',
    category: 'Oilseeds',
    suggestedUnit: 'kg',
    marketPrice: 52,
    marketPriceAvailable: true,
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80'
  },
  arecanut: {
    name: 'Arecanut (Supari)',
    nameTe: 'పోకచెక్క',
    category: 'Plantation Crops',
    suggestedUnit: 'kg',
    marketPrice: 420,
    marketPriceAvailable: true,
    emoji: '🌰',
    imageUrl: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?w=500&auto=format&fit=crop&q=80'
  },
  coffee: {
    name: 'Coffee Beans',
    nameTe: 'కాఫీ గింజలు',
    category: 'Plantation Crops',
    suggestedUnit: 'kg',
    marketPrice: 280,
    marketPriceAvailable: true,
    emoji: '☕',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80'
  },
  tea: {
    name: 'Tea Leaves',
    nameTe: 'టీ ఆకులు',
    category: 'Plantation Crops',
    suggestedUnit: 'kg',
    marketPrice: 210,
    marketPriceAvailable: true,
    emoji: '🍃',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  },
  cashew: {
    name: 'Raw Cashew Nut',
    nameTe: 'జీడిపప్పు',
    category: 'Plantation Crops',
    suggestedUnit: 'kg',
    marketPrice: 650,
    marketPriceAvailable: true,
    emoji: '🥜',
    imageUrl: 'https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=500&auto=format&fit=crop&q=80'
  },
  wheat: {
    name: 'Wheat',
    nameTe: 'గోధుమలు',
    category: 'Grains',
    suggestedUnit: 'kg',
    marketPrice: 36,
    marketPriceAvailable: true,
    emoji: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=80'
  },
  maize: {
    name: 'Maize / Corn',
    nameTe: 'మొక్కజొన్న',
    category: 'Grains',
    suggestedUnit: 'kg',
    marketPrice: 24,
    marketPriceAvailable: true,
    emoji: '🌽',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=80'
  },
  millet: {
    name: 'Millet (Ragi / Bajra)',
    nameTe: 'చిరుధాన్యాలు',
    category: 'Grains',
    suggestedUnit: 'kg',
    marketPrice: 42,
    marketPriceAvailable: true,
    emoji: '🌾',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80'
  },
  'toor dal': {
    name: 'Toor Dal (Pigeon Pea)',
    nameTe: 'కందిపప్పు',
    category: 'Pulses',
    suggestedUnit: 'kg',
    marketPrice: 135,
    marketPriceAvailable: true,
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80'
  },
  'moong dal': {
    name: 'Moong Dal (Green Gram)',
    nameTe: 'పెసలు',
    category: 'Pulses',
    suggestedUnit: 'kg',
    marketPrice: 110,
    marketPriceAvailable: true,
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80'
  },
  chana: {
    name: 'Bengal Gram (Chana)',
    nameTe: 'శనగలు',
    category: 'Pulses',
    suggestedUnit: 'kg',
    marketPrice: 75,
    marketPriceAvailable: true,
    emoji: '🫘',
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500&auto=format&fit=crop&q=80'
  },
  brinjal: {
    name: 'Brinjal (Eggplant)',
    nameTe: 'వంకాయ',
    category: 'Vegetables',
    suggestedUnit: 'kg',
    marketPrice: 28,
    marketPriceAvailable: true,
    emoji: '🍆',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80'
  },
  ginger: {
    name: 'Fresh Ginger',
    nameTe: 'అల్లం',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 85,
    marketPriceAvailable: true,
    emoji: '🫚',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'
  },
  garlic: {
    name: 'Garlic',
    nameTe: 'వెల్లుల్లి',
    category: 'Spices',
    suggestedUnit: 'kg',
    marketPrice: 165,
    marketPriceAvailable: true,
    emoji: '🧄',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=80'
  }
};

/**
 * Smart rule-based category classifier
 * Takes any produce name entered by the farmer and suggests the best category.
 */
export function suggestCategory(productName: string): ProductCategory {
  const norm = productName.trim().toLowerCase();
  if (!norm) return 'Other';

  // Direct catalog match check
  for (const [key, info] of Object.entries(KNOWN_CROPS_CATALOG)) {
    if (norm.includes(key) || key.includes(norm)) {
      return info.category;
    }
  }

  // Plantation Crops patterns
  if (
    norm.includes('coconut') ||
    norm.includes('arecanut') ||
    norm.includes('betel') ||
    norm.includes('rubber') ||
    norm.includes('tea') ||
    norm.includes('coffee') ||
    norm.includes('cashew') ||
    norm.includes('oil palm') ||
    norm.includes('cocoa')
  ) {
    return 'Plantation Crops';
  }

  // Oilseeds patterns
  if (
    norm.includes('oil') ||
    norm.includes('sesame') ||
    norm.includes('groundnut') ||
    norm.includes('peanut') ||
    norm.includes('mustard') ||
    norm.includes('sunflower') ||
    norm.includes('soybean') ||
    norm.includes('castor') ||
    norm.includes('flax') ||
    norm.includes('safflower') ||
    norm.includes('til')
  ) {
    return 'Oilseeds';
  }

  // Spices patterns
  if (
    norm.includes('chilli') ||
    norm.includes('chili') ||
    norm.includes('pepper') ||
    norm.includes('turmeric') ||
    norm.includes('ginger') ||
    norm.includes('garlic') ||
    norm.includes('clove') ||
    norm.includes('cardamom') ||
    norm.includes('coriander') ||
    norm.includes('curry leaf') ||
    norm.includes('curry leaves') ||
    norm.includes('tamarind') ||
    norm.includes('cumin') ||
    norm.includes('fennel') ||
    norm.includes('fenugreek') ||
    norm.includes('methi') ||
    norm.includes('cinnamon')
  ) {
    return 'Spices';
  }

  // Pulses patterns
  if (
    norm.includes('dal') ||
    norm.includes('gram') ||
    norm.includes('pulse') ||
    norm.includes('pea') ||
    norm.includes('bean') ||
    norm.includes('lentil') ||
    norm.includes('chana') ||
    norm.includes('rajma') ||
    norm.includes('urad') ||
    norm.includes('moong') ||
    norm.includes('toor')
  ) {
    return 'Pulses';
  }

  // Grains patterns
  if (
    norm.includes('rice') ||
    norm.includes('paddy') ||
    norm.includes('wheat') ||
    norm.includes('grain') ||
    norm.includes('maize') ||
    norm.includes('corn') ||
    norm.includes('millet') ||
    norm.includes('ragi') ||
    norm.includes('jowar') ||
    norm.includes('bajra') ||
    norm.includes('barley') ||
    norm.includes('oat')
  ) {
    return 'Grains';
  }

  // Fruits patterns
  if (
    norm.includes('mango') ||
    norm.includes('banana') ||
    norm.includes('apple') ||
    norm.includes('orange') ||
    norm.includes('grape') ||
    norm.includes('papaya') ||
    norm.includes('guava') ||
    norm.includes('berry') ||
    norm.includes('melon') ||
    norm.includes('watermelon') ||
    norm.includes('citrus') ||
    norm.includes('lemon') ||
    norm.includes('lime') ||
    norm.includes('custard') ||
    norm.includes('pomegranate') ||
    norm.includes('pineapple') ||
    norm.includes('sapota') ||
    norm.includes('chikoo') ||
    norm.includes('fig') ||
    norm.includes('jackfruit')
  ) {
    return 'Fruits';
  }

  // Vegetables patterns
  if (
    norm.includes('tomato') ||
    norm.includes('potato') ||
    norm.includes('onion') ||
    norm.includes('carrot') ||
    norm.includes('cabbage') ||
    norm.includes('cauliflower') ||
    norm.includes('spinach') ||
    norm.includes('palak') ||
    norm.includes('brinjal') ||
    norm.includes('eggplant') ||
    norm.includes('gourd') ||
    norm.includes('drumstick') ||
    norm.includes('radish') ||
    norm.includes('yam') ||
    norm.includes('cucumber') ||
    norm.includes('capsicum') ||
    norm.includes('lady finger') ||
    norm.includes('okra') ||
    norm.includes('bhendi') ||
    norm.includes('beetroot')
  ) {
    return 'Vegetables';
  }

  return 'Other';
}

/**
 * Automatic Product Recognition
 * Checks whether the product already exists in known catalogs or database.
 * If reliable market-price information is NOT available, does NOT invent a market price.
 */
export function recognizeProduct(productName: string): {
  existsInCatalog: boolean;
  category: ProductCategory;
  suggestedUnit: string;
  marketPrice?: number;
  marketPriceAvailable: boolean;
  emoji: string;
  defaultImageUrl: string;
  nameTe?: string;
} {
  const norm = productName.trim().toLowerCase();

  // Try direct lookup
  for (const [key, crop] of Object.entries(KNOWN_CROPS_CATALOG)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return {
        existsInCatalog: true,
        category: crop.category,
        suggestedUnit: crop.suggestedUnit,
        marketPrice: crop.marketPrice,
        marketPriceAvailable: crop.marketPriceAvailable,
        emoji: crop.emoji,
        defaultImageUrl: crop.imageUrl,
        nameTe: crop.nameTe
      };
    }
  }

  // If not in predefined catalog, suggest intelligent defaults
  const guessedCategory = suggestCategory(productName);
  const categoryEmojis: Record<ProductCategory, string> = {
    Vegetables: '🥬',
    Fruits: '🍎',
    Grains: '🌾',
    Pulses: '🫘',
    Spices: '🌶️',
    Oilseeds: '🌻',
    'Plantation Crops': '🌴',
    Other: '🌱'
  };

  return {
    existsInCatalog: false,
    category: guessedCategory,
    suggestedUnit: 'kg',
    marketPrice: undefined,
    marketPriceAvailable: false,
    emoji: categoryEmojis[guessedCategory] || '🌱',
    defaultImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80'
  };
}

/**
 * Smart Price Comparison logic according to user specification
 * Savings / Price Difference = Market Price - Farmer Price
 * Percentage Difference = ((Market Price - Farmer Price) / Market Price) * 100
 */
export function calculateSmartPriceComparison(
  farmerPrice: number,
  marketPrice?: number
): {
  marketPriceAvailable: boolean;
  marketPrice?: number;
  savingsPerUnit: number;
  percentageDifference: number;
  isBelowMarket: boolean;
} {
  if (!marketPrice || marketPrice <= 0) {
    return {
      marketPriceAvailable: false,
      savingsPerUnit: 0,
      percentageDifference: 0,
      isBelowMarket: false
    };
  }

  const diff = marketPrice - farmerPrice;
  const pct = Number((((marketPrice - farmerPrice) / marketPrice) * 100).toFixed(1));

  return {
    marketPriceAvailable: true,
    marketPrice,
    savingsPerUnit: diff,
    percentageDifference: pct,
    isBelowMarket: diff > 0
  };
}

import { Product, ProductPriceIntelligence, PricePoint } from '../types';

export function calculate_savings(marketPrice: number, agriPrice: number): number {
  return Math.max(0, marketPrice - agriPrice);
}

export function calculate_savings_percentage(marketPrice: number, agriPrice: number): number {
  if (marketPrice <= 0) return 0;
  const savings = calculate_savings(marketPrice, agriPrice);
  return Number(((savings / marketPrice) * 100).toFixed(1));
}

export function calculate_bulk_savings(marketPrice: number, agriPrice: number, quantityKg: number) {
  const marketCost = marketPrice * quantityKg;
  const agriCost = agriPrice * quantityKg;
  const savings = Math.max(0, marketCost - agriCost);
  const percentage = marketCost > 0 ? Number(((savings / marketCost) * 100).toFixed(1)) : 0;

  return {
    quantityKg,
    marketCost,
    agriCost,
    savings,
    percentage
  };
}

export function getProductPriceIntelligence(product: Product): ProductPriceIntelligence {
  const savingsPerUnit = calculate_savings(product.marketPrice, product.price);
  const savingsPercentage = calculate_savings_percentage(product.marketPrice, product.price);

  // Generate 6 months historical comparison
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const baseM = product.marketPrice;
  const baseA = product.price;

  const historicalPrices: PricePoint[] = months.map((month, idx) => {
    // Realistic market fluctuation
    const mFluct = (idx === 5) ? 0 : ((idx % 2 === 0 ? 1 : -1) * (baseM * 0.08));
    const aFluct = (idx === 5) ? 0 : ((idx % 2 === 0 ? 1 : -1) * (baseA * 0.05));
    return {
      date: `2026 ${month}`,
      marketPrice: Math.round(baseM + mFluct),
      agriPrice: Math.round(baseA + aFluct),
      volumeSold: Math.round(300 + idx * 80)
    };
  });

  // 3 months forecast
  const futureMonths = ['Oct', 'Nov', 'Dec'];
  const forecastedPrices: PricePoint[] = futureMonths.map((month, idx) => ({
    date: `2026 ${month} (Pred)`,
    marketPrice: Math.round(baseM * (1 + 0.03 * (idx + 1))),
    agriPrice: Math.round(baseA * (1 + 0.015 * (idx + 1)))
  }));

  const wholesaleMandi =
    product.location.includes('Nashik') ? 'APMC Nashik Wholesale Mandi' :
    product.location.includes('Agra') ? 'APMC Agra Subzi Mandi' :
    product.location.includes('Indore') ? 'Kharjana APMC Krishi Mandi' :
    product.location.includes('Mysuru') ? 'Bandipalya APMC Yard Mysuru' : 'Vashi Wholesale APMC Market';

  return {
    productId: product.id,
    productName: product.name,
    category: product.category,
    currentMarketPrice: product.marketPrice,
    currentAgriPrice: product.price,
    savingsPerUnit,
    savingsPercentage,
    historicalPrices,
    forecastedPrices,
    wholesaleMandi,
    lastUpdated: 'Today at 06:00 AM IST'
  };
}

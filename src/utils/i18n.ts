export type Language = 'en';

export interface Translations {
  appName: string;
  tagline: string;
  sellDirectly: string;
  iAmFarmer: string;
  iAmBuyer: string;
  home: string;
  sellProduce: string;
  buyProduce: string;
  myOrders: string;
  myEarnings: string;
  mySavings: string;
  profile: string;
  todaysAiAdvice: string;
  goodMorning: string;
  whatToDo: string;
  sellMyProduce: string;
  buyFarmProduce: string;
  marketPrice: string;
  yourPrice: string;
  goodPrice: string;
  savePerKg: string;
  howMuchHave: string;
  sellNow: string;
  buyNow: string;
  availableStock: string;
  seller: string;
  location: string;
  quantity: string;
  total: string;
  youSave: string;
  placeOrder: string;
  orderPlaced: string;
  onTheWay: string;
  orderConfirmed: string;
  delivered: string;
  listen: string;
  speaking: string;
  askAgriSaathi: string;
  searchPlaceholder: string;
  allCategories: string;
  vegetables: string;
  fruits: string;
  grains: string;
  pulses: string;
  spices: string;
  oilseeds: string;
  plantationCrops: string;
  otherCategory: string;
  addYourProduce: string;
  cantFindProduct: string;
  whatDoYouWantToSell: string;
  enterProductName: string;
  selectCategory: string;
  howMuchDoYouHave: string;
  yourSellingPrice: string;
  addPhotoOptional: string;
  marketPriceUnavailable: string;
  notEnoughSalesData: string;
  smartCategorySuggestion: string;
  enterName: string;
  mobileNumber: string;
  villageLocation: string;
  continueBtn: string;
  deliveryPlan: string;
  distance: string;
  estimatedTime: string;
  viewRoute: string;
  sustainabilityTitle: string;
  farmersConnected: string;
  directOrders: string;
  distanceSaved: string;
  buyerSavings: string;
  seeMore: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'AgriConnect AI',
    tagline: 'Better Prices. Direct Markets. Smarter Farming.',
    sellDirectly: 'Sell directly. Buy easily. Get better prices.',
    iAmFarmer: '🌾 I am a Farmer',
    iAmBuyer: '🛒 I am a Buyer',
    home: 'Home',
    sellProduce: 'Sell',
    buyProduce: 'Buy',
    myOrders: 'My Orders',
    myEarnings: 'My Earnings',
    mySavings: 'My Savings',
    profile: 'Profile',
    todaysAiAdvice: "AI Advice",
    goodMorning: 'Welcome to AgriConnect AI',
    whatToDo: 'What would you like to do today?',
    sellMyProduce: 'SELL PRODUCE',
    buyFarmProduce: 'BUY PRODUCE',
    marketPrice: 'Market Price',
    yourPrice: 'Your Price',
    goodPrice: '🟢 Good Price',
    savePerKg: 'Buyer Saves',
    howMuchHave: 'How much do you have to sell?',
    sellNow: 'SELL NOW',
    buyNow: 'BUY NOW',
    availableStock: 'Available',
    seller: 'Farmer',
    location: 'Location',
    quantity: 'Quantity',
    total: 'Total',
    youSave: 'Buyer Saves',
    placeOrder: 'PLACE ORDER',
    orderPlaced: 'Order Placed',
    onTheWay: 'On the Way',
    orderConfirmed: 'Confirmed',
    delivered: 'Delivered',
    listen: 'Listen',
    speaking: 'Speaking...',
    askAgriSaathi: 'Agri Saathi',
    searchPlaceholder: 'Search crops, vegetables, fruits...',
    allCategories: 'All Produce',
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    grains: 'Grains',
    pulses: 'Pulses',
    spices: 'Spices',
    oilseeds: 'Oilseeds',
    plantationCrops: 'Plantation Crops',
    otherCategory: 'Other',
    addYourProduce: 'ADD YOUR PRODUCE',
    cantFindProduct: 'Selling a different crop or harvest?',
    whatDoYouWantToSell: 'What do you want to sell?',
    enterProductName: 'Product Name',
    selectCategory: 'Category',
    howMuchDoYouHave: 'Quantity',
    yourSellingPrice: 'Price',
    addPhotoOptional: 'Photo (Optional)',
    marketPriceUnavailable: 'Market benchmark not currently available',
    notEnoughSalesData: 'Not enough sales data for a reliable forecast yet',
    smartCategorySuggestion: 'Suggested Category',
    enterName: 'Full Name',
    mobileNumber: 'Mobile Number',
    villageLocation: 'Village / Location',
    continueBtn: 'Continue',
    deliveryPlan: 'Delivery Plan',
    distance: 'Distance',
    estimatedTime: 'Est. Time',
    viewRoute: 'View Route',
    sustainabilityTitle: 'Direct Farm Impact',
    farmersConnected: 'Farmers Connected',
    directOrders: 'Direct Orders',
    distanceSaved: 'Transport Saved',
    buyerSavings: 'Buyer Savings',
    seeMore: 'See More',
    close: 'Close'
  }
};

export const speakText = (text: string, _lang?: Language) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
};

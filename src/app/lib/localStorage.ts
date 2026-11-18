// Local storage helper untuk development/demo tanpa backend
// Data akan persist di browser sampai backend ready

const STORAGE_KEYS = {
  SHOPS: 'bunga_shops',
  PRODUCTS: 'bunga_products',
  ORDERS: 'bunga_orders',
  USER_SHOP: 'bunga_user_shop'
};

// Shop operations
export const saveShop = (userId: string, shopData: any) => {
  const shops = getShops();
  const existingIndex = shops.findIndex((s: any) => s.userId === userId);

  const shop = {
    ...shopData,
    id: shopData.id || Date.now().toString(),
    userId,
    createdAt: shopData.createdAt || new Date().toISOString()
  };

  if (existingIndex >= 0) {
    shops[existingIndex] = shop;
  } else {
    shops.push(shop);
  }

  localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  localStorage.setItem(STORAGE_KEYS.USER_SHOP + '_' + userId, JSON.stringify(shop));
  return shop;
};

export const getShops = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SHOPS);
  return data ? JSON.parse(data) : [];
};

export const getShopById = (shopId: string) => {
  const shops = getShops();
  return shops.find((s: any) => s.id === shopId);
};

export const getUserShop = (userId: string) => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_SHOP + '_' + userId);
  return data ? JSON.parse(data) : null;
};

// Product operations
export const saveProduct = (userId: string, productData: any) => {
  const products = getProducts();
  const userShop = getUserShop(userId);

  const product = {
    ...productData,
    id: productData.id || Date.now().toString(),
    shopId: userShop?.id || userId,
    userId,
    createdAt: productData.createdAt || new Date().toISOString()
  };

  const existingIndex = products.findIndex((p: any) => p.id === product.id);

  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products.push(product);
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return product;
};

export const getProducts = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const getProductsByShopId = (shopId: string) => {
  const products = getProducts();
  return products.filter((p: any) => p.shopId === shopId);
};

export const getProductsByUserId = (userId: string) => {
  const products = getProducts();
  return products.filter((p: any) => p.userId === userId);
};

export const deleteProduct = (productId: string) => {
  const products = getProducts();
  const filtered = products.filter((p: any) => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
  return true;
};

// Order operations
export const saveOrder = (userId: string, orderData: any) => {
  const orders = getOrders();

  const order = {
    ...orderData,
    id: orderData.id || Date.now().toString(),
    userId,
    status: orderData.status || 'pending',
    paymentStatus: orderData.paymentStatus || 'unpaid',
    createdAt: orderData.createdAt || new Date().toISOString()
  };

  orders.push(order);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  return order;
};

export const getOrders = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const getOrdersByUserId = (userId: string) => {
  const orders = getOrders();
  return orders.filter((o: any) => o.userId === userId);
};

export const getOrdersByShopId = (shopId: string) => {
  const orders = getOrders();
  return orders.filter((o: any) => o.shopId === shopId);
};

export const updateOrderStatus = (orderId: string, status: string) => {
  const orders = getOrders();
  const orderIndex = orders.findIndex((o: any) => o.id === orderId);

  if (orderIndex >= 0) {
    orders[orderIndex].status = status;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    return orders[orderIndex];
  }
  return null;
};

// Recommended products (random selection from all available products)
export const getRecommendedProducts = (limit: number = 6) => {
  const products = getProducts();
  const available = products.filter((p: any) => p.isAvailable);

  // Shuffle and take first N items
  const shuffled = available.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
};

// Clear all data (for testing)
export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

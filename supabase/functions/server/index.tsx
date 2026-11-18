import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client helper
const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
);

const getSupabaseAnonClient = () => createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_ANON_KEY'),
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-041a388e/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTHENTICATION ROUTES =====

// Sign up new user
app.post("/make-server-041a388e/auth/signup", async (c) => {
  try {
    const { email, password, name, userType, userId } = await c.req.json();
    
    // If userId is provided, user already exists in Supabase Auth
    // Just store additional user data in KV store
    if (userId) {
      const userData = {
        id: userId,
        email,
        name,
        userType: userType || 'customer',
        createdAt: new Date().toISOString()
      };
      
      await kv.set(`user:${userId}`, userData);
      
      return c.json({ user: userData, message: "User data stored successfully" });
    }
    
    // Otherwise, create user using admin API (for backward compatibility)
    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, userType: userType || 'customer' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error("Sign up error:", error);
      return c.json({ error: `Failed to create user: ${error.message}` }, 400);
    }

    // Store user data in KV store
    const userData = {
      id: data.user.id,
      email: data.user.email,
      name,
      userType: userType || 'customer',
      createdAt: new Date().toISOString()
    };
    
    await kv.set(`user:${data.user.id}`, userData);

    return c.json({ user: data.user, message: "User created successfully" });
  } catch (error) {
    console.error("Sign up exception:", error);
    return c.json({ error: `Server error during signup: ${error.message}` }, 500);
  }
});

// ===== SHOP REGISTRATION ROUTES =====

// Register new flower shop
app.post("/make-server-041a388e/shops/register", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized - please login first" }, 401);
    }

    const shopData = await c.req.json();
    const { name, description, address, phone, latitude, longitude, images } = shopData;

    if (!name || !address || !phone) {
      return c.json({ error: "Shop name, address, and phone are required" }, 400);
    }

    const shop = {
      id: crypto.randomUUID(),
      ownerId: user.id,
      name,
      description,
      address,
      phone,
      latitude: latitude || null,
      longitude: longitude || null,
      images: images || [],
      status: 'pending', // pending, active, suspended
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`shop:${shop.id}`, shop);
    await kv.set(`user:${user.id}:shop`, shop.id);

    return c.json({ shop, message: "Shop registered successfully" });
  } catch (error) {
    console.error("Shop registration error:", error);
    return c.json({ error: `Failed to register shop: ${error.message}` }, 500);
  }
});

// Get shop by ID
app.get("/make-server-041a388e/shops/:id", async (c) => {
  try {
    const shopId = c.req.param('id');
    const shop = await kv.get(`shop:${shopId}`);
    
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }

    return c.json({ shop });
  } catch (error) {
    console.error("Get shop error:", error);
    return c.json({ error: `Failed to get shop: ${error.message}` }, 500);
  }
});

// Get all shops (with optional location filtering)
app.get("/make-server-041a388e/shops", async (c) => {
  try {
    const shops = await kv.getByPrefix("shop:");
    
    // Filter out user:shop mappings
    const validShops = shops.filter(shop => shop.id && shop.name);
    
    return c.json({ shops: validShops });
  } catch (error) {
    console.error("Get shops error:", error);
    return c.json({ error: `Failed to get shops: ${error.message}` }, 500);
  }
});

// ===== PRE-ORDER ROUTES =====

// Create pre-order
app.post("/make-server-041a388e/preorders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized - please login first" }, 401);
    }

    const orderData = await c.req.json();
    const { shopId, items, deliveryDate, deliveryAddress, specialRequests, totalAmount } = orderData;

    if (!shopId || !items || !deliveryDate || !totalAmount) {
      return c.json({ error: "Shop, items, delivery date, and amount are required" }, 400);
    }

    const preorder = {
      id: crypto.randomUUID(),
      userId: user.id,
      shopId,
      items,
      deliveryDate,
      deliveryAddress,
      specialRequests,
      totalAmount,
      status: 'pending', // pending, confirmed, preparing, ready, delivered, cancelled
      paymentStatus: 'unpaid', // unpaid, paid, refunded
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`preorder:${preorder.id}`, preorder);
    
    // Add to user's orders
    const userOrders = await kv.get(`user:${user.id}:orders`) || [];
    userOrders.push(preorder.id);
    await kv.set(`user:${user.id}:orders`, userOrders);

    return c.json({ preorder, message: "Pre-order created successfully" });
  } catch (error) {
    console.error("Pre-order creation error:", error);
    return c.json({ error: `Failed to create pre-order: ${error.message}` }, 500);
  }
});

// Get user's pre-orders
app.get("/make-server-041a388e/preorders/my", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const orderIds = await kv.get(`user:${user.id}:orders`) || [];
    const orders = [];
    
    for (const orderId of orderIds) {
      const order = await kv.get(`preorder:${orderId}`);
      if (order) orders.push(order);
    }

    return c.json({ orders });
  } catch (error) {
    console.error("Get pre-orders error:", error);
    return c.json({ error: `Failed to get orders: ${error.message}` }, 500);
  }
});

// ===== PAYMENT ROUTES =====

// Create payment
app.post("/make-server-041a388e/payments", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = getSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { preorderId, paymentMethod, amount } = await c.req.json();

    if (!preorderId || !paymentMethod || !amount) {
      return c.json({ error: "Order ID, payment method, and amount are required" }, 400);
    }

    // Get the preorder
    const preorder = await kv.get(`preorder:${preorderId}`);
    if (!preorder) {
      return c.json({ error: "Pre-order not found" }, 404);
    }

    if (preorder.userId !== user.id) {
      return c.json({ error: "Unauthorized - not your order" }, 403);
    }

    const payment = {
      id: crypto.randomUUID(),
      preorderId,
      userId: user.id,
      amount,
      paymentMethod, // bank_transfer, e-wallet, credit_card
      status: 'pending', // pending, success, failed
      transactionId: `TRX-${Date.now()}`,
      createdAt: new Date().toISOString(),
      paidAt: null
    };

    await kv.set(`payment:${payment.id}`, payment);

    // Update preorder payment status
    preorder.paymentStatus = 'paid';
    preorder.paymentId = payment.id;
    await kv.set(`preorder:${preorderId}`, preorder);

    return c.json({ 
      payment, 
      message: "Payment initiated successfully. Please complete the payment.",
      paymentInstructions: getPaymentInstructions(paymentMethod)
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return c.json({ error: `Failed to create payment: ${error.message}` }, 500);
  }
});

// Helper function for payment instructions
function getPaymentInstructions(method: string) {
  const instructions = {
    bank_transfer: {
      bank: "Bank BCA",
      accountNumber: "1234567890",
      accountName: "Bunga Kreativitas",
      instructions: "Transfer ke rekening di atas dan upload bukti transfer"
    },
    e_wallet: {
      provider: "GoPay / OVO / Dana",
      number: "081234567890",
      instructions: "Transfer ke nomor e-wallet di atas"
    },
    credit_card: {
      instructions: "Pembayaran kartu kredit akan diproses"
    }
  };
  return instructions[method] || {};
}

// ===== PINTEREST REFERENCE ROUTES =====

// Search Pinterest for flower design references
app.get("/make-server-041a388e/pinterest/search", async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query) {
      return c.json({ error: "Search query is required" }, 400);
    }

    const pinterestApiKey = Deno.env.get('PINTEREST_API_KEY');
    
    if (!pinterestApiKey) {
      return c.json({ 
        error: "Pinterest API not configured",
        message: "Please configure Pinterest API key in environment variables"
      }, 503);
    }

    // Pinterest API v5 search endpoint
    const response = await fetch(
      `https://api.pinterest.com/v5/search/pins?query=${encodeURIComponent(query)}&limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${pinterestApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Pinterest API error:", errorText);
      return c.json({ 
        error: "Failed to fetch from Pinterest",
        details: errorText 
      }, response.status);
    }

    const data = await response.json();
    
    return c.json({ 
      results: data.items || [],
      query
    });
  } catch (error) {
    console.error("Pinterest search error:", error);
    return c.json({ error: `Failed to search Pinterest: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);
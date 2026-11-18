// API wrapper untuk Supabase backend
// Semua API calls akan melalui file ini

import { supabase } from './supabase';

// =============================================
// HELPER FUNCTIONS
// =============================================

const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};

const getUserId = async () => {
  // Gunakan session lokal (auto-refresh) alih-alih getUser() yang selalu
  // melakukan panggilan jaringan — mencegah error "Not authenticated" palsu
  // saat token masih valid tetapi validasi jaringan gagal/lambat.
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

// =============================================
// USERS API
// =============================================

export const createUserProfile = async (userData: {
  id: string;
  email: string;
  name: string;
  userType: string;
  phone?: string;
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      user_type: userData.userType,
      phone: userData.phone
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// =============================================
// SHOPS API
// =============================================

export const getAllShops = async () => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getShopById = async (shopId: string) => {
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single();

  if (error) throw error;
  return data;
};

export const getMyShop = async () => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
};

export const createOrUpdateShop = async (shopData: {
  name: string;
  description?: string;
  address: string;
  city?: string;
  phone: string;
  email?: string;
  openingHours?: string;
  imageUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  categories?: string[];
}) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  // Ensure user profile exists in public.users table
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingUser) {
      // User profile doesn't exist, create it
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        await supabase.from('users').insert({
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || 'User',
          user_type: authUser.user_metadata?.userType || 'customer',
          phone: authUser.user_metadata?.phone
        });
        
        console.log('✅ User profile created automatically');
      }
    }
  } catch (profileError) {
    console.error('Error checking/creating user profile:', profileError);
    // Continue anyway, will fail with better error message if still missing
  }

  // Check if shop exists
  const existingShop = await getMyShop();

  const shopPayload: Record<string, any> = {
    user_id: userId,
    name: shopData.name,
    description: shopData.description,
    address: shopData.address,
    city: shopData.city,
    phone: shopData.phone,
    email: shopData.email,
    opening_hours: shopData.openingHours,
    image_url: shopData.imageUrl,
    latitude: shopData.latitude,
    longitude: shopData.longitude
  };
  if (shopData.categories !== undefined) {
    shopPayload.categories = shopData.categories;
  }

  if (existingShop) {
    // Update existing shop
    const { data, error } = await supabase
      .from('shops')
      .update(shopPayload)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new shop
    const { data, error } = await supabase
      .from('shops')
      .insert(shopPayload)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// =============================================
// PRODUCTS API
// =============================================

export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      shops:shop_id (
        id,
        name,
        address
      )
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getProductById = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      shops:shop_id (
        id,
        name,
        address,
        phone,
        image_url
      )
    `)
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data;
};

export const getProductsByShopId = async (shopId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getMyProducts = async () => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getRecommendedProducts = async (limit: number = 6) => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      shops:shop_id (
        id,
        name
      )
    `)
    .eq('is_available', true)
    .limit(limit)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  isPreOrder: boolean;
  discountPercentage?: number;
  isOnDiscount?: boolean;
  flowerType?: string | null;
  poDurationDays?: number | null;
  flowerLifetimeDays?: number | null;
  careInstructions?: string | null;
  sizes?: Record<string, number> | null;
}

const buildProductPayload = (p: ProductInput) => {
  const pct = p.isOnDiscount && p.discountPercentage ? Math.max(0, Math.min(100, p.discountPercentage)) : 0;
  const onDiscount = !!p.isOnDiscount && pct > 0;
  const discountPrice = onDiscount ? Math.round(p.price * (1 - pct / 100)) : null;
  const payload: Record<string, any> = {
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    category: p.category,
    image_url: p.imageUrl,
    is_available: p.isAvailable,
    is_pre_order: p.isPreOrder,
    is_on_discount: onDiscount,
    discount_percentage: onDiscount ? pct : 0,
    discount_price: discountPrice,
    flower_type: p.flowerType ?? null,
    po_duration_days: p.poDurationDays ?? null,
    flower_lifetime_days: p.flowerLifetimeDays ?? null,
    care_instructions: p.careInstructions ?? null,
  };
  if (p.sizes && Object.keys(p.sizes).length > 0) {
    payload.sizes = p.sizes;
  }
  return payload;
};

export const createProduct = async (productData: ProductInput) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const shop = await getMyShop();
  if (!shop) throw new Error('Shop not found. Please create a shop first.');

  const { data, error } = await supabase
    .from('products')
    .insert({ shop_id: shop.id, user_id: userId, ...buildProductPayload(productData) })
    .select()
    .single();

  if (error) { console.error(`[BLOEMEN] Tambah produk gagal: ${error.message}`); throw error; }
  console.log(`[BLOEMEN] Produk ditambahkan: "${data.name}" (id: ${data.id})`);
  return data;
};

export const updateProduct = async (productId: string, productData: ProductInput) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('products')
    .update(buildProductPayload(productData))
    .eq('id', productId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) { console.error(`[BLOEMEN] Edit produk gagal: ${error.message}`); throw error; }
  console.log(`[BLOEMEN] Produk diperbarui: "${data.name}" (id: ${data.id})`);
  return data;
};

export const deleteProduct = async (productId: string) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', userId);

  if (error) { console.error(`[BLOEMEN] Hapus produk gagal: ${error.message}`); throw error; }
  console.log(`[BLOEMEN] Produk dihapus (id: ${productId})`);
  return true;
};

// =============================================
// PREORDERS API
// =============================================

export const createPreorder = async (orderData: {
  shopId: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    productId?: string;
    isPreOrder?: boolean;
  }>;
  deliveryDate: string;
  deliveryAddress: string;
  specialRequests?: string;
  totalAmount: number;
  designReference?: {
    url: string;
    title: string;
    description: string;
  } | null;
}) => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  // Generate a unique order number client-side to avoid relying on a broken DB trigger.
  const generateOrderNumber = () => {
    const d = new Date();
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `ORD-${ymd}-${Date.now().toString(36).toUpperCase()}-${rand}`;
  };

  // Create preorder, retrying with a fresh order_number on the rare unique-constraint collision.
  let preorder: any = null;
  let preorderError: any = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await supabase
      .from('preorders')
      .insert({
        order_number: generateOrderNumber(),
        user_id: userId,
        shop_id: orderData.shopId,
        delivery_date: orderData.deliveryDate,
        delivery_address: orderData.deliveryAddress,
        special_requests: orderData.specialRequests,
        total_amount: orderData.totalAmount,
        design_reference_url: orderData.designReference?.url,
        design_reference_title: orderData.designReference?.title,
        design_reference_description: orderData.designReference?.description,
        status: 'pending',
        payment_status: 'unpaid'
      })
      .select()
      .single();

    if (!result.error) {
      preorder = result.data;
      preorderError = null;
      break;
    }
    preorderError = result.error;
    if (result.error.code !== '23505') break;
  }

  if (preorderError) throw preorderError;

  // Create order items
  const orderItems = orderData.items.map(item => ({
    preorder_id: preorder.id,
    product_name: item.name,
    product_price: item.price,
    quantity: item.quantity,
    subtotal: item.price * item.quantity
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Decrement stock for ready-stock items only. Pre-order items are made on demand
  // so their `stock` field represents capacity, not inventory, and shouldn't decrement.
  for (const item of orderData.items) {
    if (!item.productId || item.isPreOrder) continue;
    try {
      const { data: product, error: fetchErr } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.productId)
        .single();

      if (fetchErr || !product) continue;

      const newStock = Math.max(0, (product.stock || 0) - item.quantity);
      await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.productId);
    } catch (err) {
      console.error('Failed to decrement stock for product', item.productId, err);
    }
  }

  // Notify both seller (new order) and buyer (order confirmation).
  // Best-effort: failures shouldn't block order creation, but we log them
  // explicitly so RLS / missing-table issues are easy to diagnose.
  try {
    const { data: shopRow } = await supabase
      .from('shops')
      .select('user_id, name')
      .eq('id', orderData.shopId)
      .single();

    const itemsLabel = orderData.items.length > 0
      ? orderData.items[0].name + (orderData.items.length > 1 ? ` +${orderData.items.length - 1} lainnya` : '')
      : 'Pesanan';

    // Insert buyer + seller notifications separately so one failing doesn't
    // roll back the other (batch insert is atomic under RLS).
    const buyerNotif = {
      user_id: userId,
      type: 'order_confirmed',
      title: 'Pesanan Dibuat',
      message: `Pesanan Anda "${itemsLabel}" senilai Rp ${orderData.totalAmount.toLocaleString('id-ID')} telah dibuat. Menunggu konfirmasi penjual.`,
      link: '/my-orders',
      is_read: false,
    };
    const { error: buyerErr } = await supabase.from('notifications').insert(buyerNotif);
    if (buyerErr) console.error('❌ Notif pembeli gagal:', buyerErr.message);
    else console.log('✅ Notif pembeli dibuat');

    if (shopRow?.user_id) {
      console.log('📨 Mengirim notif ke penjual user_id:', shopRow.user_id);
      const sellerNotif = {
        user_id: shopRow.user_id,
        type: 'new_order',
        title: 'Pesanan Baru Masuk',
        message: `Pesanan baru "${itemsLabel}" senilai Rp ${orderData.totalAmount.toLocaleString('id-ID')}. Klik untuk konfirmasi.`,
        link: '/seller/orders',
        is_read: false,
      };
      const { error: sellerErr } = await supabase.from('notifications').insert(sellerNotif);
      if (sellerErr) {
        console.error('❌ Notif penjual GAGAL:', sellerErr.message, sellerErr);
        console.error('💡 Penyebab paling umum: RLS policy notifications hanya mengizinkan insert untuk user sendiri. Pembeli tidak bisa insert notif untuk seller.');
        console.error('🔧 Fix: jalankan SQL ini di Supabase:');
        console.error('   DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;');
        console.error('   CREATE POLICY "Anyone authenticated can insert notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (true);');
      } else {
        console.log('✅ Notif penjual dibuat untuk user_id:', shopRow.user_id);
      }
    } else {
      console.warn('⚠️ Tidak ada user_id penjual untuk shop:', orderData.shopId);
    }
  } catch (notifErr) {
    console.warn('Failed to create notifications:', notifErr);
  }

  console.log(`[BLOEMEN] Pesanan tersimpan ke tabel preorders: ${preorder?.order_number} (total Rp${orderData.totalAmount})`);
  return preorder;
};

export const getMyOrders = async () => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('preorders')
    .select(`
      *,
      order_items (*),
      shops:shop_id (
        id,
        name,
        address
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getShopOrders = async () => {
  const userId = await getUserId();
  if (!userId) throw new Error('Not authenticated');

  // Get user's shop
  const shop = await getMyShop();
  if (!shop) {
    // Return empty array instead of throwing error
    // This allows dashboard to show gracefully
    console.warn('⚠️ Shop not found. Seller needs to complete shop registration.');
    return [];
  }

  const { data, error } = await supabase
    .from('preorders')
    .select(`
      *,
      order_items (*),
      users:user_id (
        id,
        name,
        email,
        phone
      )
    `)
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data, error } = await supabase
    .from('preorders')
    .update(status === 'delivered' ? { status, payment_status: 'paid' } : { status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  console.log(`[BLOEMEN] Status pesanan ${data.order_number} diubah menjadi "${status}"`);
  return data;
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: string,
  paymentMethod?: string
) => {
  // Pakai RPC pay_order (SECURITY DEFINER) agar pembeli tetap bisa membayar
  // meski status pesanan sudah bukan 'pending' (RLS UPDATE pembeli terbatas).
  const { data, error } = await supabase.rpc('pay_order', {
    p_order_id: orderId,
    p_method: paymentMethod || 'bank_transfer'
  });

  if (error) {
    // Fallback jika FIX_PAYMENT_STATUS.sql belum dijalankan
    const payload: Record<string, any> = { payment_status: paymentStatus };
    if (paymentMethod) payload.payment_method = paymentMethod;
    const { data: rows, error: updErr } = await supabase
      .from('preorders')
      .update(payload)
      .eq('id', orderId)
      .select();
    if (updErr) throw updErr;
    if (!rows || rows.length === 0) {
      throw new Error('Pembayaran tidak tersimpan. Jalankan supabase/FIX_PAYMENT_STATUS.sql');
    }
    console.log(`[BLOEMEN] Pembayaran ${rows[0].order_number}: ${paymentStatus} (${paymentMethod})`);
    return rows[0];
  }

  console.log(`[BLOEMEN] Pembayaran ${data?.order_number}: ${data?.payment_status} (${paymentMethod})`);
  return data;
};

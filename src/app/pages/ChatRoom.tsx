import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { ArrowLeft, Send, Loader2, Store, DollarSign, X, ShoppingBag, Image, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CustomOrderQuote, QuoteDealEvent, ReferenceCard, type Quote, type ReferenceMeta } from '../components/CustomOrderQuote';
import { SendReferenceToShop, type ReferencePayload } from '../components/SendReferenceToShop';
import { formatRupiahInput, parseRupiah, digitsOnly } from '../lib/money';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { useGoBack } from '../lib/navigation';

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
  image_url?: string | null;
  message_type?: 'text' | 'image' | 'reference' | null;
  metadata?: ReferenceMeta | null;
}

type TimelineItem =
  | { kind: 'msg'; at: number; key: string; msg: Message }
  | { kind: 'quote'; at: number; key: string; quote: Quote }
  | { kind: 'deal'; at: number; key: string; quote: Quote };

interface ShopInfo {
  id: string;
  name: string;
  user_id: string;
}

interface DesignReference {
  id: string;
  url: string;
  title: string;
  description: string;
  link?: string;
}


export default function ChatRoom() {
  const navigate = useNavigate();
  const goBack = useGoBack('/messages');
  const location = useLocation();
  const { shopId, conversationId: paramConversationId } = useParams<{ shopId: string; conversationId?: string }>();
  const { user } = useAuth();

  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  // Lawan bicara: pembeli jika user = penjual, pemilik toko jika user = pembeli
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const didInitialScroll = useRef(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showRefForm, setShowRefForm] = useState(false);

  // Design reference - loaded from conversation or navigation state
  const [designReference, setDesignReference] = useState<DesignReference | null>(null);
  const [showDesignRef, setShowDesignRef] = useState(false);

  // Custom order quotes
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orderPlacedForQuote, setOrderPlacedForQuote] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    productName: '',
    description: '',
    price: ''
  });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  // Check if current user is the shop owner (seller)
  const isSeller = shop?.user_id === user?.id;
  const isBuyer = !isSeller;
  const acceptedQuote = [...quotes].reverse().find(q => q.status === 'accepted');

  // Debug logs
  useEffect(() => {
    if (shop && user) {
      console.log('👤 Current User:', user.id, user.userType);
      console.log('🏪 Shop Owner:', shop.user_id);
      console.log('🎭 isSeller:', isSeller, '| isBuyer:', isBuyer);
      console.log('💰 Quotes:', quotes.length);
    }
  }, [shop, user, isSeller, isBuyer, quotes]);

  useEffect(() => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }

    if (shopId) {
      initializeChat();
    }
  }, [user, shopId]);

  // Timeline gabungan: pesan + penawaran + event "deal", urut kronologis (lama → baru)
  // sehingga penawaran terbaru selalu muncul di bawah, di sela-sela chat.
  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = messages.map((m) => ({
      kind: 'msg', at: new Date(m.created_at).getTime(), key: `m-${m.id}`, msg: m,
    }));
    quotes.forEach((q) => {
      items.push({ kind: 'quote', at: new Date(q.created_at).getTime(), key: `q-${q.id}`, quote: q });
      if (q.status === 'accepted') {
        const at = q.responded_at || q.updated_at || q.created_at;
        // +1 ms agar event deal selalu tampil setelah kartu penawarannya
        items.push({ kind: 'deal', at: new Date(at).getTime() + 1, key: `d-${q.id}`, quote: q });
      }
    });
    return items.sort((a, b) => a.at - b.at);
  }, [messages, quotes]);

  const timelineSignature = timeline.map((t) => t.key + (t.kind === 'quote' ? t.quote.status : '')).join('|');
  useEffect(() => {
    scrollToBottom();
  }, [timelineSignature, loading]);

  // If the user re-enters the same chat with a different design reference
  // (e.g. picks another reference and clicks "send to shop"), sync it to the conversation.
  useEffect(() => {
    const navDesignRef = (location.state as any)?.designReference;
    if (!navDesignRef || !conversationId) return;
    if (designReference?.url === navDesignRef.url) return;

    (async () => {
      const { error } = await supabase
        .from('conversations')
        .update({
          design_reference_url: navDesignRef.url,
          design_reference_title: navDesignRef.title,
          design_reference_description: navDesignRef.description
        })
        .eq('id', conversationId);

      if (error) {
        console.error('❌ Failed to update conversation design ref:', error);
        return;
      }
      setDesignReference(navDesignRef);
      setShowDesignRef(true);
    })();
  }, [location.state, conversationId]);

  useEffect(() => {
    if (conversationId) {
      // Fetch existing quotes
      fetchQuotes();

      // Subscribe to new messages and quotes
      const channel = supabase
        .channel(`conversation-${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`
          },
          (payload) => {
            console.log('New message received:', payload);
            const newMsg = payload.new as Message;
            // Only add if it's from other user (to avoid duplication)
            if (newMsg.sender_id !== user?.id) {
              console.log(`[BLOEMEN] Pesan chat diterima via Realtime: "${newMsg.message}" (${Math.round(Date.now() - new Date(newMsg.created_at).getTime())} ms)`);
              setMessages((prev) => [...prev, newMsg]);
              // Mark as read immediately
              if (conversationId) {
                markMessagesAsRead(conversationId, newMsg.sender_id);
              }
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'custom_order_quotes',
            filter: `conversation_id=eq.${conversationId}`
          },
          () => {
            // Refetch quotes on any change
            fetchQuotes();
          }
        )
        .subscribe((status) => console.log(`[BLOEMEN] Realtime chat ${conversationId}: ${status}`));

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId, user?.id]);

  // After quotes change, check whether buyer already placed an order against the accepted quote.
  useEffect(() => {
    const accepted = [...quotes].reverse().find(q => q.status === 'accepted');
    if (!accepted || !user || !shop || isSeller) {
      setOrderPlacedForQuote(false);
      return;
    }
    (async () => {
      const { data, error } = await supabase
        .from('preorders')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('shop_id', shop.id)
        .gte('created_at', accepted.created_at)
        .neq('status', 'cancelled')
        .limit(1);

      if (error) {
        console.error('Error checking existing preorders:', error);
        return;
      }
      setOrderPlacedForQuote((data?.length || 0) > 0);
    })();
  }, [quotes, user?.id, shop?.id, isSeller]);

  const fetchQuotes = async () => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('custom_order_quotes')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('📊 Quotes fetched:', data?.length || 0, data);
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;
    if (!didInitialScroll.current) {
      // Saat chat dibuka: langsung lompat ke pesan terbaru (tanpa animasi),
      // diulang sebentar karena gambar/kartu bisa menambah tinggi setelah dimuat.
      const jump = () => { el.scrollTop = el.scrollHeight; };
      jump();
      requestAnimationFrame(jump);
      [120, 350, 800].forEach((t) => setTimeout(jump, t));
      if (timeline.length > 0) didInitialScroll.current = true;
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      setLoading(true);

      // Get shop info including owner user_id
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id, name, user_id')
        .eq('id', shopId)
        .single();

      if (shopError) throw shopError;

      setShop(shopData);

      // If conversationId is provided in URL (seller opening existing conversation)
      if (paramConversationId) {
        console.log('📱 Opening existing conversation:', paramConversationId);
        await loadExistingConversation(paramConversationId, shopData);
      } else {
        // Find or create conversation (buyer starting new chat)
        await findOrCreateConversation(shopData);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast.error('Gagal memuat chat');
      goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadExistingConversation = async (convId: string, shopData: ShopInfo) => {
    try {
      // Load conversation with design reference
      const { data: conv, error } = await supabase
        .from('conversations')
        .select('id, user1_id, user2_id, design_reference_url, design_reference_title, design_reference_description')
        .eq('id', convId)
        .single();

      if (error) throw error;

      const otherId = conv.user1_id === user?.id ? conv.user2_id : conv.user1_id;
      setConversationId(conv.id);
      setOtherUserId(otherId);
      await fetchMessages(conv.id);
      await markMessagesAsRead(conv.id, otherId);

      // Load design reference if exists
      if (conv.design_reference_url) {
        console.log('✅ Design ref loaded from DB:', conv.design_reference_url);
        setDesignReference({
          id: conv.id,
          url: conv.design_reference_url,
          title: conv.design_reference_title || 'Design Reference',
          description: conv.design_reference_description || ''
        });
        setShowDesignRef(true);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      throw error;
    }
  };

  const findOrCreateConversation = async (shopData: ShopInfo) => {
    try {
      // Get design reference from navigation state (if coming from design reference page)
      const navDesignRef = (location.state as any)?.designReference;

      // ONLY prevent buyer from chatting with their own shop
      // Seller SHOULD be able to open chat to reply to buyers
      const isBuyerChattingSelf = shopData.user_id === user?.id && user?.userType === 'buyer';
      if (isBuyerChattingSelf) {
        toast.error('Anda tidak bisa chat dengan toko sendiri');
        goBack();
        return;
      }

      // Try to find existing conversation
      // user1_id should be the smaller UUID, user2_id should be the larger UUID
      const userId1 = user!.id < shopData.user_id ? user!.id : shopData.user_id;
      const userId2 = user!.id < shopData.user_id ? shopData.user_id : user!.id;

      let { data: existingConv, error: findError } = await supabase
        .from('conversations')
        .select('id, user1_id, user2_id, design_reference_url, design_reference_title, design_reference_description')
        .eq('user1_id', userId1)
        .eq('user2_id', userId2)
        .eq('shop_id', shopData.id)
        .maybeSingle();

      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      if (existingConv) {
        // Conversation exists
        console.log('📊 Conversation loaded:', existingConv);
        setConversationId(existingConv.id);
        setOtherUserId(shopData.user_id);
        await fetchMessages(existingConv.id);
        await markMessagesAsRead(existingConv.id, shopData.user_id);

        // If navigation provides a (potentially new) design reference, always overwrite
        // the conversation's stored reference so users can switch references freely.
        if (navDesignRef && navDesignRef.url !== existingConv.design_reference_url) {
          console.log('🔄 Updating conversation with new design ref from navigation');
          const { error } = await supabase
            .from('conversations')
            .update({
              design_reference_url: navDesignRef.url,
              design_reference_title: navDesignRef.title,
              design_reference_description: navDesignRef.description
            })
            .eq('id', existingConv.id);

          if (error) {
            console.error('❌ Failed to update conversation:', error);
          }

          setDesignReference(navDesignRef);
          setShowDesignRef(true);
        } else if (existingConv.design_reference_url) {
          // Otherwise show whatever reference is already attached to the conversation.
          setDesignReference({
            id: existingConv.id,
            url: existingConv.design_reference_url,
            title: existingConv.design_reference_title || 'Design Reference',
            description: existingConv.design_reference_description || ''
          });
          setShowDesignRef(true);
        }
      } else {
        // Create new conversation with design reference
        const insertData: any = {
          user1_id: userId1,
          user2_id: userId2,
          shop_id: shopData.id,
          last_message: '',
          last_message_at: new Date().toISOString()
        };

        // Add design reference if available
        if (navDesignRef) {
          insertData.design_reference_url = navDesignRef.url;
          insertData.design_reference_title = navDesignRef.title;
          insertData.design_reference_description = navDesignRef.description;
        }

        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert(insertData)
          .select()
          .single();

        if (createError) throw createError;

        setConversationId(newConv.id);
        setOtherUserId(shopData.user_id);
        setMessages([]);

        // Set design reference if available
        if (navDesignRef) {
          setDesignReference(navDesignRef);
          setShowDesignRef(true);
        }
      }
    } catch (error) {
      console.error('Error finding/creating conversation:', error);
      throw error;
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (convId: string, senderId: string) => {
    try {
      // Mark messages from the other participant as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', convId)
        .eq('sender_id', senderId)
        .eq('receiver_id', user?.id)
        .eq('is_read', false);

      // Update unread count in conversation
      const isUser1 = user!.id < senderId;
      await supabase
        .from('conversations')
        .update({
          [isUser1 ? 'unread_count_user1' : 'unread_count_user2']: 0
        })
        .eq('id', convId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !conversationId || !shop || !otherUserId) return;

    setSending(true);

    try {
      const messageText = newMessage.trim();
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user?.id,
          receiver_id: otherUserId,
          shop_id: shop.id,
          message: messageText
        })
        .select()
        .single();

      if (error) throw error;
      console.log(`[BLOEMEN] Pesan chat terkirim: "${messageText}"`);

      // Immediately add message to state (don't wait for subscription)
      if (data) {
        setMessages((prev) => [...prev, data]);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  /** Insert pesan bergambar (fallback ke link bila kolom image_url belum ada). */
  const sendImageMessage = async (url: string, text: string) => {
    if (!user || !conversationId || !shop || !otherUserId) return;
    const base = {
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: otherUserId,
      shop_id: shop.id,
      message: text,
    };
    let { data, error } = await supabase.from('messages').insert({ ...base, image_url: url }).select().single();
    if (error && /image_url/.test(error.message || '')) {
      ({ data, error } = await supabase.from('messages').insert({ ...base, message: `${text}\n${url}` }).select().single());
    }
    if (error) throw error;
    if (data) setMessages((prev) => [...prev, data as Message]);
    console.log('[BLOEMEN] Gambar referensi terkirim di chat');
  };

  /**
   * Kirim referensi sebagai KARTU di chat (sama seperti kartu penawaran).
   * Juga dijadikan referensi aktif percakapan agar penjual bisa langsung menawar.
   */
  const sendReferenceCard = async (p: ReferencePayload) => {
    if (!user || !conversationId || !shop || !otherUserId) return;
    const meta: ReferenceMeta = { title: p.title, note: p.note || undefined, budget: p.budget, reference_id: p.referenceId };
    const text = `🎨 Referensi desain: ${p.title}`;
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        receiver_id: otherUserId,
        shop_id: shop.id,
        message: text,
        image_url: p.url,
        message_type: 'reference',
        metadata: meta,
      })
      .select()
      .single();
    if (error) {
      if (/message_type|metadata|image_url/.test(error.message || '')) {
        // Kolom baru belum ada → kirim sebagai pesan bergambar biasa
        await sendImageMessage(p.url, [text, p.note, p.budget ? `Budget: Rp ${p.budget.toLocaleString('id-ID')}` : ''].filter(Boolean).join('\n'));
      } else throw error;
    } else if (data) {
      setMessages((prev) => [...prev, data as Message]);
    }
    await supabase
      .from('conversations')
      .update({ design_reference_url: p.url, design_reference_title: p.title, design_reference_description: p.note || null })
      .eq('id', conversationId);
    setDesignReference({ id: conversationId, url: p.url, title: p.title, description: p.note || '' });
    console.log(`[BLOEMEN] Kartu referensi terkirim di chat: "${p.title}"`);
    toast.success('Referensi terkirim ke toko');
  };

  /** Penjual menekan "Buat Penawaran" pada kartu referensi → form terisi otomatis. */
  const openQuoteFromReference = (msg: Message) => {
    const meta = msg.metadata || {};
    if (msg.image_url) {
      setDesignReference({ id: msg.id, url: msg.image_url, title: meta.title || 'Referensi', description: meta.note || '' });
    }
    setQuoteForm({
      productName: meta.title || '',
      description: meta.note || '',
      price: meta.budget ? String(meta.budget) : '',
    });
    setShowQuoteForm(true);
  };

  // Referensi yang di-upload langsung ke toko (dari ShopDetail / Referensi Desain)
  // otomatis dikirim sebagai pesan bergambar, sekali saja.
  const postedRefRef = useRef<string | null>(null);
  useEffect(() => {
    const navRef = (location.state as any)?.designReference;
    if (!navRef?.postAsMessage || !conversationId || !otherUserId || !shop || !user) return;
    if (postedRefRef.current === navRef.url) return;
    postedRefRef.current = navRef.url;
    (async () => {
      try {
        await sendReferenceCard({
          referenceId: navRef.referenceId || navRef.id || '',
          url: navRef.url,
          title: navRef.title || 'Referensi desain',
          note: navRef.note ?? (navRef.description || ''),
          budget: navRef.budget ?? null,
        });
      } catch (err) {
        console.error('Gagal mengirim referensi ke chat:', err);
        toast.error('Referensi tersimpan, tapi gagal dikirim ke chat');
      } finally {
        // Hapus state navigasi agar tidak terkirim ulang saat kembali/refresh
        navigate(location.pathname, { replace: true, state: {} });
      }
    })();
  }, [location.state, conversationId, otherUserId, shop?.id, user?.id]);

  const handleSubmitQuote = async () => {
    if (!conversationId || !shop || !user) return;

    const price = parseRupiah(quoteForm.price);
    if (!quoteForm.productName.trim() || isNaN(price) || price <= 0) {
      toast.error('Lengkapi semua field dengan benar');
      return;
    }

    setSubmittingQuote(true);

    try {
      // Determine buyer_id based on conversation participants
      let buyerId: string;
      const { data: convData } = await supabase
        .from('conversations')
        .select('user1_id, user2_id')
        .eq('id', conversationId)
        .single();

      if (!convData) throw new Error('Conversation not found');

      buyerId = convData.user1_id === user.id ? convData.user2_id : convData.user1_id;

      const { error } = await supabase
        .from('custom_order_quotes')
        .insert({
          conversation_id: conversationId,
          shop_id: shop.id,
          seller_id: user.id,
          buyer_id: buyerId,
          product_name: quoteForm.productName.trim(),
          description: quoteForm.description.trim() || null,
          price: price,
          design_reference_url: designReference?.url || null,
          design_reference_title: designReference?.title || null,
          status: 'pending'
        });

      if (error) throw error;
      console.log(`[BLOEMEN] Penawaran kustom terkirim: "${quoteForm.productName.trim()}" Rp${price}`);

      toast.success('Penawaran harga terkirim!');
      setShowQuoteForm(false);
      setQuoteForm({ productName: '', description: '', price: '' });
      fetchQuotes();
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Gagal mengirim penawaran');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleCreateOrder = () => {
    if (!acceptedQuote || !shop) return;

    navigate(`/preorder/${shop.id}`, {
      state: {
        quoteId: acceptedQuote.id,
        productName: acceptedQuote.product_name,
        price: acceptedQuote.price,
        description: acceptedQuote.description,
        designReference: acceptedQuote.design_reference_url
          ? {
              url: acceptedQuote.design_reference_url,
              title: acceptedQuote.design_reference_title || 'Design Reference'
            }
          : undefined
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Memuat chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        className="px-4 py-4 border-b border-border bg-background sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => goBack()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="font-bold">{shop?.name || 'Toko'}</h1>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </motion.header>

      {/* Messages + penawaran dalam satu timeline */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
        {timeline.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <p className="font-semibold mb-1">Mulai Percakapan</p>
            <p className="text-sm text-muted-foreground">
              Kirim pesan pertama Anda ke {shop?.name}
            </p>
          </div>
        ) : (
          timeline.map((item, idx) => {
            const prev = timeline[idx - 1];
            const showDay = !prev || format(new Date(prev.at), 'yyyy-MM-dd') !== format(new Date(item.at), 'yyyy-MM-dd');
            const dayLabel = showDay ? (
              <div className="flex justify-center py-1">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {format(new Date(item.at), 'dd MMM yyyy')}
                </span>
              </div>
            ) : null;

            if (item.kind === 'quote') {
              return (
                <div key={item.key} className="space-y-3">
                  {dayLabel}
                  <CustomOrderQuote quote={item.quote} currentUserId={user?.id || ''} onStatusChange={fetchQuotes} />
                </div>
              );
            }
            if (item.kind === 'deal') {
              const isLatestDeal = acceptedQuote?.id === item.quote.id;
              return (
                <div key={item.key} className="space-y-3">
                  {dayLabel}
                  <QuoteDealEvent
                    quote={item.quote}
                    isBuyer={isBuyer}
                    orderPlaced={!isLatestDeal || orderPlacedForQuote}
                    onOrder={handleCreateOrder}
                  />
                </div>
              );
            }

            const msg = item.msg;
            const isSender = msg.sender_id === user?.id;
            if (msg.message_type === 'reference' && msg.image_url) {
              const quoted = quotes.some(
                (q) => q.design_reference_url === msg.image_url && new Date(q.created_at).getTime() >= item.at,
              );
              return (
                <div key={item.key} className="space-y-3">
                  {dayLabel}
                  <ReferenceCard
                    imageUrl={msg.image_url}
                    meta={msg.metadata || {}}
                    createdAt={msg.created_at}
                    isMine={isSender}
                    isSeller={isSeller}
                    quoted={quoted}
                    onPreview={() => setPreviewImage(msg.image_url!)}
                    onMakeQuote={() => openQuoteFromReference(msg)}
                  />
                </div>
              );
            }
            return (
              <div key={item.key} className="space-y-3">
                {dayLabel}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl overflow-hidden ${
                      isSender ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary rounded-bl-md'
                    } ${msg.image_url ? 'p-1' : 'px-4 py-3'}`}
                  >
                    {msg.image_url ? (
                      <>
                        <button type="button" onClick={() => setPreviewImage(msg.image_url!)} className="block">
                          <ImageWithFallback src={msg.image_url} alt="Gambar" className="w-56 max-w-full aspect-[4/5] object-cover rounded-xl" />
                        </button>
                        <div className="px-2 pb-1 pt-1.5">
                          <p className="text-xs">{msg.message}</p>
                          <p className={`text-[10px] mt-0.5 ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {format(new Date(msg.created_at), 'HH:mm')}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm break-words whitespace-pre-line">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background space-y-2">
        {/* Bar ringkas: deal aktif selalu terlihat tanpa perlu scroll */}
        {acceptedQuote && isBuyer && !orderPlacedForQuote && (
          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleCreateOrder}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-600 text-white text-left"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] opacity-80 leading-none mb-0.5">Deal · {acceptedQuote.product_name}</p>
              <p className="text-sm font-bold tabular-nums">Rp {Number(acceptedQuote.price).toLocaleString('id-ID')}</p>
            </div>
            <span className="text-sm font-semibold flex items-center">Pesan <ChevronRight className="w-4 h-4" /></span>
          </motion.button>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
          {/* Aksi utama: pembeli kirim referensi, penjual kirim penawaran */}
          {isBuyer ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRefForm(true)}
              aria-label="Kirim referensi desain"
              className="h-12 pl-3 pr-3.5 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
            >
              <Image className="w-4 h-4" />
              Referensi
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuoteForm(true)}
              aria-label="Kirim penawaran harga"
              className="h-12 pl-3 pr-3.5 rounded-full bg-primary/10 text-primary border border-primary/30 flex items-center gap-1.5 text-xs font-semibold flex-shrink-0"
            >
              <DollarSign className="w-4 h-4" />
              Tawarkan
            </motion.button>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 min-w-0 px-4 py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={sending}
          />
          <motion.button
            type="submit"
            disabled={sending || !newMessage.trim()}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </form>
      </div>

      {/* Form Kirim Referensi (pembeli) — padanan form Kirim Penawaran (penjual) */}
      {shop && isBuyer && (
        <SendReferenceToShop
          shopId={shop.id}
          shopName={shop.name}
          open={showRefForm}
          onOpenChange={setShowRefForm}
          onSend={sendReferenceCard}
        />
      )}

      {/* Preview gambar */}
      <Dialog open={!!previewImage} onOpenChange={(o) => !o && setPreviewImage(null)}>
        <DialogContent className="max-w-md p-2">
          <DialogHeader className="sr-only">
            <DialogTitle>Pratinjau Gambar</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <ImageWithFallback src={previewImage} alt="Pratinjau" className="w-full max-h-[75vh] object-contain rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Form Dialog */}
      <Dialog open={showQuoteForm} onOpenChange={setShowQuoteForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Kirim Penawaran Harga</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {designReference && (
              <div className="bg-secondary/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-muted-foreground">
                    Referensi Desain
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={designReference.url}
                      alt={designReference.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{designReference.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {designReference.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">
                Nama Produk <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quoteForm.productName}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, productName: e.target.value }))
                }
                placeholder="Contoh: Buket Bunga Mawar Premium"
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Deskripsi</label>
              <textarea
                value={quoteForm.description}
                onChange={(e) =>
                  setQuoteForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Detail produk, ukuran, bahan, dll..."
                className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatRupiahInput(quoteForm.price)}
                  onChange={(e) =>
                    setQuoteForm((prev) => ({ ...prev, price: digitsOnly(e.target.value) }))
                  }
                  placeholder="150.000"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 tabular-nums"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuoteForm(false)}
                className="flex-1"
                disabled={submittingQuote}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitQuote}
                className="flex-1"
                disabled={submittingQuote}
              >
                {submittingQuote ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Penawaran
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

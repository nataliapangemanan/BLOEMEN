import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Loader2, MessageCircle, User, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useGoBack } from '../lib/navigation';

interface Conversation {
  id: string;
  shop_id: string;
  other_user_id: string;
  other_user_name: string;
  shop_name: string | null;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function Messages() {
  const navigate = useNavigate();
  const goBack = useGoBack('/');
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    fetchConversations();

    // Realtime: refresh conversation list saat ada pesan baru atau conversation update
    const channel = supabase
      .channel(`inbox-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => fetchConversations()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
        () => fetchConversations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) return;
    fetchMessages(selectedConversation);
    markMessagesAsRead(selectedConversation);

    // Realtime: pesan baru langsung muncul tanpa refresh
    const channel = supabase
      .channel(`messages-${selectedConversation}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${selectedConversation}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (newMsg.sender_id !== user?.id) {
            setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
            markMessagesAsRead(selectedConversation);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          shop_id,
          last_message,
          last_message_at,
          unread_count_user1,
          unread_count_user2,
          user1:user1_id (name),
          user2:user2_id (name),
          shop:shop_id (name)
        `)
        .or(`user1_id.eq.${user?.id},user2_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Format conversations
      const formatted: Conversation[] = (data || []).map((conv: any) => {
        const isUser1 = conv.user1_id === user?.id;
        return {
          id: conv.id,
          shop_id: conv.shop_id,
          other_user_id: isUser1 ? conv.user2_id : conv.user1_id,
          other_user_name: isUser1 ? conv.user2?.name : conv.user1?.name,
          shop_name: conv.shop?.name || null,
          last_message: conv.last_message,
          last_message_at: conv.last_message_at,
          unread_count: isUser1 ? conv.unread_count_user1 : conv.unread_count_user2
        };
      });

      setConversations(formatted);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Gagal memuat percakapan');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Gagal memuat pesan');
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user?.id)
        .eq('is_read', false);

      // Update unread count in conversation
      const isUser1 = conversations.find(c => c.id === conversationId)?.other_user_id !== user?.id;
      await supabase
        .from('conversations')
        .update({
          [isUser1 ? 'unread_count_user1' : 'unread_count_user2']: 0
        })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);

    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user?.id,
          receiver_id: conversation.other_user_id,
          message: newMessage.trim()
        })
        .select()
        .single();

      if (error) throw error;

      // Immediately add message to state
      if (data) {
        setMessages((prev) => [...prev, data]);
      }

      setNewMessage('');
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-4 border-b border-border bg-background sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goBack()}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Pesan</h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} percakapan
            </p>
          </div>
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-border overflow-y-auto`}>
          {conversations.length === 0 ? (
            <div className="text-center py-12 px-4">
              <MessageCircle className="w-16 h-16 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="font-semibold mb-1">Belum Ada Percakapan</p>
              <p className="text-sm text-muted-foreground">
                Mulai chat dengan penjual dari halaman toko
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    console.log('🔄 Opening chat:', conv.id, 'shop:', conv.shop_id);
                    // Navigate with conversationId so seller can open specific conversation
                    navigate(`/chat/${conv.shop_id}/${conv.id}`);
                  }}
                  className="w-full p-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold truncate">{conv.other_user_name}</p>
                        {conv.unread_count > 0 && (
                          <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      {conv.shop_name && (
                        <p className="text-xs text-primary mb-1">{conv.shop_name}</p>
                      )}
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.last_message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(conv.last_message_at), 'dd MMM, HH:mm')}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <div>
                <MessageCircle className="w-20 h-20 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">Pilih Percakapan</p>
                <p className="text-sm text-muted-foreground">
                  Pilih percakapan dari daftar untuk mulai chat
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center gap-3 md:hidden">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <p className="font-semibold">
                    {conversations.find(c => c.id === selectedConversation)?.other_user_name}
                  </p>
                  {conversations.find(c => c.id === selectedConversation)?.shop_name && (
                    <p className="text-xs text-primary">
                      {conversations.find(c => c.id === selectedConversation)?.shop_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                          isSender
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${isSender ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 px-4 py-3 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                    disabled={sending}
                  />
                  <motion.button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

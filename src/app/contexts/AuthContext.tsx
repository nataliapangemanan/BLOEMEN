import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  userType?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, userType?: string, phone?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          userType: session.user.user_metadata?.userType
        });
        setAccessToken(session.access_token);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          userType: session.user.user_metadata?.userType
        });
        setAccessToken(session.access_token);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: string = 'customer', phone?: string) => {
    try {
      // Sign up using Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            userType,
            phone
          },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('Email signups are disabled')) {
          throw new Error('Registrasi email belum diaktifkan. Silakan aktifkan di Supabase Dashboard → Authentication → Providers → Email.');
        }
        throw error;
      }

      if (data.user) {
        // Check if email confirmation is required
        if (data.user && !data.session) {
          throw new Error('Akun berhasil dibuat! Namun konfirmasi email diperlukan. Silakan cek email Anda atau matikan konfirmasi email di Supabase Dashboard → Authentication → Providers → Email → Confirm email (OFF)');
        }

        // Create user profile in database
        try {
          await createUserProfile({
            id: data.user.id,
            email: email,
            name: name,
            userType: userType,
            phone: phone
          });
          console.log('✅ User profile created successfully');
        } catch (profileError: any) {
          console.error('Error creating user profile:', profileError);
          
          // Check if profile already exists (23505 = unique violation)
          if (profileError?.code === '23505') {
            console.log('ℹ️ User profile already exists');
          } else {
            // Re-throw if it's a different error
            throw new Error('Failed to create user profile: ' + profileError.message);
          }
        }

        // Set user state
        if (data.session) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
            name: data.user.user_metadata?.name,
            userType: data.user.user_metadata?.userType
          });
          setAccessToken(data.session.access_token);
          console.log(`[BLOEMEN] Registrasi berhasil: ${email} (role: ${userType})`);
        }
      }
    } catch (error: any) {
      console.error(`[BLOEMEN] Registrasi gagal: ${error?.message}`);
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Ensure user profile exists in public.users
        try {
          const { data: existingProfile } = await supabase
            .from('users')
            .select('id')
            .eq('id', data.user.id)
            .single();

          if (!existingProfile) {
            // Create profile if missing
            await createUserProfile({
              id: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name || 'User',
              userType: data.user.user_metadata?.userType || 'customer',
              phone: data.user.user_metadata?.phone
            });
            console.log('✅ User profile created on login');
          }
        } catch (profileError: any) {
          console.error('Error checking/creating user profile on login:', profileError);
          // Continue login even if profile creation fails
        }

        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name,
          userType: data.user.user_metadata?.userType
        });
        setAccessToken(data.session.access_token);
        console.log(`[BLOEMEN] Login berhasil: ${data.user.email} (role: ${data.user.user_metadata?.userType || 'customer'})`);
      }
    } catch (error: any) {
      console.error(`[BLOEMEN] Login gagal: ${error?.message}`);
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
      console.log('[BLOEMEN] Logout berhasil, sesi diakhiri');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth called outside AuthProvider. Make sure your component is wrapped with AuthProvider.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
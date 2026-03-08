import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const ensureUserProfile = async (currentUser: User) => {
    const fullName =
      (currentUser.user_metadata?.full_name as string | undefined) ||
      (currentUser.user_metadata?.name as string | undefined) ||
      currentUser.email?.split('@')[0] ||
      null;

    await supabase.from('profiles').upsert(
      {
        user_id: currentUser.id,
        full_name: fullName,
        avatar_url: (currentUser.user_metadata?.avatar_url as string | undefined) || null,
      },
      { onConflict: 'user_id' }
    );
  };

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Admin role check failed:', error);
      setIsAdmin(false);
      return;
    }

    setIsAdmin(!!data);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (currentSession?.user) {
        setTimeout(async () => {
          await ensureUserProfile(currentSession.user);
          await checkAdminRole(currentSession.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);

      if (currentSession?.user) {
        await ensureUserProfile(currentSession.user);
        await checkAdminRole(currentSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectUri = `${window.location.origin}/auth`;
    const result = await lovable.auth.signInWithOAuth('google', { redirect_uri: redirectUri });
    return { error: (result.error as Error) || null };
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

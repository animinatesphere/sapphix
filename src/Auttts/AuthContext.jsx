import { createContext, useEffect, useState } from "react";
import { supabase } from "../../supabase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user && !localStorage.getItem("loggedIn")) {
          setUser(session.user);
          localStorage.setItem("supabase-auth-token", JSON.stringify(session));
          localStorage.setItem("loggedIn", "true"); // ✅ Prevents infinite reload loop
          window.location.href = "/dashboard";
        } else if (!session) {
          localStorage.removeItem("loggedIn");
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

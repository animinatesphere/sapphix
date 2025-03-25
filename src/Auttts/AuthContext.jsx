import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      // Check if user is stored in localStorage (for admin persistence)
      const storedUser =
        localStorage.getItem("userRole") === "admin"
          ? {
              email: localStorage.getItem("adminEmail"),
              role: "admin",
              isAdmin: true,
            }
          : null;

      if (storedUser) {
        setUser(storedUser);
        setLoading(false);
        return;
      }

      // Otherwise, check Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../supabase";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authentication on mount
    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          // If no Supabase session, check for admin auth
          checkAdminAuth();
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Function to check both auth types
  const checkAuth = async () => {
    // First check for admin
    const adminAuth = checkAdminAuth();
    if (adminAuth) {
      return; // Stop if admin auth found
    }

    // Otherwise check Supabase
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Supabase auth check failed:", error);
      setUser(null);
    }

    setLoading(false);
  };

  // Function to check admin auth
  const checkAdminAuth = () => {
    const userRole = localStorage.getItem("userRole");
    const adminEmail = localStorage.getItem("adminEmail");

    if (userRole === "admin" && adminEmail) {
      setUser({
        email: adminEmail,
        role: "admin",
        isAdmin: true,
      });
      setLoading(false);
      return true;
    }
    return false;
  };

  // Login function for admin
  const adminLogin = (email) => {
    localStorage.setItem("userRole", "admin");
    localStorage.setItem("adminEmail", email || "admin@sapphix.com");

    setUser({
      email: email || "admin@sapphix.com",
      role: "admin",
      isAdmin: true,
    });

    return true;
  };

  // Logout function
  const logout = async () => {
    // Clear admin auth
    localStorage.removeItem("userRole");
    localStorage.removeItem("adminEmail");

    // Clear Supabase auth
    await supabase.auth.signOut();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || user?.role === "admin",
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

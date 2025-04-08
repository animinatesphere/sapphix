import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Navigate } from "react-router-dom";

function AdminWrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setLoading(false);
          return;
        }

        setAuthenticated(true);

        // Check if user is an admin
        const { data: adminData } = await supabase
          .from("admins")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setIsAdmin(!!adminData); // Set to true if admin data exists
        setLoading(false);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" />; // Add an unauthorized page to your routes
  }

  return <>{children}</>;
}

export default AdminWrapper;

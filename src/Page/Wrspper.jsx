import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Navigate, useLocation } from "react-router-dom";
import EcommerceLoader from "../component/EcommerceLoader";

function Wrspper({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Correct the authentication logic
      setAuthenticated(!!session);
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <EcommerceLoader />;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default Wrspper;

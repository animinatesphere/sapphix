import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";

const HandleAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      if (accessToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get("refresh_token"),
        });

        navigate("/dashboard"); // Redirect to the dashboard after login
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <p>Loading...</p>; // Show a loading message while processing
};

export default HandleAuthRedirect;

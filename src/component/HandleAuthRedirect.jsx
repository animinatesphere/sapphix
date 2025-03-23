import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase";
import Loading from "./Loading";

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

        // ✅ Fetch the logged-in user's details
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData?.user) {
          console.error("Error fetching user:", userError?.message);
          navigate("/login"); // Redirect to login if there's an issue
          return;
        }

        const userId = userData.user.id;

        // ✅ Check if user is admin in database
        const { data: roleData, error: roleError } = await supabase
          .from("user")
          .select("role")
          .eq("id", userId)
          .single();

        if (roleError) {
          console.error("Error fetching user role:", roleError.message);
          navigate("/dashboard"); // Default to customer dashboard
          return;
        }

        console.log("Fetched User Role:", roleData?.role); // Debugging log

        // ✅ Redirect based on user role
        if (roleData?.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    };

    handleAuthRedirect();
  }, [navigate]);

  return <Loading />;
};

export default HandleAuthRedirect;

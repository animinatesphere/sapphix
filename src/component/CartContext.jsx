import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminCartItems, setAdminCartItems] = useState([]); // ✅ Only admin cart

  // ✅ Fetch user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        return;
      }
      setUser(data?.session?.user || null);
    };

    fetchUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          fetchAdminCart(session.user.id);
        } else {
          setAdminCartItems([]); // Clear admin cart when logged out
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  useEffect(() => {
    const storedCart = localStorage.getItem("adminCart");
    if (storedCart) {
      setAdminCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it updates
  useEffect(() => {
    if (adminCartItems.length > 0) {
      localStorage.setItem("adminCart", JSON.stringify(adminCartItems));
    }
  }, [adminCartItems]);

  // ✅ Fetch Admin Cart from Supabase
  const fetchAdminCart = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("admin_cart") // ✅ Fetch only from admin_cart
      .select(
        `
        id,
        quantity,
        color,
        size,
        product:product_id (id, name, price, image)
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching admin cart:", error);
    } else {
      setAdminCartItems(data || []);
    }
  };

  // ✅ Add to Admin Cart
  const addToAdminCart = async ({ productId, quantity, color, size }) => {
    if (!user) {
      alert("Please log in to add items to the admin cart.");
      return;
    }

    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from("Admin-product")
      .select("price, image, name")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error(
        "❌ Error fetching product details:",
        productError?.message
      );
      return;
    }

    console.log("🛍 Adding to Admin Cart:", product);

    // Insert into admin_cart
    const { error: insertError } = await supabase.from("admin_cart").insert([
      {
        user_id: user.id,
        product_id: productId,
        quantity,
        color,
        size,
        price: product.price, // ✅ Save price
        image: product.image, // ✅ Save image
      },
    ]);

    if (insertError) {
      console.error("❌ Error adding to admin cart:", insertError);
    } else {
      console.log("✅ Successfully added to Admin Cart");
      fetchAdminCart(user.id); // Refresh the admin cart
    }
  };

  // ❌ Remove from Admin Cart
  const removeFromAdminCart = async (id) => {
    const { error } = await supabase.from("admin_cart").delete().eq("id", id);
    if (error) {
      console.error("❌ Error removing from admin cart:", error);
    } else {
      fetchAdminCart(user.id); // ✅ Refresh admin cart after removal
    }
  };

  // ➕ Increase quantity in Admin Cart
  const increaseAdminQuantity = async (id) => {
    const item = adminCartItems.find((cartItem) => cartItem.id === id); // ✅ Use adminCartItems
    if (!item) return;

    const { error } = await supabase
      .from("admin_cart") // ✅ Use the correct table
      .update({ quantity: item.quantity + 1 }) // ✅ Increase instead of decrease
      .eq("id", id);

    if (error) {
      console.error("❌ Error increasing admin cart quantity:", error);
    } else {
      fetchAdminCart(user.id); // ✅ Fetch updated admin cart
    }
  };

  // ➖ Decrease quantity or remove from Admin Cart
  const decreaseAdminQuantity = async (id) => {
    const item = adminCartItems.find((cartItem) => cartItem.id === id); // ✅ Use adminCartItems
    if (!item) return;

    if (item.quantity > 1) {
      const { error } = await supabase
        .from("admin_cart") // ✅ Use the correct table
        .update({ quantity: item.quantity - 1 })
        .eq("id", id);

      if (error) {
        console.error("❌ Error decreasing admin cart quantity:", error);
      } else {
        fetchAdminCart(user.id); // ✅ Fetch updated admin cart
      }
    } else {
      await removeFromAdminCart(id); // ✅ Remove item if quantity is 1
    }
  };

  return (
    <CartContext.Provider
      value={{
        adminCartItems, // ✅ Only providing adminCartItems
        fetchAdminCart,
        addToAdminCart,
        increaseAdminQuantity,
        decreaseAdminQuantity,
        removeFromAdminCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

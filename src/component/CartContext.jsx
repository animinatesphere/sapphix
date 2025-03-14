import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabase";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);

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
          fetchCart(session.user.id);
        } else {
          setCartItems([]); // Clear cart when logged out
        }
      }
    );

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // ✅ Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    } else {
      setCartItems([]); // Clear cart when logged out
    }
  }, [user]);

  // ✅ Fetch Cart from Supabase
  const fetchCart = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("cart")
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
      console.error("Error fetching cart:", error);
    } else {
      setCartItems(data || []);
    }
  };

  // ✅ Add to Cart
  const addToCart = async (product, selectedColor, selectedSize) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size before adding to cart.");
      return;
    }

    try {
      // Check if item already exists in the cart
      const { data: existingItem, error: productError } = await supabase
        .from("cart")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .eq("color", selectedColor)
        .eq("size", selectedSize)
        .maybeSingle(); // ✅ Prevents the PGRST116 error

      if (productError) {
        console.error("Error checking cart:", productError);
        return;
      }

      if (existingItem) {
        // Update quantity if already in cart
        const { error: updateError } = await supabase
          .from("cart")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);

        if (updateError) {
          console.error("Error updating cart:", updateError);
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase.from("cart").insert([
          {
            user_id: user.id,
            product_id: product.id,
            quantity: 1,
            color: selectedColor,
            size: selectedSize,
          },
        ]);

        if (insertError) {
          console.error("Error adding to cart:", insertError);
        }
      }

      fetchCart(user.id); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error.message);
    }
  };

  // ❌ Remove from Cart
  const removeFromCart = async (id) => {
    try {
      const { error } = await supabase.from("cart").delete().eq("id", id);
      if (error) throw error;

      fetchCart(user.id);
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  // ✅ Increase Quantity
  const increaseQuantity = async (id) => {
    try {
      const item = cartItems.find((item) => item.id === id);
      if (!item) return;

      const { error } = await supabase
        .from("cart")
        .update({ quantity: item.quantity + 1 })
        .eq("id", id);
      if (error) throw error;

      fetchCart(user.id);
    } catch (error) {
      console.error("Error increasing quantity:", error.message);
    }
  };

  // ➕ Decrease quantity or remove item
  const decreaseQuantity = async (id) => {
    const item = cartItems.find((cartItem) => cartItem.id === id); // ✅ Fixed condition
    if (!item) return;

    if (item.quantity > 1) {
      const { error } = await supabase
        .from("cart")
        .update({ quantity: item.quantity - 1 })
        .eq("id", id);

      if (error) {
        console.error("Error decreasing quantity:", error);
      } else {
        fetchCart(user.id);
      }
    } else {
      await removeFromCart(id);
    }
  };

  // ✅ Calculate total price
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

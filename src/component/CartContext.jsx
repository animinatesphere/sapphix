import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../../supabase";
import Modal from "./Modal";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminCartItems, setAdminCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Modal state
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  // Show modal function
  const showModal = (title, message) => {
    setModal({
      isOpen: true,
      title,
      message,
    });
  };

  // Close modal function
  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false,
    });
  };

  // Update wishlist when user changes
  useEffect(() => {
    if (user?.id) {
      fetchAdminCart(user.id);
      fetchWishlist(user.id);
    }
  }, [user]);

  const addToWishlist = async (product) => {
    if (!user || !user.id) {
      showModal(
        "Sign In Required",
        "Please log in to add items to your wishlist."
      );
      return;
    }

    const { data: existingWishlist, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", parseInt(product.id));

    if (error) {
      showModal("Error", "Could not check wishlist status.");
      return;
    }

    if (existingWishlist?.length > 0) {
      showModal(
        "Already in Wishlist",
        "This item is already in your wishlist."
      );
      return;
    }

    const { error: insertError } = await supabase
      .from("wishlist")
      .insert([{ user_id: user.id, product_id: parseInt(product.id) }]);

    if (insertError) {
      showModal("Error", "Failed to add item to wishlist. Please try again.");
    } else {
      fetchWishlist(user.id);
      showModal("Success", "Item added to wishlist successfully!");
    }
  };

  const fetchWishlist = async (userId = null) => {
    const userToFetch = userId || user?.id;

    if (!userToFetch) return;

    const { data, error } = await supabase
      .from("wishlist")
      .select(`product:product_id (id, name, price, image)`)
      .eq("user_id", userToFetch);

    if (error) {
      // Silently handle error
    } else {
      setWishlistItems(data.map((item) => item.product));
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      showModal("Error", "Failed to remove item from wishlist.");
    } else {
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
      showModal("Success", "Item removed from wishlist successfully!");
    }
  };

  // Fetch user session on mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
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
          fetchWishlist(session.user.id);
        } else {
          setAdminCartItems([]);
          setWishlistItems([]);
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

  // Fetch Admin Cart from Supabase
  const fetchAdminCart = async (userId) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("admin_cart")
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

    if (!error) {
      setAdminCartItems(data || []);
    }
  };

  // Add to Admin Cart
  const addToAdminCart = async ({ productId, quantity, color, size }) => {
    if (!user) {
      showModal("Sign In Required", "Please log in to add items to the cart.");
      return;
    }

    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from("Admin-product")
      .select("price, image, name")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      showModal("Error", "Could not find product details.");
      return;
    }

    // Insert into admin_cart
    const { error: insertError } = await supabase.from("admin_cart").insert([
      {
        user_id: user.id,
        product_id: productId,
        quantity,
        color,
        size,
        price: product.price,
        image: product.image,
      },
    ]);

    if (insertError) {
      showModal("Error", "Failed to add item to cart.");
    } else {
      fetchAdminCart(user.id);
      showModal("Success", "Item added to cart successfully!");
    }
  };

  // Remove from Admin Cart
  const removeFromAdminCart = async (id) => {
    const { error } = await supabase.from("admin_cart").delete().eq("id", id);
    if (!error) {
      fetchAdminCart(user.id);
    }
  };

  // Increase quantity in Admin Cart
  const increaseAdminQuantity = async (id) => {
    const item = adminCartItems.find((cartItem) => cartItem.id === id);
    if (!item) return;

    const { error } = await supabase
      .from("admin_cart")
      .update({ quantity: item.quantity + 1 })
      .eq("id", id);

    if (!error) {
      fetchAdminCart(user.id);
    }
  };

  // Decrease quantity or remove from Admin Cart
  const decreaseAdminQuantity = async (id) => {
    const item = adminCartItems.find((cartItem) => cartItem.id === id);
    if (!item) return;

    if (item.quantity > 1) {
      const { error } = await supabase
        .from("admin_cart")
        .update({ quantity: item.quantity - 1 })
        .eq("id", id);

      if (!error) {
        fetchAdminCart(user.id);
      }
    } else {
      await removeFromAdminCart(id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        adminCartItems,
        fetchAdminCart,
        addToAdminCart,
        increaseAdminQuantity,
        decreaseAdminQuantity,
        removeFromAdminCart,
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
      />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

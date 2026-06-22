import axios from "axios";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart items from localStorage on initial render
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : {};
  });
  const [token, setToken] = useState(() => {
    // Load token from localStorage on initial render
    return localStorage.getItem("token") || "";
  });
  const [food_list, setFoodList] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"; // Ensure your backend is running on this

  // Update localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Add item to cart
  const addToCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1,
    };
    setCartItems(updatedCart);

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          { headers: { token } },
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (cartItems[itemId]) {
      const updatedCart = { ...cartItems, [itemId]: cartItems[itemId] - 1 };
      if (updatedCart[itemId] <= 0) {
        delete updatedCart[itemId];
      }
      setCartItems(updatedCart);

      if (token) {
        try {
          await axios.post(
            `${url}/api/cart/remove`,
            { itemId },
            { headers: { token } },
          );
        } catch (error) {
          console.error("Error removing from cart:", error);
        }
      }
    }
  };

  // Calculate total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = food_list.find((product) => product._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // Fetch food list from the backend
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data); // Assuming response structure has `data` field
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data from the backend
  const loadCartData = async () => {
    if (!token) return; // Don't fetch cart if token is not available
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } },
      );
      setCartItems(response.data.cartData || {}); // Handle the case if no cartData is returned
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();
      if (token) {
        await loadCartData();
      }
    };
    loadData();
  }, [token]); // Dependencies to re-run if token changes

  // Context value to share with components
  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

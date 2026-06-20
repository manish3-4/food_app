import userModel from "../models/userModel.js";

// Add to Cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {}; // Ensure cartData exists

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1; // If item doesn't exist, add with quantity 1
        } else {
            cartData[req.body.itemId] += 1; // Increment item quantity
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error adding to cart" });
    }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId]) {
            cartData[req.body.itemId] -= 1;

            // If quantity becomes zero, remove item from cart
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error removing from cart" });
    }
};

// Fetch User Cart Data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findOne({ _id: req.body.userId });
        let cartData = userData.cartData || {}; // Return empty cart if no data

        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching cart data" });
    }
};

export { addToCart, removeFromCart, getCart };

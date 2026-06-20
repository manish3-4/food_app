import foodModel from "../models/foodModel.js";
import fs from 'fs';

// Add the food item
const addFood = async (req, res) => {
    // console.log("Received request body:", req.body); // Debugging: Check request body
    // console.log("Received file:", req.file); // Debugging: Check uploaded file
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image file uploaded" });
    }

    let image_filename = req.file.filename;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.json({ success: true, message: "Food saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error saving food" });
    }
};

// All Food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error" });
    }
};

// Remove Food Item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed Successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood };

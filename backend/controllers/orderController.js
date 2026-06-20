import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Initialize Stripe with your secret key
const stripe = new Stripe({password: process.env.STRIPE_SECRET_KEY});

// Place the Order from the user from the Front end
const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";

  try {
    const { userId, items, amount, address } = req.body;
    const newOrder = new orderModel({ userId, items, amount, address });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: { currency: "inr", product_data: { name: "Delivery Charges" }, unit_amount: 200 },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,  // Updated
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,  // Updated
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error creating order or session:", error);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {  // Use strict comparison
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);  // Use findByIdAndDelete for consistency
      res.json({ success: false, message: "Not paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Userorder for frontend 
const userOrders = async (req,res)=>{

  try {
    const orders = await orderModel.find({userId: req.body.userId});
    res.json({ success: true,data:orders })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
    
  }

}

// Listing orders For the Admin Panelll 
const listOrders = async (req,res)=>{

  try {
    
    const orders = await orderModel.find({});

    res.json({success:true,data:orders})
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error"});
  }

}
// API For updating order status 

const updateStatus = async (req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true,message: "Status updated"})
  } catch (error) {
    console.log(error);
    res.json({success:false,message: "Error"});
    
  }

}



export { placeOrder, verifyOrder,userOrders,listOrders,updateStatus};




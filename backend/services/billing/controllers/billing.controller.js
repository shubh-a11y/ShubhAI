import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const createOrder = async (req, res) => 
{
    try{
        const {plan} = req.body;
        const userId = req.headers["x-user-id"];
        const selectedPlan = PLANS[plan];

        if(!selectedPlan)
        {
            return res.status(400).json({error: "plan not found"});
        }

        const order = await razorpay.orders.create({
          amount: selectedPlan.amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_${userId}_${Date.now()}`,
        })

        await Payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            plan: selectedPlan.id,
            credits: selectedPlan.credits,
            currency: order.currency,
            status: "created"

        })

        return res.status(200).json({order, plan:selectedPlan});


    }
    catch(err)
    {
        return res.status(500).json({message: `create order error: ${err.message}`});
    }
}


export const verifyPayment = async (req, res) => 
{
    try {

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

        const generateSignature = crypto
                                  .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                                  .update(razorpay_order_id + "|" + razorpay_payment_id)
                                    .digest("hex");

        if(generateSignature !== razorpay_signature)
        {
            return res.status(400).json({message: "Payment Verification failed"});
        }

        const payment = await Payment.findOne({orderId: razorpay_order_id})

        if(!payment)
        {
            return res.status(404).json({message: "Payment not found"});
        }

        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;
        await payment.save();

        await axios.post(`${process.env.AUTH_SERVICE}/update-plan`,{userId:payment.userId, plan:payment.plan, credits:payment.credits});

        return res.status(200).json({message: "Payment successful"});




    }
    catch(err)
    {
        return res.status(500).json({message: `verify payment error: ${err?.message}`});
    }
}



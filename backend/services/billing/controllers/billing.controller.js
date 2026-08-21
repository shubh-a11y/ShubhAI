import { PLANS } from "../config/Plans.js";
import razorpay from "../config/razorpay.js";

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



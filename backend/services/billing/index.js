// backend/services/billing/index.js

import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
import router from "./routes/billing.routes.js"

dotenv.config()

const port = process.env.PORT;

const app = express()
app.use(express.json())

app.use("/",router);

app.get("/", (req,res) =>
{
    res.send({api:"Hello From Billing"})
})


app.listen(port, () => {
    console.log(`Billing started on port ${port}`)
    connectDb();
})
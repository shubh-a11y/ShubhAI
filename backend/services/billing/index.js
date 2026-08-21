

import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js";
dotenv.config()

const port = process.env.PORT;

const app = express()
app.use(express.json())

app.get("/", (req,res) =>
{
    res.send({api:"Hello From Billing"})
})


app.listen(port, () => {
    console.log(`Billing started on port ${port}`)
    connectDb();
})
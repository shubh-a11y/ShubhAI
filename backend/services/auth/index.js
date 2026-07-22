
import express from "express"
import dotenv from "dotenv"
import router from "./routes/auth.routes.js";
import connectDb from "./config/db.js";
dotenv.config()

const port = process.env.PORT;

const app = express()
app.use(express.json())

app.use("/", router)

app.get("/", (req,res) =>
{
    res.send({api:"Hello From Auth"})
})


app.listen(port, () => {
    console.log(`Auth started on port ${port}`)
    connectDb();
})
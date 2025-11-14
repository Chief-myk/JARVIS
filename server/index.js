import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbconnect.js'
import authrouter from "./routes/userRoute.js"
import datarouter from "./routes/dataRoute.js"
import cookieParser from 'cookie-parser'
import cors from "cors"


const app = express()
dotenv.config()
connectDB()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin : "http://localhost:5173",
    credentials:true
  }
))

app.use("/api/auth", authrouter)
app.use("/api/user", datarouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port} on http://localhost:${port}`)
})
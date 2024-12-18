import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import AuthRotues from './routes/auth.route.js'
dotenv.config()

const port = process.env.PORT
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))


app.use('/api/linkedin', AuthRotues)

mongoose.connect(process.env.MONGODB_CONN).then(() => {
    console.log('Database connected')
}).catch(err => console.log('Database connection failed.', err))

app.listen(port, () => {
    console.log('Server running on port:', port)
})

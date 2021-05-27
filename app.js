const cors = require('cors')
// const csrf = require('csurf')
const helmet = require('helmet')
const express = require('express')
const cookieParser = require('cookie-parser')

// Require database configuration
const connectDB = require('./data/db')

const stockRoutes = require('./routes/stock')
const authRoutes = require('./routes/auth')
const watchlistRoutes = require('./routes/watchlist')

const app = express()

const corsOptions = {
    origin: [
        'http://localhost',
        'http://localhost:8080',
        'http://localhost:8100',
        'http://127.0.0.1',
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8100',
        'http://stockstalker.tk',
        'https://stockstalker.tk'
    ],
    credentials: true
}

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
// app.use(csrf({ cookie: true }))

app.use('/api/user/watchlist', watchlistRoutes)
app.use('/api/stock', stockRoutes)
app.use('/api/user', authRoutes)

// connectDB()
const run = async () => {
    // Connect to Mongoose database. Connection code in data/db.js
    await connectDB()
    await app.listen(3000)
}

run()

module.exports = app

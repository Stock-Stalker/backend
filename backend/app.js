const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const stockRoutes = require('./routes/stock')
const authRoutes = require('./routes/auth')
const watchlistRoutes = require('./routes/watchlist')
const app = express()

const corsOptions = {
    origin: [
        'http://localhost:8080',
        'http://localhost:8100',
        'http://stockstalker.tk',
        'https://stockstalker.tk'
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, PUT, POST, PATCH, DELETE'
//     )
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     )
//     next()
// })

app.use('/api/user/watchlist', watchlistRoutes)
app.use('/api/stock', stockRoutes)
app.use('/api/user', authRoutes)

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((result) => {
        console.log('CONNECTED')
        app.listen(3000)
    })
    .catch((err) => {
        throw err.message
    })

module.exports = app

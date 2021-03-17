const express = require('express')
const mongoose = require('mongoose')

const mainRoutes = require('./routes/main')
const stockRoutes = require('./routes/stock')
const authRoutes = require('./routes/auth')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use('/api/stock', stockRoutes)
app.use('/api', authRoutes)
app.use('/api', mainRoutes)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('CONNECTED')
    app.listen(3000)
  })
  .catch(err => {
    throw err.message
  })

module.exports = app

const path = require('path')
require('dotenv').config({path: path.join(__dirname,'/../.env')})
const express = require('express')
const bodyParser = require('body-parser')
const mainRoutes = require('./routes/main')
const mongoose = require('mongoose')

const stockRoutes = require('./routes/stock')
const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(bodyParser.json())

app.use('/api', mainRoutes)
app.use('/api/stock',stockRoutes)

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('CONNECTED')
    app.listen(3000)
  })
  .catch(err => {
    throw err.message
  })

module.exports = app

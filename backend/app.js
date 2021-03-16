const path = require('path')
require('dotenv').config({path: path.join(__dirname,'/../.env')})
const express = require('express')
const bodyParser = require('body-parser')
const mainRoutes = require('./routes/main')
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

app.listen(3000)
console.log(`Yoooooo can you shee dis?????${process.env.STOCK_DATA_API}`)
module.exports = app

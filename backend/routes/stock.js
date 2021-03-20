const express = require('express')

const router = express.Router()

const stockController = require('../controllers/stock')

router.get('/prediction/:symbol', stockController.getStockPrediction)

router.get('/', stockController.getAllStocks)

router.get('/current-price/:symbol', stockController.getCurrentPrice)

router.get('/popular', stockController.getPopularStock)

router.get('/:symbol', stockController.getStockData)

module.exports = router

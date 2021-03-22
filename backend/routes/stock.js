const express = require('express')

const router = express.Router()

const stockController = require('../controllers/stock')

router.get('/prediction/:symbol', stockController.getStockPrediction)

router.get('/popular', stockController.getPopularStocks)

router.get('/:symbol', stockController.getOneStock)

router.get('/', stockController.getAllStocks)

module.exports = router

const express = require('express')

const router = express.Router()

const stockController = require('../controllers/stock')

router.get('/', stockController.getAllStocks)

router.get('/popular', stockController.getPopularStock)

router.get('/:symbol', stockController.getStockData)

router.get('/prediction/:symbol', stockController.getStockData)

module.exports = router

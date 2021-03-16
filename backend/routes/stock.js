const express = require('express')

const router = express.Router()

const stockController = require('../controllers/stock')

router.get('/:symbol', stockController.getStock)

module.exports = router
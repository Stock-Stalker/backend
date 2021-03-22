const express = require('express')

const router = express.Router()

const watchlistController = require('../controllers/watchlist')

const isAuth = require('../middleware/isAuth')

router.get('/', isAuth, watchlistController.getWatchlist)

router.patch('/', isAuth, watchlistController.updateWatchlist)

module.exports = router

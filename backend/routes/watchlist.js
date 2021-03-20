const express = require('express')

const router = express.Router()

const watchlistController = require('../controllers/watchlist')

const isAuth = require('../middleware/isAuth')

router.get('/', isAuth, watchlistController.getWatchlist)

router.patch('/', isAuth, watchlistController.addToWatchlist)

router.patch('/remove', isAuth, watchlistController.removeFromWatchlist)

module.exports = router

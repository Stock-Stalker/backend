const express = require('express')

const router = express.Router()

const watchlistController = require('../controllers/watchlist')

const isAuth = require('../middleware/isAuth')

router.get('/', isAuth, watchlistController.getwatchlist)

router.patch('/', isAuth, watchlistController.addToWatchlist)

router.patch('/remove', isAuth, watchlistController.removeFromWatchlist)
router.patch('/update', isAuth, watchlistController.updateWatchlist)

module.exports = router

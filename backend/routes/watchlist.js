const express = require('express')

const router = express.Router()

const watchlistController = require('../controllers/watchlist')

const isAuth = require('../middleware/isAuth')

router.get('/', isAuth, watchlistController.getwatchlist)

router.patch('/', isAuth, watchlistController.addToWatchlist)

<<<<<<< HEAD
router.patch('/remove',isAuth, watchlistController.removeFromWatchlist)
=======
router.patch('/remove/:symbol', isAuth, watchlistController.removeFromWatchlist)
>>>>>>> 7324d80e14b2483d507d78b7e9e4b74fa8be5ab4

module.exports = router

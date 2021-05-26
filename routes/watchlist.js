const express = require('express')

const router = express.Router()

const { body } = require('express-validator')

const watchlistController = require('../controllers/watchlist')

const isAuth = require('../middleware/isAuth')

router.get('/', isAuth, watchlistController.getWatchlist)

router.patch(
    '/',
    [
        body('symbol', 'Please ensure you pass a valid string as symbol.')
            .isLength({ min: 1, max: 5 })
            .isAlpha()
            .escape()
            .not()
            .isEmpty()
    ],
    isAuth,
    watchlistController.updateWatchlist
)

module.exports = router

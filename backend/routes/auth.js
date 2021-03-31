const express = require('express')

const { body } = require('express-validator')

const authController = require('../controllers/auth')

const router = express.Router()

const isAuth = require('../middleware/isAuth')

router.post(
    '/signup',
    [
        body(
            'username',
            'Please make sure your username is between 4 and 25 characters and contains no special characters.'
        )
            .isLength({ min: 4, max: 25 })
            .escape()
            .not()
            .isEmpty(),
        body(
            'password',
            'Please make sure your password is between 8 and 25 characters and contains no special characters.'
        )
            .isLength({ min: 8, max: 25 })
            .escape()
            .not()
            .isEmpty()
    ],
    authController.signUpUser
)

router.post(
    '/signin',
    [
        body(
            'username',
            'Please make sure your username is between 4 and 25 characters and contains no special characters.'
        )
            .isLength({ min: 4, max: 25 })
            .escape()
            .not()
            .isEmpty(),
        body(
            'password',
            'Please make sure your password is between 8 and 25 characters and contains no special characters.'
        )
            .isLength({ min: 8, max: 25 })
            .escape()
            .not()
            .isEmpty()
    ],
    authController.signInUser
)

router.post('/refresh', isAuth, authController.refreshToken)
module.exports = router

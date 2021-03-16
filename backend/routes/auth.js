const express = require('express')

const { body } = require('express-validator')

const authController = require('../controllers/auth')

const isAuth = require('../middleware/isAuth')

const router = express.Router()

router.post('/signup', [
  body('username')
    .isEmail()
    .normalizeEmail()
    .not()
    .isEmpty(),
  body('password', 'Please make sure your password is between 8 and 25 characters and contains no special characters.')
    .isLength({ min: 8, max: 25 })
    .escape()
    .not()
    .isEmpty()
], authController.signup)

router.post('/signin', [
  body('username')
    .isEmail()
    .normalizeEmail()
    .not()
    .isEmpty(),
  body('password')
    .not()
    .isEmpty()
], authController.signin)

router.get('/', isAuth, authController.getUserProfile)

module.exports = router

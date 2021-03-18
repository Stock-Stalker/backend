const express = require('express')

const { body } = require('express-validator')

const authController = require('../controllers/auth')

const isAuth = require('../middleware/isAuth')

const router = express.Router()

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

module.exports = router

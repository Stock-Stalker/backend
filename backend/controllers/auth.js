const bcrypt = require('bcrypt')
const process = require('process')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const { validationResult } = require('express-validator')

exports.signup = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  let user
  const { username, password } = req.body
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      user = new User({
        username: username,
        password: hashedPassword
      })
      return user.save()
    })
    .then(result => {
      const token = jwt.sign({
        username: user.username,
        userId: user._id.toString()
      }, process.env.SECRET_KEY, {
        expiresIn: '1h'
      })
      res.status(201).json({ token: token })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.signin = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.')
    error.statusCode = 422
    error.data = errors.array()
    throw error
  }
  const { username, password } = req.body
  let loadedUser
  User.findOne({ username })
    .then(user => {
      if (!user) {
        const error = new Error('We could not find a user with that email address.')
        error.statusCode = 401
        throw error
      }
      loadedUser = user
      return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Incorrect password')
        error.statusCode = 401
        throw error
      }
      const token = jwt.sign({
        username: loadedUser.username,
        userId: loadedUser._id.toString()
      }, process.env.SECRET_KEY, {
        expiresIn: '1h'
      })
      res.status(200).json({ token: token })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

exports.getUserProfile = (req, res, next) => {
  User.findById(req.userId)
    .then(user => {
      if (!user) {
        throw new Error('User not found.')
      }
      returnUser = {
        username: user.username
      }
      return res.status(200).json(returnUser)
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    })
}

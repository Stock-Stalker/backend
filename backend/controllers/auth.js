const bcrypt = require('bcrypt')
const process = require('process')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const { validationResult } = require('express-validator')

exports.signUpUser = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { username, password } = req.body
    User.findOne({ username })
        .then((user) => {
            if (user) {
                return res.status(409).json({
                    message: 'User already exists!'
                })
            }
            return bcrypt.hash(password, 12)
        })
        .then((hashedPassword) => {
            const user = new User({
                username: req.body.username,
                password: hashedPassword
            })
            return user.save()
        })
        .then((user) => {
            const token = jwt.sign(
                {
                    username: user.username,
                    userId: user._id.toString()
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                }
            )
            return res
                .status(200)
                .cookie('SSAuth', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                })
                .json({
                    message: 'Sign up successful!',
                    user: {
                        username: user.username
                    }
                })
        })
        .catch((err) => res.status(500).json({ err }))
}

exports.signInUser = (req, res) => {
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
        .then((user) => {
            if (!user) {
                return res.status(401).json({
                    message: 'User does not exist!'
                })
            }
            loadedUser = user
            return bcrypt.compare(password, user.password)
        })
        .then((isEqual) => {
            if (!isEqual) {
                return res.status(401).json({
                    message: 'Incorrect password'
                })
            }
            const token = jwt.sign(
                {
                    username: loadedUser.username,
                    userId: loadedUser._id.toString()
                },
                process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                }
            )
            return res
                .status(200)
                .cookie('SSAuth', token, {
                    maxAge: 60 * 60 * 1000,
                    httpOnly: true
                })
                .json({ message: 'Sign in successful' })
        })
        .catch((err) => res.status(500).json({ err }))
}

exports.signOutUser = (req, res) => {
    res.clearCookie('SSAuth')
    return res.status(200).json({ message: 'Successfully signed out' })
}

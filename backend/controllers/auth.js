const bcrypt = require('bcrypt')
const process = require('process')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const { validationResult } = require('express-validator')

exports.signUpUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { username, password } = req.body
    try {
        let user = await User.findOne({ username })
        if (user) {
            return res.status(409).json({
                message: 'User already exists!'
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        user = new User({
            username: req.body.username,
            password: hashedPassword
        })
        const savedUser = await user.save()
        const token = jwt.sign(
            {
                username: savedUser.username,
                userId: savedUser._id.toString()
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            }
        )
        savedUser.token = token
        await savedUser.save()
        return res.status(200).json({
            message: 'Sign up successful!',
            user: {
                username: savedUser.username
            },
            token: savedUser.token
        })
    } catch (err) {
        return res.status(500).json(err.message)
    }
}
exports.signInUser = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
    }
    const { username, password } = req.body
    try {
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({
                message: 'User does not exist!'
            })
        }
        const isEqual = bcrypt.compare(password, user.password)
        if (!isEqual) {
            return res.status(401).json({
                message: 'Incorrect password'
            })
        }
        user.token = jwt.sign(
            {
                username: user.username,
                userId: user._id.toString()
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '1h'
            }
        )
        await user.save()
        return res
            .status(200)
            .json({ message: 'Sign in successful', token: user.token, user: user })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        try {
            jwt.verify(user.token, process.env.SECRET_KEY)
        } catch (err) {
            return res.status(401).send({ message: 'Invalid Token' })
        }
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
        user.token = token
        await user.save()
        return res
            .status(200)
            .json({ message: 'New Token Generated', token: user.token, user: user })
    } catch (err) {
        return res.status(500).json({ err })
    }
}

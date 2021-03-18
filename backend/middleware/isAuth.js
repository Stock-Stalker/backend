const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.cookies.SSAuth
    if (!token) {
        const err = new Error('Not authenticated.')
        err.statusCode = 401
        throw err
    }
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    } catch (err) {
        err.statusCode = 401
        throw err
    }
    if (!decodedToken) {
        const error = new Error('Unable to authenticate.')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}

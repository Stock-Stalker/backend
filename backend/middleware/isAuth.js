const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    // Expect Authorization header to look as follows:
    // Bearer <token>
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const err = new Error('Not authenticated.')
        err.statusCode = 401
        throw err
    }
    // Get the token part of the auth header
    const token = authHeader.split(' ')[1]
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

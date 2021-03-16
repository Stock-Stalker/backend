const redis = require('redis')

const client = redis.createClient({
  host: 'cache'
})

const setResponse = (username, repos) => {
  return `<p>${username} has ${repos} Github repos</p>`
}

const cache = (req, res, next) => {
  const { username } = req.params

  client.get(username, (err, data) => {
    if (err) throw err

    if (data !== null) {
      res.send(setResponse(username, data))
    } else {
      next()
    }
  })
}

module.exports = {
  client,
  setResponse,
  cache
}

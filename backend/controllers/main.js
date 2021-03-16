const axios = require('axios')
const cache = require('../middleware/cache')
const client = cache.client
const setResponse = cache.setResponse

exports.getHome = (req, res) => {
  res.status(200).json({ message: 'This is the backend' })
}

exports.getRepos = async (req, res) => {
  try {
    console.log('Fetching Data...')
    const { username } = req.params
    const response = await axios.get(`https://api.github.com/users/${username}`)
    const repos = response.data.public_repos
    await client.setex(username, 3600, repos)
    res.send(setResponse(username, repos))
  } catch (err) {
    console.error(err)
    res.status(500)
  }
}

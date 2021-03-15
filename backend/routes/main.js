const express = require('express')

const router = express.Router()

const cache = require('../middleware/cache')

const mainController = require('../controllers/main')

router.get('/repos/:username', cache.cache, mainController.getRepos)

router.get('/', mainController.getHome)

module.exports = router

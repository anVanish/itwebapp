const express = require('express')
const router = express.Router()

const meController = require('../app/controllers/MeController')

// router.get('/info', meController.info)
router.get('/', meController.show)

module.exports = router
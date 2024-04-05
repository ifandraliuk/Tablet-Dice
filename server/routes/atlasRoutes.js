const express = require('express')
const { getKingdom } = require('../controllers/atlasController')
const router = express.Router()

router.route('/kingdom').get(getKingdom)

module.exports = router
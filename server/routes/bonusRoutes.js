const express = require('express')
const { getCategoryBoni } = require('../controllers/bonusController')
const { protect } = require("../middleware/authMiddleware");
const router = express.Router()

router.route('/:category').get(protect, getCategoryBoni)

module.exports = router
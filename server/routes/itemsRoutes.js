const express = require('express')
const router = express.Router()
const {setItem, getItem} = require('../controllers/itemsController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(setItem).get(getItem); 
module.exports = router
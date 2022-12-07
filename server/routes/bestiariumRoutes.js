const express = require('express')
const router = express.Router()

const {setCreature,  getCreature} = require('../controllers/bestiariumController')

router.route('/').get(getCreature).post(setCreature); 

module.exports = router
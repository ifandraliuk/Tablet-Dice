const express = require('express')
const router = express.Router()

const {setHabitat, getHabitat} = require('../controllers/habitatController')

router.route('/').get(getHabitat).post(setHabitat); 

module.exports = router
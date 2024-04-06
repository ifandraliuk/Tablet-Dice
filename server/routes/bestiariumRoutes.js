const express = require('express')
const router = express.Router()

const {setCreature,  getCreature, getCreatureInHabitat} = require('../controllers/bestiariumController')

router.route('/').get(getCreature).post(setCreature); 
router.route('/:habitat/:register').get(getCreatureInHabitat)

module.exports = router
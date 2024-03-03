const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')
const {setAbility, getProfession, setProfession, getProfessions} = require('../controllers/professionController')


router.route('/').get(getProfessions).post(setProfession);
router.get("/player", protect, getProfession); 
router.route('/ability').post(setAbility);
module.exports = router
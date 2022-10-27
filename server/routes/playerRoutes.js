const express = require('express')
const router = express.Router()
const {getPlayer, setAttributes, getGeneral, setGeneral, addClass, postTalent, putTalent} = require('../controllers/playerController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getPlayer);
router.post('/attributes', protect, setAttributes); 
router.route('/general').get(protect,getGeneral).post(protect, setGeneral); 
router.post('/uclass', protect, addClass); 
router.route('/talents').put(protect, putTalent)
 
module.exports = router
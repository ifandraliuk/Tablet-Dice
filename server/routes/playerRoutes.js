const express = require('express')
const router = express.Router()
const {getPlayer, setAttributes, getGeneral, setGeneral, addClass, putTalent, toInventory, updateInventory, deleteItem, setEnchantment, uploadPicture, levelUp, createCharacter} = require('../controllers/playerController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getPlayer);
router.put('/levelup', protect, levelUp); 
router.post('/create', protect, createCharacter); 
router.post('/attributes', protect, setAttributes); 
router.route('/general').get(protect,getGeneral).post(protect, setGeneral); 
router.post('/uclass', protect, addClass); 
router.route('/talents').put(protect, putTalent)
router.route('/inventory').put(protect, updateInventory).post(protect, toInventory)
router.route('/inventory/:id').delete(protect, deleteItem)
router.route('/enchantment').put(protect, setEnchantment)
router.route('/profilepic').post(protect, uploadPicture)

module.exports = router
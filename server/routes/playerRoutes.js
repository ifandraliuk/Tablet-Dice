const express = require('express')
const router = express.Router()
const {getPlayer,putTalent, toInventory, updateInventory, deleteItem, setEnchantment, uploadPicture, updateLevel, createCharacter, updateAttribute, updateBalance, addTalent, removeTalent, addCompanion} = require('../controllers/playerController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getPlayer);
router.route('/levelup').put(protect, updateLevel)

//ATTR
router.put('/attributes/:attr', protect, updateAttribute); 

//TALENTS
router.route('/talents').put(protect, putTalent).post(protect, addTalent)
router.route('/talents/:id').delete(protect, removeTalent)

//INVENTORY
router.route('/inventory').put(protect, updateInventory).post(protect, toInventory)
router.route('/inventory/:id').delete(protect, deleteItem)
router.route('/enchantment').put(protect, setEnchantment)
router.route('/balance').put(protect, updateBalance)
//CREATE CHARACTER
router.route('/profilepic').post(protect, uploadPicture)
router.post('/create', protect, createCharacter); 

//COMPANIONS
router.post('/companion', protect, addCompanion); 

module.exports = router
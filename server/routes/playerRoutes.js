const express = require('express')
const router = express.Router()
const {getPlayer,putTalent, toInventory, updateInventory, deleteItem, setEnchantment, uploadPicture, updateLevel, createCharacter, updateAttribute, updateBalance, addTalent, removeTalent} = require('../controllers/playerController')
const {protect} = require('../middleware/authMiddleware')

router.get('/', protect, getPlayer);
router.route('/levelup').put(protect, updateLevel)
router.post('/create', protect, createCharacter); 
router.put('/attributes/:attr', protect, updateAttribute); 
router.route('/balance').put(protect, updateBalance)
router.route('/talents').put(protect, putTalent).post(protect, addTalent)
router.route('/talents/:id').delete(protect, removeTalent)
router.route('/inventory').put(protect, updateInventory).post(protect, toInventory)
router.route('/inventory/:id').delete(protect, deleteItem)
router.route('/enchantment').put(protect, setEnchantment)
router.route('/profilepic').post(protect, uploadPicture)

module.exports = router
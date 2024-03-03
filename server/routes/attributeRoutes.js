const express = require('express')
const router = express.Router()
const {protect} = require('../middleware/authMiddleware')

const {setAttributes, getAttributes, updateAttribute} = require('../controllers/attributeController')

router.route('/').get(protect,getAttributes).post(protect, setAttributes); 
//ATTR
router.put("/:attr", protect, updateAttribute);
module.exports = router
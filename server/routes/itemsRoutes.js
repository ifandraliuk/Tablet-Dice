const express = require('express')
const router = express.Router()
const {setItem, getItem, updateItem} = require('../controllers/itemsController')

router.route('/').post(setItem).get(getItem)


router.route('/:name').put(updateItem)
module.exports = router
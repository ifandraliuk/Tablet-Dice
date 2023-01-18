const express = require('express')
const router = express.Router()
const {setItem, getItem, findItem, updateItem} = require('../controllers/itemsController')

router.route('/').post(setItem).get(getItem)
router.route('/search').get(findItem)

router.route('/:name').put(updateItem)
module.exports = router
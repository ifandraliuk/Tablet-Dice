const express = require('express')
const router = express.Router()
const {setItem, getItem, findItem, updateItem, rename} = require('../controllers/itemsController')

router.route('/').post(setItem)
router.route("/:category/:genus/:n/:m").get(getItem)
router.route('/search').get(findItem)
router.route('/rename').put(rename)
router.route('/:name').put(updateItem)
module.exports = router
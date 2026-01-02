const express = require('express')
const router = express.Router()
const {setItem, getItem, getSearchInCategory, findItem, updateItem, rename, migrateRarityValues} = require('../controllers/itemsController')

router.route('/').post(setItem)
router.route("/searchInCategory/:category/:genus/:n/:searchText/:rarity").get(getSearchInCategory)
router.route("/:category/:genus/:n/:m/:rarity").get(getItem)

router.route("/migrateRarityValue").put(migrateRarityValues)
router.route('/search').get(findItem)
router.route('/rename').put(rename)
router.route('/:name').put(updateItem)
module.exports = router
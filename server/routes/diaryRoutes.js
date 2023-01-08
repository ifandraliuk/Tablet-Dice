const express = require('express')
const router = express.Router()
const {postDiary, getDiary, getUsernames,getMyDiary, updateDiary, deleteDiary} = require('../controllers/diaryController')
const {protect} = require('../middleware/authMiddleware')

router.route('/').post(postDiary).get(getDiary)
router.route('/userlist').get(getUsernames)
router.route('/:id').get(getMyDiary).put(updateDiary)
router.route("/:id").delete(deleteDiary)
//register, login, get Infos

module.exports = router
const asyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')
const Diary = require('../models/diaryModel')
const User = require('../models/userModel')


// @desc update users attribute
// @route GET diary /diary/userlist
// @access Public
const getUsernames = asyncHandler(async(req,res)=>{
    const users = await User.find()
    if(!users){
        console.log("keine Nutzer gefunden")
        res.status(200).json([])
    }
    console.log()
    let userList = []
    users.forEach(el=>userList.push({id:el._id, name: el.name, level:el.level, userclass:el.userclass?.name}))
    res.status(200).json(userList)
})

// @desc get all diaries
// @route GET diary /diary/
// @access Public

const getDiary = asyncHandler( async (req, res) => {
    const diary = await Diary.find()
    if(!diary){
        res.status(500).json({message:"Tagebuch ist leer"})
    }
    res.status(200).json(diary)
})

// @desc get all diaries for this user
// @route GET diary /diary/:id
// @access Public

const getMyDiary = asyncHandler( async (req, res) => {
    //{path:"players", model:'User', select:'_id name userclass level', populate:{path: 'players.userclass', select:'name', model: 'Userclass'},
    const diary = await Diary.find({players: req.params.id}).populate( {path : 'players', select:"_id name level",
    populate : {
      path : 'userclass',
      select:"name"
    }, populate: {
        path: "general",
        select: "origin"
    }} )
    if(!diary){
        res.status(500).json({message:"Tagebuch ist leer"})
    }
    res.status(200).json(diary)
})


// @desc post diary
// @route POST diary /diary/
// @access Public

const postDiary = asyncHandler( async (req, res) => {
    if(!req.body.text){
       res.status(400).json({message:"Kein Text eingegeben"})
       throw new Error("Falsch! Das Feld darf nicht leer sein")
   }
   console.log(req.body)
   const populatedDiary = await Diary.findOneAndUpdate({_id:mongoose.Types.ObjectId()}, {
        text: req.body.text,
        category: req.body.category,
        players: req.body.players   
   }, {new:true, upsert:true, runValidators:true, setDefaultsOnInsert:true, populate: {
    path : 'players', select:"_id name level",
    populate : {
      path : 'userclass',
      select:"name"
    }, populate: {
        path: "general",
        select: "origin"
    }
   }})
   if(!populatedDiary){
    res.status(400).json({message:"Populate nicht möglich"})
   }
   res.status(200).json(populatedDiary) 
})


const updateDiary = asyncHandler( async (req, res) => {
    console.log(req.params.id)
    console.log(req.body.text)
    if(!req.params.id){
        res.status(400).json({message:"Kein Id eingegeben"})
    }
    const populatedDiary = await Diary.findOneAndUpdate({_id:req.params.id}, {
        text: req.body.text,
        category: req.body.category,
        players: req.body.players   
   }, {new:true, populate: {
    path : 'players', select:"_id name level",
    populate : {
      path : 'userclass',
      select:"name"
    }, populate: {
        path: "general",
        select: "origin"
    }

   }})
   if(!populatedDiary){
    res.status(400).json({message:"Populate nicht möglich"})
   }
   res.status(200).json(populatedDiary) 
})

// @desc remove diary
// @route DELETE diary /diary/:id
// @access Public

const deleteDiary = asyncHandler( async (req, res) => {
    const diary = await Diary.findById(req.params.id)
    if(!req.params.id){
        res.status(400).json({message:"Kein Id eingegeben"})
    }
    console.log(diary)
    await diary.remove()
    res.status(200).json({id: req.params.id})
})


module.exports = {
    postDiary, getDiary, getMyDiary, updateDiary, deleteDiary, getUsernames
}
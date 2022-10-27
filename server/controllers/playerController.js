const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Userclass = require('../models/classesModel')
const Attribute = require('../models/attributesModel')
const General = require('../models/generalModel')
const Talent = require('../models/talentModel')
const UserTalents = require('../models/userTalentsModel')
const mongoose = require('mongoose')
// @desc Get user data
// @route GET /users/player
// @access Private
const getPlayer = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    .populate({path: 'userclass', select:'name category description abilities advantages', model: 'Userclass'}, )
    .populate({path:'talents.talent',  model:'Talent', select:'category name dice'})
    //console.log(user.userclass.name)
    if(!user){
        res.status(500).json({message: 'Spieler nicht gefunden'})
    }
    res.status(200).json(user)
})


// @desc Set user attributes
// @route GET /player/attributes
// @access Private
const setAttributes = asyncHandler( async (req, res)=>{
    console.log('creating new attribute for user')
    if(!req.user) {
        res.status(400)
        console.log("not authorized...")
        throw new Error('Nicht autorizierd')  
    }

    const attr = await Attribute.create({
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        intelligent: req.body.intelligent,
        vitality: req.body.vitality,    
        stamina: req.body.stamina,  
        charisma: req.body.charisma,  
        mana: req.body.mana,
        spirit: req.body.spirit,
    })
    console.log(attr)
    if(attr){
        const userToUpdate = await User.findById(req.user.id)
        if(userToUpdate){
            userToUpdate.attributes = attr
            const doc = await userToUpdate.save()
            console.log("backend-attribuets were added to user")
            res.status(200).json(doc)
        } else {
            res.status(400)
            throw new Error('Impossible to add info to user')  
        }
    }
})


// @desc Set user general
// @route GET /player/general
// @access Private
const getGeneral = asyncHandler( async (req, res) => {
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(400)
        throw new Error("User not found")        
    }
    if(user.general){
        console.log('general info already added')
        res.status(200).json(user.general)
    }  else {
        res.status(200).json({age:0, haircolor:''})
    }    
})

// @desc Set user general info
// @route GET /player/general
// @access Private
const setGeneral = asyncHandler( async (req, res) => {
     if(!req.body.age){
        res.status(400)
        throw new Error("Falsch! Das Feld darf nicht leer sein")
    }
    const gen = await General.create({
        kind: req.body.kind,
        age: req.body.age,
        haircolor: req.body.haircolor,
        sex: req.body.sex,
        eyecolor: req.body.eyecolor,
        origin: req.body.origin,
        more: req.body.more,
        haircut: req.body.haircut
    }) 
    const usertoUpdate = await User.findById(req.user.id)
    if(gen && usertoUpdate){
        console.log(usertoUpdate)
        usertoUpdate.general = gen
        const doc = await usertoUpdate.save()
        res.status(200).json(doc)
    } else {
        console.log('error by creating collections')
        res.status(400)
        throw new Error("Falsch! Das Feld darf nicht leer sein")
    }    
})

// @desc Add Class to user
// @route POST /player/uclass
// @access Private
const addClass = asyncHandler( async (req, res) => {
    const userclass = await Userclass.findOne({name: req.body.name})
    if (!userclass){
        res.status(400).json({message: "Die Klasse wurde noch nicht hinzugefügt"})
        throw new Error("Die Klasse wurde noch nicht hinzugefügt")
    }

     if(!req.user){
        res.status(401).json({message: "Nicht berechtigt"})
    }

    const user = await User.findByIdAndUpdate(req.user.id, {userclass: userclass._id}, {new:true})
    if(!user){
        res.status(401).json({message: "Update nicht erfolgreich"})
    }
    console.log(userclass._id) 
    res.status(200).json(user)
    //const toUpdate = await Talent.findByIdAndUpdate(req.params.id, req.body, {new: true,})
    //res.status(200).json(toUpdate)
})

const postTalent = asyncHandler(async (req, res)=>{
    console.log(req.body)
    if(!req.body.point || !req.body.name){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    //find talent by name
    const talent = await Talent.findOne({name: req.body.name})
    if(talent){
        const userTalent = await UserTalents.create({
            talent: talent._id,
            points: req.body.point,
        })
        if(userTalent){
            const doc = await User.findByIdAndUpdate(req.user.id, {$push:{talents: userTalent}}, {new: true})
            if(doc){
                res.status(201).json(doc)
            } else {
                res.status(400)
            }
           
        }
    }

})

const putTalent = asyncHandler(async (req, res)=>{
    if(!req.body.point || !req.body.name){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    console.log(typeof(req.body.point))
    const talent = await Talent.findOne({name: req.body.name})
    if(!talent){
        res.status(400)
        throw new Error('Talent nicht gefunden...')        
    }
    console.log(talent._id)
    const updated = await User.findOneAndUpdate({
        user: req.user.id,
        'talents.talent': talent._id
    },
    {
        $set: {
            'talents.$.points': parseInt(req.body.point)
        }
    }, {new: true})
    if(!updated){
        const userTalent = await UserTalents.create({
            talent: talent._id,
            points: req.body.point,
        })
        if(!userTalent){
            res.status(400)
            throw new Error('Talent konnte nicht erstellt werden...') 
        }
        const created = await User.findByIdAndUpdate(req.user.id, {$push:{talents: userTalent}}, {new: true}) 
        if(!created){
            res.status(400)
            throw new Error('Talent konnte nicht erstellt werden...') 
        }
        console.log("Talent was erstellt und hinzgefügt")
    } else {
        console.log("Talent was updated")
    }
    res.status(200)
})

module.exports = {
    getPlayer, setAttributes, getGeneral, setGeneral, addClass, postTalent, putTalent,
}
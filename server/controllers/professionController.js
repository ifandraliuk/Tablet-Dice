const asyncHandler = require('express-async-handler')
const Userclass = require('../models/classesModel')
const User = require('../models/userModel')
const Abilities = require('../models/abilitiesModel')
const { default: mongoose } = require('mongoose')
// @desc Get classes
// @route GET /professions/
// @access Public
const getProfessions = asyncHandler( async (req, res) => {
    if(req.body.name){
        const userclasses = await Userclass.findOne({name:req.body.name})
        if(!userclasses){
            res.status(400).json({message: "Die Klasse wurde nicht gefunden"})
            throw new Error("Falsch! Das Feld darf nicht leer sein")        
        }
        res.status(200).json(userclasses)
    } else {
        const userclasses = await Userclass.find({})
        if(!userclasses){
            res.status(400).json({message: "Keine Klassen gefunden"})
            throw new Error("Falsch! Das Feld darf nicht leer sein")        
        }
        res.status(200).json(userclasses)
        }          
})
// @desc get user profession
// @route GET /professions/player
// @access Private

const getProfession = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user || !user?.userclass) {
      res.status(500).json({ message: "Spieler nicht gefunden" });
    }
    const uId = user.userclass._id
    const userclass = await Userclass.findById(uId)
    if(!uId || !userclass){
      res.status(500).json({ message: "Userklasse nicht gefunden" });
    }
    res.status(200).json(userclass);
  });
// @desc Set new class
// @route POST /professions/
// @access Public
const setProfession = asyncHandler( async (req, res) => {
     if(!req.body.name && !req.body.category){
        res.status(400)
        throw new Error("Falsch! Das Feld darf nicht leer sein")
    }
    if(req.body.category ==='Ausdauerklasse' || req.body.category ==='Manaklasse' || req.body.category ==='Spiritklasse'){

        const userClasses = await Userclass.create(req.body)
        /* 
        const userClasses = await UserClass.create({
            name: req.body.name,
            category: req.body.category, 
            description: req.body.description,
            advantages: req.body.advantages, 
        }) */
        if(!userClasses){
            res.status(400)
            throw new Error("Die Klasse konnte nicht erstellt werden")
        }
        res.status(200).json(userClasses) 
    } else {               
        res.status(400)
        throw new Error("Eingabe der Kategorie ist falsch")
    }
})
// @desc Add Class to user
// @route POST professions/ability
// @access Public
const setAbility = asyncHandler(async (req, res)=>{
    if (req.body.type==='stamina' || req.body.type==='mana' || req.body.type==='spirit'){
        const abilitiy = await Abilities.create({
            name: req.body.name,
            price: req.body.price,
            type: req.body.type,
            description: req.body.description,
            specialization: req.body.specialization
        })
        if(!abilitiy){
            res.status(400).json(req.body)
            throw new Error("Die Fertigkeit konnte nicht erstellt werden")      
        }
        const doc = await Userclass.findOneAndUpdate({name: req.body.classname}, {$push:{abilities: abilitiy}}, {new: true})
        console.log(doc)
        if(!doc){
            res.status(400)
            throw new Error("Das Update ist falsch")             
        }
        res.status(400).json(doc)
    } else {
        res.status(400)
        throw new Error("Die Kategorie ist falsch")       
    }
})


module.exports = {
    getProfessions, getProfession, setProfession, setAbility
}
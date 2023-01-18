const asyncHandler = require('express-async-handler')

const Bestiaruim = require('../models/bestiariumModel')
const Habitat = require('../models/habitatModel')

const setCreature = asyncHandler( async (req, res) => {
    if(!req.body.name){
       res.status(400).json({message:"Der Name darf nicht leer sein"})
       throw new Error("Falsch! Der Name darf nicht leer sein")
   }
   
   const habitatsList = req.body.habitat.split("/")
   let selectedHabitats = []
   if(habitatsList.length === 1){
    console.log("1 habitat")
        const selectedHabitat1 = await Habitat.findOne({"name":habitatsList[0]})
        if(selectedHabitat1){
            selectedHabitats.push(selectedHabitat1._id)
        }
   } else {
        const selectedHabitat2 = await Habitat.findOne({"name":habitatsList[1]})
        if(selectedHabitat2){
            selectedHabitats.push(selectedHabitat2._id)
        }
   }
   console.log(selectedHabitats)
   const Creature = await Bestiaruim.create({
       name: req.body.name,
       description: req.body.description,
       picture: req.body.picture,
       art: req.body.art,
       capacity: req.body.capacity,
       hitpoints: req.body.hitpoints,
       hitchance: req.body.hitchance,
       armor: req.body.armor,
       damage: req.body.damage,
       ability: req.body.ability,
       habitat: selectedHabitats,
       level: req.body.level,
       material: req.body.material,
   })
   if(!Creature){
    res.status(400).json({message:"Die Kreatur wurde nicht erstellt"})
   }
   res.status(200).json(Creature)
})

const getCreature = asyncHandler( async (req, res) => {
    const creatures = await Bestiaruim.find().populate({path: 'habitat', select:'name', model: 'Habitat'})
    res.status(200).json(creatures)
})


module.exports = { setCreature, getCreature}
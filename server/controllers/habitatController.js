const asyncHandler = require('express-async-handler')
const Habitat = require('../models/habitatModel')

const setHabitat = asyncHandler( async (req, res) => {
    if(!req.body.name){
       res.status(400).json({message:"Der Name darf nicht leer sein"})
       throw new Error("Falsch! Der Name darf nicht leer sein")
   }
   const newHabitat = await Habitat.create({
       name: req.body.name,
       description: req.body.description,
       ressource: req.body.ressource,
       territory: req.body.territory,
       map: req.body.map
   }) 
   if(!newHabitat){
    res.status(400).json({message:"Das Habitat wurde nicht erstellt"})
    throw new Error("Falsch")
   }
   res.status(200).json(newHabitat) 
})

const getHabitat = asyncHandler( async (req, res) => {
   const habitats = await Habitat.find({ressource: {$type: "array", $ne: []}}).populate({
    path:"ressource.id",
    model:"Item"
   })

    res.status(200).json(habitats)
})


module.exports = { setHabitat, getHabitat}
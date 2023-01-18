const asyncHandler = require('express-async-handler')

const Item = require('../models/itemsModel')


const setItem = asyncHandler( async (req, res) => {
    if(!req.body.name){
       res.status(400)
       throw new Error("Falsch! Das Feld darf nicht leer sein")
   }
   
   const newItem = await Item.create({
       name: req.body.name,
       value: req.body.value,
       category: req.body.category,
       genus: req.body.genus,
       type: req.body.type,
       rarity: req.body.rarity,
       material: req.body.material,
       dice: req.body.dice,
       bonuses: req.body.bonuses,
       set: req.body.set,
       description: req.body.description,
       weight: req.body.weight,
       price: req.body.price,
       status: req.body.status,
       companion: req.body.companion,
   }) 
   if (!newItem){
    res.status(400)
    throw new Error("Falsch! Die Eingaben sind nicht korrekt")
   }
   res.status(200).json(newItem) 
})

const updateItem = asyncHandler(async (req, res)=>{
    if(!req.params.name){
        res.status(400)
        throw new Error("Falsch! Das Feld darf nicht leer sein")
    }
    let attr = Object.keys(req.body)
    let val = Object.values(req.body)
    const item = await Item.findOne({name: req.params.name})
    if(!item){
        res.status(400)
        throw new Error("Das Item wurde nicht gefunden")
    }
    updated = await Item.findOneAndUpdate({
        name: req.params.name,
    },
    
        req.body
    , {new: true})
    if(!updated){
        res.status(400).json("Das Item konnte nicht updated werden")
        throw new Error("Das Item konnte nicht updated werden")
    }
    res.status(200).json(updated)
})
const findItem = asyncHandler( async (req, res) => {
    if(!req.body.name){
        res.status(400).json({message:"Nicht gefunden"})
        throw new Error("Falsch! Das Feld darf nicht leer sein")
    } else {
        const items = await Item.find({name:req.body.name})
        res.status(200).json(items)
    }
})
const getItem = asyncHandler( async (req, res) => {
    const items = await Item.find()
    res.status(200).json(items)
    
})


module.exports = { setItem, getItem, findItem, updateItem}
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

const getItem = asyncHandler( async (req, res) => {
    const items = await Item.find()
    res.status(200).json(items)
})


module.exports = { setItem, getItem}
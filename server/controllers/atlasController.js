const asyncHandler = require('express-async-handler')
const Kingdom = require('../models/kingdomModel')



const getKingdom = asyncHandler( async (req, res) => {
    const kingdom = await Kingdom.find().populate({
        path: 'habitat', 
        model: 'Habitat',
        populate: {
            path: 'ressource.id',
            model: 'Item'
        }
    
    })
    res.status(200).json(kingdom)
})


module.exports = {  getKingdom }
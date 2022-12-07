const mongoose = require('mongoose')
const userTalents = require('./userTalentsModel')
const inventory = require('./inventoryModel')
const general = require('./generalModel')
const attribute = require('./attributesModel')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    }, 
    level: {
        type: Number,
    },
    pointsLeft: {
        type: Number,
    }, 
    pwd: {
        type: String,
        required: [true, 'Bitte das Passwort eingeben!']
    }, 
    userclass:{ 
        ref:'Userclass',
        type: mongoose.Schema.Types.ObjectId, 
    },
    general: {
        type: general.schema
    },
    talents: {
        ref: 'UserTalents',
        type: [userTalents.schema]
    },
    inventory:{
        ref: 'Inventory',
        type: [inventory.schema]
    },
    attributes: {
        type: attribute.schema
    },
})


module.exports = mongoose.model('User', userSchema)

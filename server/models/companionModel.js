const mongoose = require('mongoose')
const inventory = require('./inventoryModel')


const companionSchema = mongoose.Schema({
    creature: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Bestiarium',
    },
    name: {
        type:String,
    },
    inventory: {
        ref: 'Inventory',
        type: [inventory.schema]
    },
    status: {
        type: String, //folgt, bewacht, sammelt, Basis, kundschaftet
    }
})

module.exports = mongoose.model('Companion', companionSchema)
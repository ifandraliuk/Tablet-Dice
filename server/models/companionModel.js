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
    level:{
        type: Number,
    },
    inventory: {
        ref: 'Inventory',
        type: [inventory.schema]
    },
    status: {
        type: String, // Schulterpett, reittier, begleiter
    },
    slot1: {
        ref: 'Item',
        type: mongoose.Schema.Types.ObjectId
    },
    slot2: {
        ref: 'Item',
        type: mongoose.Schema.Types.ObjectId
    },
})

module.exports = mongoose.model('Companion', companionSchema)
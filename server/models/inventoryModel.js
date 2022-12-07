const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
    item: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    },
    amount: {
        type: Number,
    },
    enchantment: {
        rarity: {
            type:String
        },
        bonuses: {
            type:String
        },
    },
    status: {
        type: String, //Spieler, Begleiter, Ausgerüstet
    }
})

module.exports = mongoose.model('Inventory', inventorySchema)
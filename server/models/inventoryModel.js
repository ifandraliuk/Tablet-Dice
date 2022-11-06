const mongoose = require('mongoose')

const inventorySchema = mongoose.Schema({
    item: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    },
    amount: {
        type: Number,
    },
    status: {
        type: String, //Spieler, Begleiter, Ausgerüstet
    }
})

module.exports = mongoose.model('Inventory', inventorySchema)
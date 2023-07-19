const mongoose = require('mongoose')


const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    },
    category: {
        type: String,
        required: [true, 'Bitte Kategory eingeben!']
    },
    rarity: {
        type: String,
    },
    genus: {
        type: String,
        required: [true, 'Bitte die Gattung eingeben! (Schwert, Axt, Werkzeug)']
    },
    type: {
        type: String,
        required: [true, 'Bitte den Itemstyp eingeben! (1-hand)']
    },
    value: {
        type: Number,
        required: [true, 'Bitte Distanz, Rüstwert o. Anzahl eingeben! (Numerisch)']
    },
    description: {
        type: String,
    },
    price: {
        type: String,  
    },
    bonuses: {
        type: String,
    },
    set: {
        type: String,
    },
    dice: {
        type: String, // Schaden/Widerstand/Abbau
    },
    weight: {
        type: Number,
    },
    material: [{
        element: {
            ref: "Item",
            type: mongoose.Schema.Types.ObjectId
        },
        amount: {
            type: Number,
        }
    }],

    icon: {
        type: String,
    }
})

module.exports = mongoose.model('Item', itemSchema)
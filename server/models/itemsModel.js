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
    rarityValue: {
        type: Number 
/*  primitiv: 1,
    gewöhnlich: 2,
    hochwertig: 3,
    magisch: 4,
    außergewöhnlich: 5,
    selten: 6,
    sagenhaft: 7,
    episch: 8,
    legendär: 9,
    einzigartig: 10, */
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
    boni: {
        ref: "Bonus",
        type: [mongoose.Schema.Types.ObjectId]
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
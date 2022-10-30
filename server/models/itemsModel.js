const mongoose = require('mongoose')


const weaponSchema = mongoose.Schema(
    {    
        name: {
            type: String,
            required: [true, 'Bitte einen Namen eingeben!']
        },
        distance: {
            type: String,
            required: [true, 'Bitte Distanz eingeben! (Fernkampf, Nahkampf)']
        },
        range: {
            type: Number,
            required: [true, 'Bitte die Reichweite eingeben! (1, 2)']
        },
        genus: {
            type: String,
            required: [true, 'Bitte die Gattung eingeben! (Schwert, Axt, Werkzeug)']
        },
        type: {
            type: String,
            required: [true, 'Bitte den Waffentyp eingeben! (1-hand)']
        },
        set: {
            type: String,
        },
        damage: {
            type: String,
            required: [true, 'Bitte Schaden eingeben! (1 W20)']
        },
        bonuses: {
            type: String,
        },
        description: {
            type: String,
        },
        weight: {
            type: Number,
        },
        price: {
            type: Number,  
        },
        status: {
            type: String,
        }

    }
)

const equipmentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Bitte einen Namen eingeben!']
        },
        type: {
            type: String,
            required: [true, 'Bitte den Ausrüstungstyp eingeben!(Leicht, Mittel, Schwer, Kette)']
        },
        bonuses: {
            type: String,
        },
        set: {
            type: String,
        },
        description: {
            type: String,
        },
        weight: {
            type: Number,
        },
        price: {
            type: Number,  
        },
        status: {
            type: String,
        }

})


const resourceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Bitte einen Namen eingeben!']
        },
        stack: {
            type: Number,
            required: [true, 'Bitte die Anzahl eingeben!']
        },
        type: {
            type: String,
            required: [true, 'Bitte den Ausrüstungstyp eingeben!(Holz, Erze, Nahrung)']
        },
        weight: {
            type: Number,
        },
        price: {
            type: Number,  
        },
})

const itemsSchema = mongoose.Schema(
    {
        weapons: {
            ref: "Weapon",
            type: [mongoose.Schema.Types.ObjectId], 
        },
        equipment: {
            ref: "Equipment",
            type: [mongoose.Schema.Types.ObjectId], 
        },
        ressources: {
            ref: "Resource",
            type: [mongoose.Schema.Types.ObjectId], 
        },
    }
)


const itemSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    },
    category: {
        type: String,
        required: [true, 'Bitte Kategory eingeben!']
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
        type: String, // Schafen/Widerstand
    },
    weight: {
        type: Number,
    },
    status: {
        type: String,
    },
    icon: {
        type: String,
    }
})

module.exports = mongoose.model('Resource',resourceSchema)
module.exports = mongoose.model('Equipment', equipmentSchema)
module.exports = mongoose.model('Weapon', weaponSchema)
module.exports = mongoose.model('Items', itemsSchema)
module.exports = mongoose.model('Item', itemSchema)
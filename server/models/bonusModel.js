const mongoose = require('mongoose')


const bonusSchema = ({
    category: { // Damage
        type: String,
        required: [true, 'Bitte einen Type eingeben!']
    },
    type: {
        type: String, // Feuer
    },
    display: { // Weapon
        type: String,
    },
    rarity: {
        type: String, //selten
    }
})


module.exports = mongoose.model('Bonus', bonusSchema)
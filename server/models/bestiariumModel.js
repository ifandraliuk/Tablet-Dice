const mongoose = require('mongoose')

const bestiariumSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    },
    description: {
        type: String,
    },
    picture: {
        type: String,
    },
    art: {
        type:String,
    },
    register:{ type: String},
    capacity:{
        type: Number,
    },
    hitpoints: {
        type: Number,
        required: [true, 'Bitte Trefferpunkte eingeben!']
    },
    hitchance: {
        type: Number,
        required: [true, 'Bitte Trefferpunkte eingeben!']
    },
    damage: {
        type: String,
    },
    ability: {
        type: String,
    },
    armor: {
        type: Number,
        required: [true, 'Bitte Rüstwert eingeben!']
    },
    habitat: {
        ref: "Habitat",
        type: [mongoose.Schema.Types.ObjectId]
    },
    level: {
        type: Number,
    },
    material: {
        type: String
    },

})


module.exports = mongoose.model('Bestiarium', bestiariumSchema)
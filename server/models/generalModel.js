const mongoose = require('mongoose')

const generalSchema = mongoose.Schema(
    {
        kind: {
            type: String,
            required: [true, 'Die Art eingeben']
        },
        age:{
            type: Number,
            required: [true, 'das Alter einbegben']
        },
        haircolor: {
            type: String,
        },
        sex: {
            type: String,
            required: [true, 'das Geschlecht nicht einbegben']
        },
        eyecolor: {
            type: String,
            required: [true, 'die Augenfarbe nicht einbegben']
        },    
        origin: {
            type: String,
            required: [true, 'den Herkunft nicht einbegben']
        },  
        more: {
            type: String,
        },  
        haircut: {
            type: String,
            required: [true, 'die Frisur nicht einbegben']
        },   
    }
)

module.exports = mongoose.model('General', generalSchema)
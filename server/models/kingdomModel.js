const mongoose = require('mongoose')


const kingdomSchema = ({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    },
    capital: {
        type: String,
    },
    religion: {
        type: String,
    },
    goverment: {
        type: String,
    },
    description: {
        type: String,
    },  
    habitat: [{
        
            ref: "Habitat",
            type: mongoose.Schema.Types.ObjectId
        
    }]
})


module.exports = mongoose.model('Kingdom', kingdomSchema)
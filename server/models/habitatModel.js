const mongoose = require('mongoose')

const habitatSchema = ({
    name: {
        type: String,
        required: [true, 'Bitte einen Namen eingeben!']
    },
    description: {
        type: String,
    },
    ressource: {
        type: String,
    },
    territory: {
        type: String,
    },
    map: {
        type: String // name of the jpeg Image
    }
})


module.exports = mongoose.model('Habitat', habitatSchema)
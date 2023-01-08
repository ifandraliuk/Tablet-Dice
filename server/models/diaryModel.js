const mongoose = require('mongoose')
const diarySchema = mongoose.Schema(
    {
        players: {
            ref: "User",
            type: [ mongoose.Schema.Types.ObjectId],
        },
        category: {
            type: String,
            
        },
        text: {
            type: String,
            required: [true, 'Bitte füge die Würfel hinzu!']
        },
        
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model('Diary', diarySchema)
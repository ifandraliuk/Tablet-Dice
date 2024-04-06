const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB is connected: ${conn.connection.host}`)
 //       const Bestiaruim = require('../models/bestiariumModel')
        // const result = await Bestiaruim.updateMany({}, { $rename: { picture: 'status' } });
        // console.log(`${result.nModified} documents updated`);
        
    } catch (error){
        console.log(error)
        process.exit(1)
    }
    
}

module.exports = connectDB
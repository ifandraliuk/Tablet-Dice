require('dotenv').config({debug:true})
const bp = require('body-parser')
const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.NODE_PORT || 5000;
const mongoose = require('mongoose')
const {errorHandler} = require('./middleware/errorMiddleware')
const fileupload = require('express-fileupload')
const connectDB = require('./config/db')
connectDB()

app.use(bp.json())
app.use(bp.urlencoded({extended:true}))
app.use(errorHandler)
app.use(fileupload())

// Authentification, register routes
app.use('/users', require('./routes/userRoutes'))

// All infos about player & data updating
app.use('/player', require('./routes/playerRoutes'))

//Inventory Page
app.use('/inventory', require('./routes/inventoryRoutes'))
app.use('/talents', require('./routes/talentRoutes'))

app.use('/professions', require('./routes/professionRoutes'))
app.use('/items', require('./routes/itemsRoutes'))

// Attributes (dexterity, vitality)
app.use('/attributes', require('./routes/attributeRoutes'))

// Diary
app.use('/diary', require('./routes/diaryRoutes'))

//Bestiarium 
app.use('/creatures', require('./routes/bestiariumRoutes'))

//Habitats
app.use('/habitats', require('./routes/habitatRoutes'))

//Companions
app.use('/atlas', require('./routes/atlasRoutes'))

//Companions
app.use('/companion', require('./routes/companionRoutes'))

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6


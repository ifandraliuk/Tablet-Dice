require('dotenv').config({debug:true})
const bp = require('body-parser')
const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.NODE_PORT || 5000;
const mongoose = require('mongoose')
const {errorHandler} = require('./middleware/errorMiddleware')

const connectDB = require('./config/db')
connectDB()

app.use(bp.json())
app.use(bp.urlencoded({extended:true}))
app.use(errorHandler)

// Authentification, register routes
app.use('/users', require('./routes/userRoutes'))

// All infos about player & data updating
app.use('/player', require('./routes/playerRoutes'))

app.use('/talents', require('./routes/talentRoutes'))

app.use('/classes', require('./routes/classesRoutes'))
app.use('/items', require('./routes/itemsRoutes'))

// Attributes (dexterity, vitality)
app.use('/attributes', require('./routes/attributeRoutes'))

app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6


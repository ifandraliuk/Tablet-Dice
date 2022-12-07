const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const protect = asyncHandler( async (req, res, next)=>{
    let token

    if(req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            // Get token from header Bearer token
            token = req.headers.authorization.split(' ')[1]

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-pwd')

            next()
        } catch(error) {
            res.status(401).json({message:'Nicht autorisiert!'})
            
            throw new Error({message:'Nicht autorisiert!'})
        }
    } 
    if (!token) {
        res.status(401).json({message:'Token nicht gefunden'})
        throw new Error({message:'Nicht autorisiert!'})
    }
})

module.exports = {protect}
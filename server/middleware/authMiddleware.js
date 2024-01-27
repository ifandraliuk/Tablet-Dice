const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const protect = asyncHandler(async (req, res, next) => {
    try {
        let token;
        debugger
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Get token from header Bearer token
            token = req.headers.authorization.split(' ')[1];
            //console.log("Token found:", token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from the token
            req.user = await User.findById(decoded.id).select('-pwd');
            next();
        } else {
            console.log("Token not found in headers");
            return res.status(401).json({ message: 'Token not found' });
        }
    } catch (error) {
        console.error("Error in token verification:", error.message);
        return res.status(401).json({ message: 'Nicht autorisiert!' });
    }
});

module.exports = {protect}
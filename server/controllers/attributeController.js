const asyncHandler = require('express-async-handler')
const Attribute = require('../models/attributesModel')
const User = require('../models/userModel')

const setAttributes = asyncHandler( async (req, res)=>{
    console.log('creating new attribute')
    if(!req.user) {
        res.status(400)
        console.log("not authorized...")
        throw new Error('Nicht autorizierd')  
    }

    const attr = await Attribute.create({
        strength: req.body.strength,
        dexterity: req.body.dexterity,
        intelligent: req.body.intelligent,
        vitality: req.body.vitality,    
        stamina: req.body.stamina,  
        charisma: req.body.charisma,  
        mana: req.body.mana,
        spirit: req.body.spirit,
    })
    console.log(attr)
    if(attr){
        const userToUpdate = await User.findById(req.user.id)
        if(userToUpdate){
            userToUpdate.attributes = attr
            const doc = await userToUpdate.save()
            console.log("backend-attribuets were added to user")
            res.status(200).json(doc)
        } else {
            res.status(400)
            throw new Error('Impossible to add info to user')  
        }
    }
})


// @desc update users attribute
// @route PUT player/attributes/:attr
// @access Private
const updateAttribute = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) [res.status(400).json({ message: "Nutzer nicht gefunden" })];
    if (user.attributes && user.attributes[req.params.attr]) {
      const val = user.attributes[req.params.attr];
      console.log("Old value: ", val);
      user.attributes[req.params.attr] = val + 1;
  
      const doc = await user.save();
      console.log("updating attribute ", req.params.attr);
      if (!doc) {
        res.status(400).json({ message: "Update fehlgesclagen" });
      }
      res
        .status(200)
        .json({ attr: req.params.attr, value: doc.attributes[req.params.attr] });
    }
  });
  
// @desc Get user data
// @route GET /attributes
// @access Private
const getAttributes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const attributes = user?.attributes
    if(!attributes){
      res.status(400).json("Keine Attribute gefunden")
    }
    res.status(200).json(attributes)
  })
  

module.exports = {
    getAttributes, setAttributes, updateAttribute
}
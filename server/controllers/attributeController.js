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
// @route PUT /attributes/:attr
// @access Private
const attributeNames = [
    "vitality", "stamina", "mana", "spirit",
    "strength", "dexterity", "intelligent", "charisma",
];

const updateAttribute = asyncHandler(async (req, res) => {
    const attr = req.params.attr;
    if (!attributeNames.includes(attr)) {
      return res.status(400).json({ message: "Ungültiges Attribut." });
    }
    const path = `attributes.${attr}`;
    const user = await User.findOneAndUpdate(
      {
        _id: req.user.id,
        [path]: { $type: "number", $gt: 0 },
        $expr: {
          $gt: [
            "$pointsLeft",
            { $add: attributeNames.map((name) => ({ $ifNull: [`$attributes.${name}`, 0] })) },
          ],
        },
      },
      { $inc: { [path]: 1 } },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(409).json({
        message: "Kein freier Attributspunkt vorhanden oder Attribut nicht verfügbar. Bitte aktualisiere die Seite.",
      });
    }
    return res.status(200).json({ attr, value: user.attributes[attr], pointsLeft: user.pointsLeft });
});
  
// @desc Get user data
// @route GET /attributes
// @access Private
const getAttributes = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    const attributes = user?.attributes
    const pointsLeft = user?.pointsLeft
    if(!user || !attributes || !pointsLeft){
      res.status(400).json("Keine Attribute gefunden")
    }
    res.status(200).json({attributes:attributes, pointsLeft: pointsLeft})
  })
  

module.exports = {
    getAttributes, setAttributes, updateAttribute
}
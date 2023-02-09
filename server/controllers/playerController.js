const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Userclass = require('../models/classesModel')
const Attribute = require('../models/attributesModel')
const General = require('../models/generalModel')
const Talent = require('../models/talentModel')
const UserTalents = require('../models/userTalentsModel')
const Item = require('../models/itemsModel')
const Inventory = require('../models/inventoryModel')
const Companion = require('../models/companionModel')
const Bestiarium = require('../models/bestiariumModel')
const mongoose = require('mongoose')


// @desc Get user data
// @route GET /users/player
// @access Private
const getPlayer = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    .populate({path: 'userclass', select:'name category description abilities advantages', model: 'Userclass'}, )
    .populate({path:'talents.talent',  model:'Talent', select:'_id category name dice'})
    .populate({path:'inventory.item',  model:'Item', select:'_id name category dice value rarity type price weight bonuses genus material set'})
    .populate({path: 'companions.creature', model:'Bestiarium', select:"name"})
    //console.log(user.userclass.name)
    if(!user){
        res.status(500).json({message: 'Spieler nicht gefunden'})
    }

    res.status(200).json(user)
})

// @desc level up a character
// @route PUT /player/updateLevel
// @access Private

const updateLevel = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user.id)
    if(user){
        console.log("user found!")
    }
    console.log("level up backend")
    if(!user){
        res.status(500).json({message: 'Spieler nicht gefunden'})
    }
    console.log(user.level)
    user.level = user.level + 1
    if(user.level % 5 === 0){
        console.log("1 Attributespunkt freigeschaltet!")
        user.pointsLeft = user.pointsLeft + 1
    }
    const doc = await user.save()
    if(!doc){
        res.status(400).json({message: 'Levelup misslungen'})
    }
    res.status(200).json({level: doc.level, pointsLeft: doc.pointsLeft})
})

// @desc Add infos to a new character
// @route PUT /player/create
// @access Private
const createCharacter = asyncHandler(async (req, res) => {
    console.log("uploading data to a new character")
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(500).json({message: 'Spieler nicht gefunden'})
    }
    // adding default level 1 && 70 attribute points 
    console.log(req.body)
    console.log(req.body.attributes)
    user.level = 1
    user.pointsLeft = 70
    user.money = [0,0,0]
    //adding userclass
    if(!req.body.userclass){
        res.status(400).json({message: 'Bitte wähle eine Spezialisation'})
    }
    const userclass = await Userclass.findOne({name: req.body.userclass})
    if(!userclass){
        res.status(500).json({message: 'Gewählte Spezialisation wurde nicht gefunden'})
    }
    user.userclass = userclass._id
    // adding general info
    if(!req.body.kind){
        res.status(400).json({message: 'Bitte wähle die Specie deines Charakters aus'})
    }
    const gen = await General.create({
        kind: req.body.kind,
        age: req.body.age,
        haircolor: req.body.haircolor,
        sex: req.body.sex,
        eyecolor: req.body.eyecolor,
        origin: req.body.origin,
        more: req.body.more,
        haircut: req.body.haircut
    }) 
    if(!gen){
        res.status(400).json({message: 'Die Werte aus dem Schritt 4 sind unvollständig'})
    }
    user.general = gen
    // adding attributes
    const attr = await Attribute.create(req.body.attributes)
    if(!attr){
        res.status(400).json({message: 'Die Werte aus dem Schritt 5 sind nicht korrekt. Vitalität eingegeben?'})
    }
    user.attributes = attr
    const doc = await user.save()
    if(!doc){
        res.status(400).json({message: 'Charaktererstellung hat fehlgeschlagen'})
    }
    res.status(200).json(doc)
})

const addCompanion = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(500).json({message: 'Spieler nicht gefunden'})
    }
    const creature = await Bestiarium.findById(req.body.id)
    if(!creature){
        res.status(500).json({message: 'Kreatur nicht gefunden'})
    }
    const companion = await Companion.create({
        creature: creature._id,
        name: req.body.name.length>0 ? req.body.name : "Otto",
        
    })
})

// @desc update money balance
// @route PUT /player/balance
// @access Private
const updateBalance = asyncHandler(async (req,res)=> {
    const user = await User.findById(req.user.id)
    if(!user)[
        res.status(400).json({message:"Nutzer nicht gefunden"})
    ]
    console.log(req.body)
    user.money = req.body
    const doc = await user.save()
    if(!doc){
        res.status(400).json({message: 'Dein Geldbalance wurde nicht geändert'})
    }
    res.status(200).json(doc.money)
})


// @desc update users attribute
// @route PUT player/attributes/:attr
// @access Private
const updateAttribute = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user.id)
    if(!user)[
        res.status(400).json({message:"Nutzer nicht gefunden"})
    ]
    if(user.attributes && user.attributes[req.params.attr]){
       const val =  user.attributes[req.params.attr] 
       console.log("Old value: ",val)
       user.attributes[req.params.attr] = val + 1
    
       const doc = await user.save()
       console.log("updating attribute ", req.params.attr)
       if(!doc){
        res.status(400).json({message: "Update fehlgesclagen"})
       }
       res.status(200).json({attr: req.params.attr, value: doc.attributes[req.params.attr]})
    }
})

const uploadPicture = asyncHandler(async (req, res)=>{
    console.log("backend picture upload")
    const image = req.files.img
    //const filename = req.files[1]
    console.log(image, image.name)
    const path = './../client/public/user/' + image.name
    image.mv(path, (error) => {
        if (error) {
          console.error(error)
          res.writeHead(500, {
            'Content-Type': 'application/json'
          })
          res.end(JSON.stringify({ status: 'error', message: error }))
          return
        }
    
        res.writeHead(200, {
          'Content-Type': 'application/json'
        })
        res.end(JSON.stringify({ status: 'success', path: '/user/' + image.name }))
      })

})

const addTalent = asyncHandler(async (req, res)=> {
    console.log(req.body.point, req.body.name)
    if(!req.body.point || !req.body.name){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    const talent = await Talent.findOne({name: req.body.name})
    if(!talent){
        res.status(400)
        throw new Error('Talent nicht gefunden...')        
    }    
    console.log("Neues talent:", req.body.name)
    const utalent = await UserTalents.findOneAndUpdate({_id:mongoose.Types.ObjectId()}, {
        talent: talent._id,
        points:req.body.point
    }, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
        populate: {path:'talent',  model:'Talent', select:'_id category name dice'}
    })
    console.log(utalent)
    if(!utalent){
        res.status(400)
        throw new Error('Talent konnte nicht erstellt werden...') 
    }
    const created = await User.findByIdAndUpdate(req.user.id, {$push:{talents: utalent}}, {new: true})
    if(!created){
        res.status(400)
        throw new Error('Talent konnte nicht erstellt werden...') 
    }
    console.log("Talent wurde erstellt und hinzgefügt")
    res.status(200).json(utalent)
})


const putTalent = asyncHandler(async (req, res)=>{
    console.log(req.body.point, req.body.id)
    if(!req.body.point || !req.body.id){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    //const talent = await Talent.findById(req.body.id)
    const talent = await UserTalents.findByIdAndUpdate(req.body.id, {points: req.body.point}, {new:true}).populate({path:'talent',  model:'Talent', select:'_id category name dice'})
    const user = await User.findById(req.user.id)
    console.log(talent)
    if(!talent){
        res.status(500)
        throw new Error('Talent nicht gefunden...')        
    }
    const updated = await User.findOneAndUpdate({
        user: req.user.id,
        //'talents.talent': talent._id
        'talents._id': talent._id
    },
    {
        $set: {
            'talents.$': talent
        }
    }, {new: true}).populate({path:'talents.talent',  model:'Talent', select:'_id category name dice'}) 
    if(!updated){
        res.status(400).json({message:"Es war unmöglich, diesen Talent zu updaten"})
    }
    res.status(200).json(talent)
})

// @desc Remove a talent from users inventory
// @route DELETE /player/talents/:id
// @access Private
const removeTalent = asyncHandler(async (req, res)=>{

    if(!req.params.id){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    const talent = await UserTalents.findById(req.params.id)
    console.log(talent)
    await talent.remove()
    const u = await User.findById(req.user.id)
    const removed = await User.findByIdAndUpdate({
        _id: u._id,
        'talents._id': req.params.id
    },
    {
        $pull: {
            'talents': {_id:req.params.id}
        }
    }, {new: true})
    
    if(!removed){
        res.status(400).json({message:"Das Löschen hat nicht geklappt!"})
        throw new Error('Talent konnte nicht erstellt werden...') 
    }
    res.status(200).json({id: req.params.id})
})


// @desc Add item to users inventory
// @route POST /player/inventory
// @access Private
const toInventory = asyncHandler(async (req, res)=>{
    if(!req.body.amount || !req.body.item || !req.body.status){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    const item = await Item.findOne({name: req.body.item})
    if(!item){
        res.status(400)
        throw new Error('Item nicht gefunden...')        
    }
    // new item from the db - add to inventory
    const inventory = await Inventory.create({
        item: item._id,
        amount: req.body.amount,
        status: req.user.name
    })
    if(!inventory) {
        res.status(400)
        throw new Error('Item konnte weder erstellt noch updated werden...') 
    }
    const created = await User.findByIdAndUpdate(req.user.id, {$push:{inventory: inventory}}, {new: true}) 
    if(!created){
        res.status(400)
        throw new Error('Item konnte nicht zum Nutzer hinzugefügt werden...') 
    }
    console.log("Item wurde erstellt und hinzgefügt")
    res.status(200).json({_id: inventory._id, item: item, amount: req.body.amount, status: req.user.name})
})


// @desc Update item in users inventory
// @route PUT /player/inventory
// @access Private
const updateInventory = asyncHandler(async (req, res)=>{
    console.log(req.body.item)
    console.log(typeof(req.user.id))
    let updated
    if(!req.body.item){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    if(req.body.amount && req.body.status){
        console.log("change both parameters")
        updated = await User.findOneAndUpdate({
            user: req.user.id,
            'inventory._id': req.body.item
        },
        {
            $set: {
                'inventory.$.amount': parseInt(req.body.amount),
                'inventory.$.status': req.body.status,
            }
        }, {new: true}).populate({path:'inventory.item',  model:'Item', select:'_id name category dice value rarity type price weight bonuses genus material'})
    } else if(req.body.amount){
        console.log("change amount")
        updated = await User.findOneAndUpdate({
            user: req.user.id,
            'inventory._id': req.body.item
        },
        {
            $set: {
                'inventory.$.amount': parseInt(req.body.amount),
            }
        }, {new: true}).populate({path:'inventory.item',  model:'Item', select:'_id name category dice value rarity type price weight bonuses genus material'})
    } else if(req.body.status){
        console.log("change status")
        updated = await User.findOneAndUpdate({
            user: req.user.id,
            'inventory._id': req.body.item
        },
        {
            $set: {
                'inventory.$.status': req.body.status,
            }
        }, {new: true}).populate({path:'inventory.item',  model:'Item', select:'_id name category dice value rarity type price weight bonuses genus material'})
    }
    if(!updated){
        res.status(400).json({error: "Das Update ist fehlgeschlagen"})
    } else {
        console.log("success")
        res.status(200).json(updated.inventory)
    }
})


// @desc Remove item from users inventory
// @route DELETE /player/inventory/:id
// @access Private
const deleteItem =  asyncHandler(async (req, res) => {
    if(!req.params.id){
        res.status(400)
        throw new Error('Bitte überprüfe deine Eingabe!')
    }
    const removed = await User.findOneAndUpdate({
        user: req.user.id,
        'inventory._id': req.params.id
    }, 
    {
        $pull: {
            'inventory': {_id:req.params.id}
        }
    }, {new: true})
    if(!removed){
        res.status(400)
        throw new Error('Removed geht nicht!', req.params.id)
    }
    res.status(200).json({id:req.params.id})
})


const setEnchantment = asyncHandler(async (req, res)=>{
    console.log(req.body)
    console.log(req.user.id)
    if(!req.body.id){ 
        res.status(400).json({message: "nicht autorisiert für die Verzauberung"})
        throw new Error('Nicht autorisuert!')
    }
    if(!req.body.id || !req.body.rarity || !req.body.bonuses){
        res.status(400).json({message: "überprüfe deine Eingabe"})
        throw new Error('überprüfe deine Eingabe')
    }
    const enchantment = {rarity: req.body.rarity, bonuses: req.body.bonuses}
    const enchanted = await User.findOneAndUpdate({
        user: req.user.id,
        'inventory._id': req.body.id
    },
    {
        $set: {
            'inventory.$.enchantment': enchantment
        }
    }, {new: true}).populate({path:'inventory.item',  model:'Item', select:'_id name category price bonuses value weight rarity genus dice material type'})      
    if(!enchanted){
        res.status(400).json({message:"Verzaubern fehlgeschlagen"})
        throw new Error('Verzaubern geht nicht!', req.body.id)
    }
    console.log(enchanted.inventory)
    res.status(200).json(enchanted.inventory)
})

module.exports = {
    getPlayer, 
    createCharacter,
    updateLevel,
    updateAttribute,
    updateBalance,
    toInventory,
    updateInventory,
    deleteItem,
    setEnchantment,
    addTalent,
    putTalent,
    removeTalent,
    uploadPicture,
}
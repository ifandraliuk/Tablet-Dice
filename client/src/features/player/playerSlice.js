import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import playerService from './playerService'

const vitality = JSON.parse(localStorage.getItem('vitality'))
const stamina = JSON.parse(localStorage.getItem('stamina'))
const mana = JSON.parse(localStorage.getItem('mana'))
const spirit = JSON.parse(localStorage.getItem('spirit'))
const equippedItems = JSON.parse(localStorage.getItem('equippedItems'))
console.log("spirit local", spirit)
console.log("vitality local", vitality)
const initialState = {
    player: [],
    bars:{
       vitality: vitality ? vitality : 0, 
       stamina: stamina ? stamina : 0,
       mana: mana ? mana : 0, 
       spirit: spirit ? spirit : 0,
    },
    
    equipped: equippedItems ? equippedItems : [],
    armor: 0,
    bonis: [],
    equipmentError: {variant:"", msg:""},
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get player for logged in user
export const getPlayer = createAsyncThunk('player/get', async(_, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.getPlayer(token)
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
            console.log((error.message))
        localStorage.removeItem("user")
        return thunkAPI.rejectWithValue(msg)        
    }
})

// Create new character
export const levelUp = createAsyncThunk('player/levelup/put', async(_, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.levelUp(token)
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
            console.log((error.message))
        return thunkAPI.rejectWithValue(msg)        
    }
})

// Post user attributes 
export const createAttributes = createAsyncThunk('player/attributes/create', async(attributesData, thunkAPI)=> {
    try {
        const token = thunkAPI.getState().auth.user.token
        console.log('frontend - player/attributes/create add attributes to user')
        console.log(token, attributesData)
        return await playerService.createAttributes(attributesData, token)
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
            console.log((error.message))
        return thunkAPI.rejectWithValue(msg)
    }
})

//Create general info
export const createGeneral = createAsyncThunk('player/general/create', async(generalData, thunkAPI)=> {
    try {
        const token = thunkAPI.getState().auth.user.token
        console.log('frontend - player/general/create add general info to user')
        return await playerService.createGeneral(generalData, token)
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)
    }
})

// Posting a class to user
export const addClass = createAsyncThunk('player/classes/create', async(classData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.addClass(classData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})
// Posting a class to user
export const putTalent = createAsyncThunk('player/talents/putAll', async(talentData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.putTalent(talentData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})

export const toInventory = createAsyncThunk('player/inventory/post', async(itemData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.toInventory(itemData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})

export const updateInventory = createAsyncThunk('player/inventory/putAll', async(inventoryData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.updateInventory(inventoryData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})
export const deleteItem = createAsyncThunk('player/inventory/delete', async(id, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.deleteItem(id, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})

export const setEnchantment = createAsyncThunk('player/enchantment/put', async(enchantmentData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.setEnchantment(enchantmentData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        reset: (state) => initialState,
        increaseBar: (state, {payload})=>{
            const newValue = parseInt(state.bars[payload.category] + payload.value)
            localStorage.setItem(payload.category, newValue)
            state.bars[payload.category] = newValue
            console.log(state.bars[payload.category])
        },
        decreaseBar: (state, {payload})=>{
            const newValue = parseInt(state.bars[payload.category] - payload.value)
            if(newValue >= 0 && newValue<=state.player?.attributes[payload.category]*10){
                localStorage.setItem(payload.category, newValue)
                state.bars[payload.category] = newValue
                console.log(state.bars[payload.category])
            }

        },
        resetBars: (state)=>{
            state.bars = {
                vitality: state.player?.attributes?.vitality * 10,
                stamina: state.player?.attributes?.stamina * 10,
                mana: state.player?.attributes?.mana * 10,
                spirit: state.player?.attributes?.spirit * 10,
            }
            localStorage.setItem("vitality", state.bars?.vitality)
            localStorage.setItem("stamina", state.bars.stamina)
            if(state.bars?.mana>0){
                
                localStorage.setItem("mana", state.bars?.mana)
            }
            if(state.bars?.spirit>0){
                console.log("reseting spirit")
                localStorage.setItem("spirit", state.bars?.spirit)
            }

        },
        filterEquipment: (state)=> {  
            state.equipmentError = {variant:"", msg:""}
                //console.log("already created")
                const equippedInventory = state.player.inventory?.filter(el=>el.status==="Ausgerüstet").length
                const equippedCashed = state.equipped?.filter(el=>el.equipment).length
            if(equippedInventory === equippedCashed){
            } else {
                console.log("no casched equipment found")
                const filtered = state.player.inventory?.filter(el=>el.status==="Ausgerüstet")
                state.equipped = [
                    {category: "Kopf", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Kopf")]?._id},
                    {category: "Beine", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Beine")]?._id},
                    {category: "Hals", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Hals")]?._id}, 
                    {category: "Rücken", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Rücken")]?._id},
                    {category: "Brust", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Brust")]?._id},
                    {category: "Füße", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Füße")]?._id},    
                    {category: "Arme", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Arme")]?._id},
                    {category: "Hüfte", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Hüfte")]?._id},
                    {category: "Finger", equipment: filtered[filtered.findIndex(el=>el.item.genus==="Finger")]?._id},    
                ]
                let weapons = []
                let shield = []
                let consumables = []
                filtered.forEach(element => {
                    if(element.item.category==="Waffe" && element.item.genus!=="Ausrüstung"){
                        weapons.push(element)
                    } else if( element.item.genus==="Schild"){
                        shield.push(element)
                    } else if (element.item.genus === "Ausrüstung" || element.item.genus==="Nahrung"){
                        consumables.push(element)
                    }
                });
                if(weapons?.length===1){
                    if(weapons[0].item.type === "einhändig"){
                        if(shield.length===1){
                            //console.log("Einhandwaffe und Schild")
                            state.equipped.push({category:"Nebenhand", equipment:shield[0]._id })
                            state.equipped.push({category:"Haupthand", equipment: weapons[0]._id})
                        } else{
                            //console.log("1 Einhandwaffe",  weapons[0]._id)
                            state.equipped.push({category:"Haupthand", equipment: weapons[0]._id})
                        }
                    } else {
                        //console.log("Zweihandwaffe")
                        if(shield){
                            //console.log("Zweihandwaffe und Schield gefunden")
                            if(state.player?.userclass?.name === "Schildwache"){
                                state.equipped.push({category:"Nebenhand", equipment:shield[0]._id })
                            } else {
                                state.equipmentError = ({variant:"warning", msg:"Dein Charakter kann nicht eine Zweihandwaffe u. Schild ausrüsten. Das Schild wird ignoriert."})
                            }             
                        }
                        state.equipped.push({category:"Haupthand", equipment: weapons[0]._id })
                    }
                } else if(weapons?.length === 2){
                    //console.log("Found 2 weapons", weapons[0].item.type)
                    if(weapons[0].item.type === "einhändig" && weapons[0].item.type==="einhändig"){
                        //console.log("Zwei Einhandwaffen")
                        if(state.player?.userclass?.name === "Assassine" || state.player?.userclass?.name === "Waffenmeister"){
                            state.equipped.push({
                                category:"Haupthand", equipment:weapons[0]._id
                            })
                            state.equipped.push({category:"Nebenhand", equipment:weapons[1]._id})
                        } else {
                            state.equipmentError = ({variant:"warning", msg:`Dein Charakter kann nicht zwei Einhandwaffen ausrüsten. Nur ${weapons[0].item.name} wurde ausgerüstet.`})
                        }

                    }
                } else if(weapons?.length>2){
                    state.equipmentError({variant:"danger", msg:"Zu viele Waffen wurden ausgerüstet. Bearbeite deine Eingabe im Inventar."})
                    //console.log("Error, zu viele Waffen ausgewählt.")
                }
                // equipping consumable item - restriction - only 1 is allowed
                if(consumables?.length > 0){
                    consumables.length === 1 ?
                        state.equipped.push({category:"Verbrauch", equipment:consumables[0]._id}) :
                        state.equipmentError = ({variant:"danger", msg:"Dein Charakter kann nur ein Item aus der Kategorie Verbrauch ausrüsten. Bearbeite deine Eingabe."})
                        
                }
               localStorage.setItem("equippedItems", JSON.stringify(state.equipped)) 
            }

        },
        getArmor: (state) => {
            let armor = 0
            if(state.equipped && state.player.inventory){
                state.equipped?.forEach(element=>{
                    const item = state.player?.inventory.find(el=> element.equipment=== el._id)?.item
                    if(item && item.category.toString()==="Rüstung"){
                        armor += item.value
         
                    }
                })
                    state.armor = armor
            }          

        },
        getBonis: (state)=>{
            let bonis = []
            if(state.equipped && state.player.inventory){
                state.equipped?.forEach(element=>{
                    const el = state.player?.inventory.find(el=> element.equipment=== el._id)
                    if(el?.item){
                        if(el.item.bonuses){
                            bonis.push(el.item.bonuses)
                        }
                        if(el.enchantment){
                
                            bonis.push(el.enchantment.bonuses)
                        }
                    }
                })
                state.bonis = bonis
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPlayer.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getPlayer.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player = action.payload
            state.bars = {
                vitality: vitality>0 ? vitality : state.player?.attributes.vitality * 10,
                stamina: stamina>0 ? stamina : state.player?.attributes.stamina * 10,
                mana: mana>0 ? mana : state.player?.attributes.mana * 10,
                spirit: spirit>0 ? spirit : state.player?.attributes.spirit * 10,
            }
        })
        .addCase(getPlayer.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(levelUp.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(levelUp.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player.level = action.payload
        })
        .addCase(levelUp.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(createAttributes.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createAttributes.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            //state.player.attributes = action.payload
        })
        .addCase(createAttributes.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(createGeneral.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createGeneral.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
           // state.general = action.payload
        })
        .addCase(createGeneral.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(addClass.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(addClass.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(addClass.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
         .addCase(updateInventory.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(updateInventory.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player.inventory = action.payload
        })
        .addCase(updateInventory.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(toInventory.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(toInventory.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player.inventory.push(action.payload)
        })
        .addCase(toInventory.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        }) 
        .addCase(deleteItem.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(deleteItem.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player.inventory = state.player.inventory.filter((item)=>item._id !== action.payload.id)
        })
        .addCase(deleteItem.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        }) 
        .addCase(putTalent.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(putTalent.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
        })
        .addCase(putTalent.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(setEnchantment.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(setEnchantment.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player.inventory = action.payload
        })
        .addCase(setEnchantment.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset, increaseBar, decreaseBar, resetBars, filterEquipment, getArmor, getBonis} = playerSlice.actions
export default playerSlice.reducer
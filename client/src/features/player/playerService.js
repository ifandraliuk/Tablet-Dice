import axios from "axios";

const API_URL = '/player/'

// Get all player info
const getPlayer = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    console.log('frontend request to get player info')
    console.log(config)
    const localVit = JSON.parse(localStorage.getItem('vitality'))
    console.log("get player service check: vitality")
    console.log(localVit)
    const localSt = JSON.parse(localStorage.getItem('stamina'))
    const localM = JSON.parse(localStorage.getItem('mana'))
    const localS = JSON.parse(localStorage.getItem('spirit'))
    const loadCapacity = JSON.parse(localStorage.getItem('loadCapacity'))
    
    const response = await axios.get(API_URL, config)
    if(!localVit){
        localStorage.setItem("vitality", parseInt(response.data.attributes?.vitality*10))
    }
    if(!localSt){
        localStorage.setItem("stamina", parseInt(response.data.attributes?.stamina*10))
    }
    if(!localM && response.data.attributes?.mana>0){
        localStorage.setItem("mana", parseInt(response.data.attributes?.mana*10))
    }
    if(!localS && response.data.attributes?.spirit>0){
        console.log("adding spirit")
        localStorage.setItem("spirit", parseInt(response.data.attributes?.spirit*10))
    }
    if(!loadCapacity){
        const strength = parseInt(response.data.attributes?.strength)
        console.log(strength)
        const multiplier = strength>=1 && strength <=5 ? 1 : strength>=6 && strength <=10 ? 2 : strength>=11 && strength <=15 ? 3 : strength>=16 && strength <=20 ? 4 : 0
        console.log(multiplier)
        localStorage.setItem("loadCapacity", parseInt(strength*multiplier))
    }
    return response.data
}

const updateLevel = async (token) => {
    console.log("frontend - level up")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    console.log(config)
    const response = await axios.put(API_URL + 'levelup',null, config)
    console.log(response, response.data)
    return response.data
}
// put talent to user
const updateAttribute = async (attributeData, token) => {
    console.log('frontend request to put a talent to user')
    console.log(attributeData)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'attributes/' + attributeData, null, config )
    return response.data
}

// put talent to user
const addTalent = async (talentData, token) => {
    console.log('frontend request to put a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'talents', talentData, config )
    return response.data
}
// put talent to user
const removeTalent = async (talentData, token) => {
    console.log('frontend request to put a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + 'talents/'+ talentData, config )
    return response.data
}


// put talent to user
const updateTalent = async (talentData, token) => {
    console.log('frontend request to put a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'talents', talentData, config )
    return response.data
}
// Put item from items db to users inventory 
const toInventory = async (itemData, token) => {
    console.log('frontend request to post an item to users inventory')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'inventory', itemData, config )
    return response.data
}

// update item in users inventory
const updateInventory = async (inventoryData, token) => {
    console.log('frontend request to update an item to users inventory')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'inventory', inventoryData, config )
    return response.data
}

// update money balance
const newBalance = async (moneyData, token) => {
    console.log('frontend request to update money')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'balance', moneyData, config )
    return response.data
}

// delete item from inventory
const deleteItem = async (id, token) => {
    console.log('frontend request to delete an item to users inventory')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + 'inventory/' + id, config )
    return response.data
}


const setEnchantment = async (enchantmentData, token) => {
    console.log('frontend request to add an enchantment to item in users inventory')
    console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'enchantment', enchantmentData, config )
    return response.data
}


const playerService = {
    getPlayer, updateLevel, newBalance, updateAttribute,addTalent,removeTalent, updateTalent, toInventory, updateInventory, deleteItem, setEnchantment, 

}

export default playerService
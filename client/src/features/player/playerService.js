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
    const response = await axios.get(API_URL, config)
    const localVit = JSON.parse(localStorage.getItem('vitality'))
    const localSt = JSON.parse(localStorage.getItem('stamina'))
    const localM = JSON.parse(localStorage.getItem('mana'))
    const localS = JSON.parse(localStorage.getItem('spirit'))
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
    return response.data
}

const levelUp = async (token) => {
    console.log("frontend - create character")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'levelup', config )
    console.log(response, response.data)
    return response.data
}

// Create attributes
const createAttributes = async (attributesData, token) => {
    console.log("frontend - create attribute")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'attributes', attributesData, config )
    console.log(response, response.data)
    return response.data
}


// Create general info
const createGeneral = async (generalData, token) => {
    console.log("frontend - create general info for user")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'general', generalData, config )
    return response.data
}

// Post class to user
const addClass = async (classData, token) => {
    console.log('frontend request to post a class to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'uclass', classData, config )
    return response.data
}

// Update class to user
const putTalent = async (talentData, token) => {
    console.log('frontend request to put a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'talents', talentData, config )
    return response.data
}
// Put item to inventory class to user
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

// Put item to inventory class to user
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
// Put item to inventory class to user
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
    getPlayer, levelUp, createAttributes, createGeneral, addClass, putTalent, toInventory, updateInventory, deleteItem, setEnchantment, 

}

export default playerService
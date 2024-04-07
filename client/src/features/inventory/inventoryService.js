import axios from "axios";

const API_URL = '/inventory/'

const getInventory = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL, config)
    return response.data
}

const getArmor = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "armor", config)
    return response.data
}

const getLoadCapacity = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/capacity", config)
    return response.data
}



const getCategoryBoni = async (data,token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(`/bonus/${data}`, config)
    return response.data
}


const getUserWeapons = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/weapons", config)
    return response.data
}
const getUserMoney = async (token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + "/money", config)
    return response.data
}

// update money balance
const updateMoney = async (moneyData, token) => {
    console.log("frontend request to update money");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL + "money", moneyData, config);
    return response.data;
  };
const addAmount = async (data, token) => {
   
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + "add-one/", data, config)
    return response.data
}
const substractAmount = async (data, token) => {
   
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + "substract-one/", data, config)
    return response.data
}
const addToInventory = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL, data, config)
    return response.data
}

const removeFromInventory = async (id, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.delete(API_URL + id, config)
    return response.data
}

const splitAmount = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + "split/", data, config)
    return response.data
}

const shareWith = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + "share/", data, config)
    return response.data
}

const equip = async (itemData, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + "equip/", itemData, config)
    return response.data
}

const unequip = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(API_URL + "unequip/", data, config)
    return response.data
}


const filterInventory = async (data, token) => {
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    console.log(config)
    const response = await axios.get(`${API_URL}filter/${data}`, config );
    return response.data
}



const inventoryPageService = {
    getInventory, // get users inventory
    getArmor, // get armor and armor category
    getLoadCapacity, // get users capacity
    getCategoryBoni, // get equipped boni for one category
    getUserWeapons, // get equipped weapons
    getUserMoney, // get money
    updateMoney,
    addAmount, //add + 1 to items amount
    substractAmount, // -1
    addToInventory, // add item from dm to users inventory
    removeFromInventory, // remove inventory item
    splitAmount, // split given amount from the item
    shareWith, // send the item to other user
    equip, // equip item to user
    unequip, // equip item to user
    filterInventory, // get specific category from inventory
    
}

export default inventoryPageService
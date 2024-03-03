import axios from "axios";

const API_URL = '/companion/'

// post companion to user
const addCompanion = async (compData, token) => {
    console.log("frontend request to add a companion to user");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.post(API_URL, compData, config);
    return response.data;
  };
  // post companion to user
  const updateCompanionStatus = async (compData, token) => {
    console.log("frontend request to update a companion to user");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL, compData, config);
    return response.data;
  };
  
  // put an equipment to the companion
  const equipToCompanion = async (compData, token) => {
    console.log("frontend request to equip an item to a companion");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL + "companion/equip", compData, config);
    return response.data;
  }
  // unequip slot to the companion
  const unequipCompanionItem = async (compData, token) => {
    console.log("frontend request to unequip an item ");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL + "companion/item", compData, config);
    return response.data;
  }

const companionService = {
    addCompanion,
    updateCompanionStatus,
    equipToCompanion,
    unequipCompanionItem,

}

export default companionService
import axios from "axios";

const API_URL = '/companion/'

// get companions for the user
const getCompanion = async ( token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};


// get the amount of available slots for the user
const getSlotsAvailable = async ( token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "slots/", config);
  return response.data;
};

// get equipable items for the companions
const getEquipable = async ( token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + "equipable/", config);
  return response.data;
};

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
  
    const response = await axios.put(API_URL + "equip/", compData, config);
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
  
    const response = await axios.put(API_URL + "item/", compData, config);
    return response.data;
  }

const companionService = {
    getCompanion,
    getSlotsAvailable,
    getEquipable,
    addCompanion,
    updateCompanionStatus,
    equipToCompanion,
    unequipCompanionItem,

}

export default companionService
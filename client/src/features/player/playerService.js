import axios from "axios";

const API_URL = "/player/";

// Get all player info
const getPlayer = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log("frontend request to get player info");
  console.log(config);
  const localVit = JSON.parse(localStorage.getItem("vitality"));
  console.log("get player service check: vitality");
  console.log(localVit);
  const localSt = JSON.parse(localStorage.getItem("stamina"));
  const localM = JSON.parse(localStorage.getItem("mana"));
  const localS = JSON.parse(localStorage.getItem("spirit"));
  const loadCapacity = JSON.parse(localStorage.getItem("loadCapacity"));
  const slotsAllowed = JSON.parse(localStorage.getItem("slotsAllowed"));
  const fraction = localStorage.getItem("fraction");
  const response = await axios.get(API_URL, config);
  if (!localVit) {
    const value = response.data.attributes?.vitality
      ? response.data.attributes?.vitality
      : 0;
    console.log("adding vitality");
    localStorage.setItem("vitality", parseInt(value * 10));
  }
  if (!localSt) {
    const value = response.data.attributes?.stamina
      ? response.data.attributes?.stamina
      : 0;
    console.log("adding stamina");
    localStorage.setItem("stamina", parseInt(value * 10));
  }
  if (!localM && response.data.attributes?.mana > 0) {
    const value = response.data.attributes?.mana
      ? response.data.attributes?.mana
      : 0;
    console.log("adding mana");
    localStorage.setItem("mana", parseInt(value * 10));
  }
  if (!localS && response.data.attributes?.spirit > 0) {
    const value = response.data.attributes?.spirit
      ? response.data.attributes?.spirit
      : 0;
    console.log("adding spirit");
    localStorage.setItem("spirit", parseInt(value * 10));
  }
  if (!loadCapacity) {
    const strength = parseInt(response.data.attributes?.strength);
    console.log(strength);
    const multiplier =
      strength >= 1 && strength <= 5
        ? 1
        : strength >= 6 && strength <= 10
        ? 2
        : strength >= 11 && strength <= 15
        ? 3
        : strength >= 16 && strength <= 20
        ? 4
        : 0;
    console.log(multiplier);
    localStorage.setItem("loadCapacity", parseInt(strength * multiplier));
  }
  if(!slotsAllowed) {
    const charisma = parseInt(response.data.attributes?.charisma)
    const slotsAllowed = 
      charisma >= 1 && charisma < 5 
      ? 1 
      : charisma >= 5 && charisma < 10 
      ? 2 
      : charisma >= 10 && charisma < 15
      ? 3
      : charisma >= 15 && charisma < 20
      ? 4
      : charisma >= 20
      ? 5 
      : 0
    localStorage.setItem("slotsAllowed", parseInt(slotsAllowed));
  }
  if (!fraction) {
    const origin = response.data.general?.origin.split(" ");
    console.log(origin);
    console.log(response.data.general);
    const originName = origin ? origin[origin.length - 1] : "";
    console.log(originName);
    localStorage.setItem("fraction", originName);
    console.log("local fraction: ", originName);
  }
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

  const response = await axios.post(API_URL + "companion", compData, config);
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

  const response = await axios.put(API_URL + "companion", compData, config);
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

const updateLevel = async (token) => {
  console.log("frontend - level up");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(config);
  const response = await axios.put(API_URL + "levelup", null, config);
  console.log(response, response.data);
  return response.data;
};
// put talent to user
const updateAttribute = async (attributeData, token) => {
  console.log("frontend request to put a talent to user");
  console.log(attributeData);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + "attributes/" + attributeData,
    null,
    config
  );
  return response.data;
};

// put talent to user
const addTalent = async (talentData, token) => {
  console.log("frontend request to put a talent to user");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "talents", talentData, config);
  return response.data;
};
// put talent to user
const removeTalent = async (talentData, token) => {
  console.log("frontend request to put a talent to user");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    API_URL + "talents/" + talentData,
    config
  );
  return response.data;
};

// put talent to user
const updateTalent = async (talentData, token) => {
  console.log("frontend request to put a talent to user");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + "talents", talentData, config);
  return response.data;
};
// Put item from items db to users inventory
const toInventory = async (itemData, token) => {
  console.log("frontend request to post an item to users inventory");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + "inventory", itemData, config);
  return response.data;
};

// update item in users inventory
const updateInventory = async (inventoryData, token) => {
  console.log("frontend request to update an item to users inventory");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + "inventory",
    inventoryData,
    config
  );
  return response.data;
};

// update money balance
const newBalance = async (moneyData, token) => {
  console.log("frontend request to update money");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + "balance", moneyData, config);
  return response.data;
};

// delete item from inventory
const deleteItem = async (id, token) => {
  console.log("frontend request to delete an item to users inventory");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + "inventory/" + id, config);
  return response.data;
};

const setEnchantment = async (enchantmentData, token) => {
  console.log(
    "frontend request to add an enchantment to item in users inventory"
  );
  console.log(token);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    API_URL + "enchantment",
    enchantmentData,
    config
  );
  return response.data;
};

const playerService = {
  getPlayer,
  updateLevel,
  newBalance,
  addCompanion,
  updateCompanionStatus,
  equipToCompanion,
  unequipCompanionItem,
  updateAttribute,
  addTalent,
  removeTalent,
  updateTalent,
  toInventory,
  updateInventory,
  deleteItem,
  setEnchantment,
};

export default playerService;

import axios from "axios";

const API_URL = '/talents/'

const getTalent = async (token) => {

    console.log('frontend request to get all talents')
    const response = await axios.get(API_URL)
    return response.data
}

const getPlayerTalent = async (token) => {

    console.log('frontend request to get all player talents')
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL + "player", config)
    return response.data
}

// put talent to user
const addToPlayer = async (talentData, token) => {
    console.log("frontend request to put a talent to user");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.post(API_URL + "to_player", talentData, config);
    return response.data;
  };
  // put talent to user
  const removeFromPlayer = async (talentData, token) => {
    console.log("frontend request to put a talent to user");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.delete(
      API_URL + "from_player" + talentData,
      config
    );
    return response.data;
  };
  
  // put talent to user
  const updatePlayersTalent = async (talentData, token) => {
    console.log("frontend request to put a talent to user");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL + "talents", talentData, config);
    return response.data;
  };
const talentService = {
    getTalent,
    getPlayerTalent,
    addToPlayer,
    removeFromPlayer,
    updatePlayersTalent,

}

export default talentService
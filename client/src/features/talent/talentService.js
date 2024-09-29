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

const getUserBoni = async (token) => {

  console.log('frontend request to get all player talents')
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "userboni", config)
  return response.data
}


// put talent to user
const addToPlayer = async (talentData, token) => {
    console.log("frontend request ");
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
    console.log("frontend request to reemove a talent from user: ", talentData);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.delete(
      `${API_URL}from_player/${talentData.id}`, // Correctly format the URL
      config
    );
    return response.data;
  };
  
  // put talent to user
  const updatePlayersTalent = async (talentData, token) => {
    debugger
    console.log("Sending talent update to backend:", talentData);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    const response = await axios.put(API_URL + "to_player", talentData, config);
    return response.data;
  };
const talentService = {
    getTalent,
    getUserBoni,
    getPlayerTalent,
    addToPlayer,
    removeFromPlayer,
    updatePlayersTalent,

}

export default talentService
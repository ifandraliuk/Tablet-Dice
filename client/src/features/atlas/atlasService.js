import axios from "axios";

const API_URL = "/atlas/";

const getKingdom = async (token) => {
  const response = await axios.get(API_URL + "kingdom/");
  return response.data;
};

const getHabitatCreature = async (data, token) => {
  const {habitat, register} = data
  const response = await axios.get(`/creatures/${habitat}/${register}`);
  return response.data;
};

const atlasService = {
  getKingdom,
  getHabitatCreature,
};

export default atlasService;

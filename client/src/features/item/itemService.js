import axios from "axios";

const API_URL = "/items/";

const getItem = async (data, token) => {
  const { category, genus, n, m,rarity } = data;
  console.log("frontend request to get all items");
  const response = await axios.get(`${API_URL}${category}/${genus}/${n}/${m}/${rarity}`);
  return response.data;
};

const searchInCategory = async (data, token) => {
  const { category, genus, n, searchText, rarity } = data;
  console.log("frontend request to search items in category");
  const response = await axios.get(
    `${API_URL}/searchInCategory/${category}/${genus}/${n}/${searchText}/${rarity}`
  );
  return response.data;
};

const itemService = {
  getItem,
  searchInCategory,
};

export default itemService;

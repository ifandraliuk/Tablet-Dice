import axios from "axios";

const API_URL = "/items/";

const getItem = async (data, token) => {
  const { category, genus, n, m, rarity, production } = data;
  console.log("frontend request to get all items");
  const response = await axios.get(
    `${API_URL}${category}/${genus}/${n}/${m}/${rarity}`,
    { params: { production } }
  );
  return response.data;
};

const searchInCategory = async (data, token) => {
  const { category, genus, n, searchText, rarity, production } = data;
  console.log("frontend request to search items in category");
  const response = await axios.get(
    `${API_URL}/searchInCategory/${category}/${genus}/${n}/${searchText}/${rarity}`,
    { params: { production } }
  );
  return response.data;
};

const getProductions = async ({ category, genus }) => {
  const response = await axios.get(
    `${API_URL}productions/${encodeURIComponent(category)}/${encodeURIComponent(genus)}`
  );
  return response.data;
};

const itemService = {
  getItem,
  searchInCategory,
  getProductions,
};

export default itemService;

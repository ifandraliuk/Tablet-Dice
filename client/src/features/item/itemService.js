import axios from "axios";

const API_URL = '/items/'

const getItem = async (data, token) => {
    const {category, genus, n,m} = data
    console.log('frontend request to get all items')
    const response = await axios.get(`${API_URL}${category}/${genus}/${n}/${m}`)
    return response.data
}



const itemService = {
    getItem
}

export default itemService
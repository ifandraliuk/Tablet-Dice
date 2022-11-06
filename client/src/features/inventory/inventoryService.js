import axios from "axios";

const API_URL = '/items/'

const getItem = async (token) => {

    console.log('frontend request to get all items')
    const response = await axios.get(API_URL)
    return response.data
}


const inventoryService = {
    getItem

}

export default inventoryService
import axios from "axios";


const API_URL = '/atlas/'

const getKingdom = async (token) => {
    const response = await axios.get(API_URL + "kingdom/")
    return response.data
}


const atlasService = {
    getKingdom

}

export default atlasService
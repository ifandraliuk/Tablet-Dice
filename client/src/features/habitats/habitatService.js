import axios from "axios";


const API_URL = '/habitats/'

const getHabitat = async (token) => {

    console.log('frontend request to get all habitats')
    const response = await axios.get(API_URL)
    return response.data
}


const habitatService = {
    getHabitat

}

export default habitatService
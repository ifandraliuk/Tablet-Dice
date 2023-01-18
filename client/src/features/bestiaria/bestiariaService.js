import axios from "axios";


const API_URL = '/creatures/'

const getBestiaria = async (token) => {

    console.log('frontend request to get all creatures')
    const response = await axios.get(API_URL)
    return response.data
}


const bestiariaService = {
    getBestiaria

}

export default bestiariaService
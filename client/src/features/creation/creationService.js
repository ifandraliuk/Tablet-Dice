import axios from "axios";

const API_URL = '/professions/'
const PLAYER_URL = '/player/'

const getClass = async () => {

    console.log('frontend request to get all classes')
    const response = await axios.get(API_URL)
    return response.data
}

const uploadPicture = async (pictureData, token)=> {
    console.log("frontend upload picture")
    const config = {
        headers:{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(PLAYER_URL + 'profilepic', pictureData, config )
    return response.data
}
// Create character
const createCharacter = async (characterData, token) => {
    console.log("frontend - create character")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(PLAYER_URL + 'create', characterData, config )
    return response.data
}
const creationService = {
    getClass, uploadPicture, createCharacter

}

export default creationService
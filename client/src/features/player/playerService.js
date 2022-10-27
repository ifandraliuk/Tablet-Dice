import axios from "axios";

const API_URL = '/player/'

// Get all player info
const getPlayer = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    console.log('frontend request to get player info')
    const response = await axios.get(API_URL, config)
    return response.data
}

// Create attributes
const createAttributes = async (attributesData, token) => {
    console.log("frontend - create attribute")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'attributes', attributesData, config )
    console.log(response, response.data)
    return response.data
}

// Create general info
const createGeneral = async (generalData, token) => {
    console.log("frontend - create general info for user")
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'general', generalData, config )
    return response.data
}

// Post class to user
const addClass = async (classData, token) => {
    console.log('frontend request to post a class to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'uclass', classData, config )
    return response.data
}

// Post class to user
/* const postTalent = async (talentData, token) => {
    console.log('frontend request to post a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL + 'talents', talentData, config )
    return response.data
} */
// Update class to user
const putTalent = async (talentData, token) => {
    console.log('frontend request to put a talent to user')
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(API_URL + 'talents', talentData, config )
    return response.data
}

const playerService = {
    getPlayer, createAttributes, createGeneral, addClass, putTalent,

}

export default playerService
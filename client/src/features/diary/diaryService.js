import axios from "axios";

const API_URL = '/diary/'

//TO DELETE getDiary
const getDiary = async () => {

    console.log('frontend request to get all diary')
    const response = await axios.get(API_URL)
    return response.data
}
const getMyDiary = async (diaryData) => {

    console.log('frontend request to get only my diary')
    const response = await axios.get(API_URL + diaryData)
    return response.data
}


const getUsers = async () => {

    console.log('frontend request to get all diary')
    const response = await axios.get(API_URL + "/userlist")
    return response.data
}

const postDiary = async (diaryData) => {

    console.log('frontend request to post element into diary')
    const response = await axios.post(API_URL, diaryData)
    return response.data
}

const editDiary = async (diaryData) => {

    console.log('frontend request to update')
    console.log(diaryData)
    const response = await axios.put(API_URL + diaryData.id, diaryData.data)
    return response.data
}

//TO DELETE getDiary
const removeDiary = async (diaryData) => {

    console.log('frontend request to delete diary')
    const response = await axios.delete(API_URL + diaryData)
    return response.data
}

const diaryService = {
    getDiary, getMyDiary, getUsers, postDiary, editDiary, removeDiary

}

export default diaryService
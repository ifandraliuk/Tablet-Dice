import axios from 'axios';


const API_URL = "/users/"

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)
    //axios storage data in it, check if not null
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.setItem('registered', JSON.stringify(true))
    }

    return response.data
}

// login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
    //axios storage data in it, check if not null
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        localStorage.removeItem('registered')
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("fraction")
    localStorage.clear();
    
}

const authService = {
    register,
    login,
    logout,

}

export default authService
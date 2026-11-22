import axios from 'axios';
import { clearSessionStorage } from "../../data/localStorage";


const API_URL = "/users/"

// Register user
const register = async (userData) => {
    const response = await axios.post(API_URL, userData)
    //axios storage data in it, check if not null
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      
    }

    return response.data
}

// login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData)
    //axios storage data in it, check if not null
    if(response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
        
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("fraction")
    clearSessionStorage();
    
}

const authService = {
    register,
    login,
    logout,

}

export default authService
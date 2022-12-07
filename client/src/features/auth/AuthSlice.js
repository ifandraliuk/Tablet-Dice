import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from './authService'
// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))
console.log(user)
const registered = JSON.parse(localStorage.getItem('registered'))
const initialState = {
    user: user ? user : null,
    registered: registered ? registered : false,
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''
}

// register User
export const register = createAsyncThunk('auth/register', async(user, thunkAPI)=>{
    try{
        return await authService.register(user)
    }catch(error){
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)
    }
})
// Login User
export const login = createAsyncThunk('auth/login', async(user, thunkAPI)=>{
    try{
        return await authService.login(user)
    }catch(error){
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)
    }
})
export const logout = createAsyncThunk('/auth/logout', async () =>{
     await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // after login return states to default values
        reset: (state) => {
            state.isLoading = false        
            state.isError = false
            state.isSuccess = false
            state.message = ''

        },
        registationFullfilled: (state)=> {
            state.registered = false
            localStorage.removeItem("registered")
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            state.registered = true
        })
        .addCase(register.rejected, (state, action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(login.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action)=>{
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
        })
        .addCase(login.rejected, (state, action)=>{
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        })
        .addCase(logout.fulfilled, (state)=>{
            state.user = null
        })
    }
})

export const {reset, registationFullfilled} = authSlice.actions
export default authSlice.reducer
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import habitatService from './habitatService'

const initialState = {
    habitat: [],
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get talents 
export const getHabitat = createAsyncThunk('habitats/getAll', async(_, thunkAPI)=>{
    try {
        return await habitatService.getHabitat()
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
            console.log((error.message))
        return thunkAPI.rejectWithValue(msg)        
    }
})


export const habitatSlice = createSlice({
    name: 'habitat',
    initialState,
    reducers: {
        reset: (state) => initialState,
        filter: (state, {payload})=>{
            return state.habitat.filter(el=>el.habitat._id===payload.id)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getHabitat.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getHabitat.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.habitat = action.payload
        })
        .addCase(getHabitat.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
    }
})

export const {reset, filter} = habitatSlice.actions
export default habitatSlice.reducer
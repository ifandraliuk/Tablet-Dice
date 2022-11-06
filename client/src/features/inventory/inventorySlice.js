import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import inventoryService from './inventoryService'

const initialState = {
    inventory: [],
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get talents 
export const getItem = createAsyncThunk('items/getAll', async(_, thunkAPI)=>{
    try {
        return await inventoryService.getItem()
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


export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getItem.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getItem.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.inventory = action.payload
        })
        .addCase(getItem.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
    }
})

export const {reset} = inventorySlice.actions
export default inventorySlice.reducer
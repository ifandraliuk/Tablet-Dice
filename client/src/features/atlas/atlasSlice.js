import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import atlasService from './atlasService'

const initialState = {
    kingdom: [],
    activeKingdomName: 'Belltamor',
    kingdomCategory: 'general',
    activeHabitat: {},
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get talents 
export const getKingdom = createAsyncThunk('kingdom/getAll', async(_, thunkAPI)=>{
    try {
        return await atlasService.getKingdom()
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


export const atlasSlice = createSlice({
    name: 'atlas',
    initialState,
    reducers: {
        reset: (state) => initialState,
        setKingdomCategory: (state, payload)=>{
            const {name, category} = payload
            return {
                ...state,
                activeKingdomName: name,
                kingdomCategory: category
            };
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getKingdom.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getKingdom.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.kingdom = action.payload
        })
        .addCase(getKingdom.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
    }
})

export const {reset, setKingdomCategory} = atlasSlice.actions
export default atlasSlice.reducer
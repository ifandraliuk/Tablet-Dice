import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import playerService from './playerService'

const initialState = {
    player: [],
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get player for logged in user
export const getPlayer = createAsyncThunk('player/get', async(_, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.getPlayer(token)
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

// Post user attributes 
export const createAttributes = createAsyncThunk('player/attributes/create', async(attributesData, thunkAPI)=> {
    try {
        const token = thunkAPI.getState().auth.user.token
        console.log('frontend - player/attributes/create add attributes to user')
        console.log(token, attributesData)
        return await playerService.createAttributes(attributesData, token)
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

//Create general info
export const createGeneral = createAsyncThunk('player/general/create', async(generalData, thunkAPI)=> {
    try {
        const token = thunkAPI.getState().auth.user.token
        console.log('frontend - player/general/create add general info to user')
        return await playerService.createGeneral(generalData, token)
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)
    }
})

// Posting a class to user
export const addClass = createAsyncThunk('player/classes/create', async(classData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.addClass(classData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})


// Posting a class to user
/* export const postTalent = createAsyncThunk('player/talents/createAll', async(talentData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.postTalent(talentData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
}) */

// Posting a class to user
export const putTalent = createAsyncThunk('player/talents/putAll', async(talentData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await playerService.putTalent(talentData, token)        
    } catch (error) {
        const msg = 
        (error.response && 
            error.response.data && 
            error.response.data.message) || 
            error.message || 
            error.toString()
        return thunkAPI.rejectWithValue(msg)        
    }
})

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPlayer.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getPlayer.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.player = action.payload
        })
        .addCase(getPlayer.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(createAttributes.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createAttributes.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            //state.player.attributes = action.payload
        })
        .addCase(createAttributes.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(createGeneral.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createGeneral.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
           // state.general = action.payload
        })
        .addCase(createGeneral.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(addClass.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(addClass.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
           // state.general = action.payload
        })
        .addCase(addClass.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
/*         .addCase(postTalent.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(postTalent.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
           // state.general = action.payload
        })
        .addCase(postTalent.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        }) */
        .addCase(putTalent.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(putTalent.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
           // state.general = action.payload
        })
        .addCase(putTalent.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = playerSlice.actions
export default playerSlice.reducer
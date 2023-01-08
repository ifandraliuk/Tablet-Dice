import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import diaryService from './diaryService'

const initialState = {
    userList: [],
    diary: [],
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get talents 
export const getUsers = createAsyncThunk('diary/userlist/getAll', async(_, thunkAPI)=>{
    try {
        return await diaryService.getUsers()
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

// Get talents 
export const postDiary = createAsyncThunk('diary/post', async(diaryData, thunkAPI)=>{
    try {
        return await diaryService.postDiary(diaryData)
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

// Edit talents 
export const editDiary = createAsyncThunk('diary/put', async(diaryData, thunkAPI)=>{
    try {
        return await diaryService.editDiary(diaryData)
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

// Get talents 
export const getMyDiary = createAsyncThunk('diary/get', async(diaryData, thunkAPI)=>{
    try {
        return await diaryService.getMyDiary(diaryData)
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


// Get talents 
export const removeDiary = createAsyncThunk('diary/delete', async(diaryData, thunkAPI)=>{
    try {
        return await diaryService.removeDiary(diaryData)
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


export const diarySlice = createSlice({
    name: 'diaries',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getUsers.pending, (state)=>{
            state.isLoading = true
            state.isLoading = false
            state.isError = false
        })
        .addCase(getUsers.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            console.log(action.payload)
            state.userList = action.payload
        })
        .addCase(getUsers.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(postDiary.pending, (state)=>{
            state.isLoading = true
            state.isLoading = false
            state.isError = false
        })
        .addCase(postDiary.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.diary.unshift(action.payload)
        })
        .addCase(postDiary.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(editDiary.pending, (state)=>{
            state.isLoading = true
            state.isLoading = false
            state.isError = false
        })
        .addCase(editDiary.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            console.log(action.payload)
            state.diary =  state.diary.map((d)=>(
                d._id === action.payload._id ? action.payload : d
            ))
        })
        .addCase(editDiary.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(removeDiary.pending, (state)=>{
            state.isLoading = true
            state.isLoading = false
            state.isError = false
        })
        .addCase(removeDiary.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.diary = state.diary.filter(d=>d._id!==action.payload.id)
        })
        .addCase(removeDiary.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(getMyDiary.pending, (state)=>{
            state.isLoading = true
            state.isLoading = false
            state.isError = false
        })
        .addCase(getMyDiary.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.diary = action.payload
        })
        .addCase(getMyDiary.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
    }
})

export const {reset} = diarySlice.actions
export default diarySlice.reducer

import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import creationService from './creationService'
const initialState = {
    data: {
        age: 0, 
        haircolor: '', 
        sex:'männlich', 
        eyecolor: '', 
        origin: '', 
        more: '', 
        haircut: '', 
        kind: '',
        userclass:"",
    },
    attributes: {
        strength: 0,
        dexterity: 0,
        intelligent: 0,
        vitality: 0,
        stamina: 0,
        charisma: 0,
        mana: 0,
        spirit: 0,
    },
    attrTotal: 70,
    dataFilled: false,
    imageUploaded: false,
    classes: [],
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''
}
export const getClass = createAsyncThunk('professions/getAll', async(_, thunkAPI)=>{
    try {
        return await creationService.getClass()        
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
export const uploadPicture = createAsyncThunk('player/profilepic/post', async(pictureData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await creationService.uploadPicture(pictureData, token)        
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

// Create new character
export const createCharacter = createAsyncThunk('player/create/post', async(characterData, thunkAPI)=>{
    try {
        const token = thunkAPI.getState().auth.user.token
        return await creationService.createCharacter(characterData, token)
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

export const creationSlice = createSlice({
    name: "creation",
    initialState,
    reducers:{
        setInfo: (state, {payload}) => {
            console.log(payload.name, payload.value)
            state.data[payload.name] = payload.value
        },
        setAttr: (state, {payload}) => {
            console.log(payload)
            state.attributes[payload.name] = payload.value
        },
        countTotal: (state)=>{
            const points = Object.values(state.attributes)
            console.log(points)
            let sum = points.reduce(function(a, b){
                return parseInt(a) + parseInt(b);
              });
              console.log(sum)
              state.attrTotal = 70 - sum
              console.log("70 - sum=",sum, state.attrTotal)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getClass.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getClass.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.classes = action.payload
        })
        .addCase(getClass.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
        })
        .addCase(uploadPicture.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(uploadPicture.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.imageUploaded = true
        })
        .addCase(uploadPicture.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
            state.imageUploaded = false
        })
        .addCase(createCharacter.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createCharacter.fulfilled, (state, action)=> {
            state.isLoading = false
            state.dataFilled = true
            state.isSuccess = true
        })
        .addCase(createCharacter.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.dataFilled = false
            state.message= action.payload
        })
    }

})

export const {setInfo, setAttr, countTotal} = creationSlice.actions
export default creationSlice.reducer
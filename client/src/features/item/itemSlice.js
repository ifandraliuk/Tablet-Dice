import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import itemService from './itemService'
import { weapon, armor, ressource, companion, itemNames } from "../../data/ConstVariables";



const initialState = {
    data: [],
    n: 0,
    m: 10,
    genuses: [],
    weaponGenuses: [],
    armorGenuses: [],
    ressourceGenuses: [],
    activeGenus: "",
    activeCategory: "", 
    loaded:false,
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get items 
export const getItem = createAsyncThunk('items/get', async(data, thunkAPI)=>{
    console.log(data)
    try {
        return await itemService.getItem(data)
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


export const itemSlice = createSlice({
    name: 'items',
    initialState,
    reducers: {
        reset: (state) => initialState,
        search: (state, {payload}) => {
            console.log(payload)
            if(payload.name?.length>0){
                state.items = state.items.filter(el=>el.name.includes(payload.name))
            }
        },
        getGenuses: (state, action)=>{
           
            const category = action.payload.filter
            console.log(category)
            if(category === "Waffe"){
                state.genuses = Object.keys(weapon)
            } else if(category === "Begleiter"){
                state.genuses = Object.keys(companion)
            } else if(category === "Ressource"){
                state.genuses = Object.keys(ressource)
            } else {
                state.genuses = Object.keys(armor)
            }
            
        },
        selectedGenus: (state, action)=>{
            state.activeGenus = action.payload.genus
            state.n = 0
            state.m = 10
        },

          setPagination: (state, action) => {
            console.log("update pagination")
            state.n = action.payload.n;
            state.m = action.payload.m;
          },
    },
    extraReducers: (builder) => {
        builder
        .addCase(getItem.pending, (state)=>{
            state.isLoading = true
            state.isSuccess = false
        })
        .addCase(getItem.fulfilled, (state, action)=> {
            const {data, n,m} = action.payload
            
            state.isLoading = false
            state.isSuccess = true
            state.data = data
            state.m = m
            state.n = n
            state.totalCount = state.data.length
            console.log("frontent fullfilled:", n,m)
        })
        .addCase(getItem.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
            state.loaded = false
        })

    }
})

export const {reset, search, getGenuses, selectedGenus, setItems, setPagination } = itemSlice.actions
export default itemSlice.reducer

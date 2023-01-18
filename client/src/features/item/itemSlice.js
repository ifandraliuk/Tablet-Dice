import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import itemService from './itemService'




const initialState = {
    items: [],
    genuses: [],
    weaponGenuses: [],
    armorGenuses: [],
    ressourceGenuses: [],
    categories:[],
    loaded:false,
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}


// Get items 
export const getItem = createAsyncThunk('items/getAll', async(_, thunkAPI)=>{
    try {
        return await itemService.getItem()
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
        getGenuses: (state)=>{
            let weapons = []
            let armors = []
            let ressources = []
            state.items.map((item) => {
                const category = item.category
                if(category === "Waffe"){  
                    return !weapons.includes(item.genus) && weapons.push(item.genus)
                } else if (category==="Rüstung"){
                    return !armors.includes(item.genus) && armors.push(item.genus)
                } else {
                    return !ressources.includes(item.genus) && ressources.push(item.genus)
                }
            })
            state.armorGenuses = armors
            state.weaponGenuses = weapons
            state.ressourceGenuses = ressources
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getItem.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getItem.fulfilled, (state, action)=> {
            state.isLoading = false
            state.isSuccess = true
            state.items = action.payload
            state.loaded = true
        })
        .addCase(getItem.rejected, (state, action)=> {
            state.isLoading = false
            state.isError = true
            state.message= action.payload
            state.loaded = false
        })

    }
})

export const {reset, search, getGenuses} = itemSlice.actions
export default itemSlice.reducer
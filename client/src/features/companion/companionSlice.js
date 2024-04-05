import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import companionService from './companionService'

const initialState = {
    companions: [],
    equipable: [],
    slotsAllowed : 0,
    isError: false, 
    isSuccess: false,
    isLoading: false,
    message: ''    
}

// Getting companions
export const getCompanion = createAsyncThunk(
  "companion/get",
  async (_,thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await companionService.getCompanion(token);
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Getting slots available for the user
export const getSlotsAvailable = createAsyncThunk(
  "companion/slots/get",
  async (_,thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await companionService.getSlotsAvailable(token);
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

// Getting slots available for the user
export const getEquipable = createAsyncThunk(
  "companion/equipable/get",
  async (_,thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await companionService.getEquipable(token);
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(msg);
    }
  }
);


// Posting a new companion to user
export const addCompanion = createAsyncThunk(
    "companion/post",
    async (compData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await companionService.addCompanion(compData, token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );
  // Put a new companion to user
  export const updateCompanionStatus = createAsyncThunk(
    "companion/put",
    async (compData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await companionService.updateCompanionStatus(compData, token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );
  
  // Put an equipment to the companion
  export const equipToCompanion = createAsyncThunk(
    "companion/equip/put",
    async (compData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await companionService.equipToCompanion(compData, token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );
  // Put an equipment to the companion
  export const unequipCompanionItem = createAsyncThunk(
    "companion/item/put",
    async (compData, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await companionService.unequipCompanionItem(compData, token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );

export const companionSlice = createSlice({
    name: 'companions',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
        .addCase(getCompanion.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
        })    
      .addCase(getCompanion.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.companions = action.payload;
        })
        .addCase(getCompanion.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(getSlotsAvailable.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
        })    
      .addCase(getSlotsAvailable.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.slotsAllowed = action.payload;
        })
        .addCase(getSlotsAvailable.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(getEquipable.pending, (state) => {
          state.isLoading = true;
          state.isError = false;
          state.isSuccess = false;
        })    
      .addCase(getEquipable.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.equipable = action.payload;
        })
        .addCase(getEquipable.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        })
        .addCase(addCompanion.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
          })    
        .addCase(addCompanion.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.companions.push(action.payload);
          })
          .addCase(addCompanion.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(updateCompanionStatus.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
          })
          .addCase(updateCompanionStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            const updateId = state.companions.findIndex(
              (el) => el._id.toString() === action.payload.id
            );
            state.companions[updateId] = action.payload.updated;
          })
          .addCase(updateCompanionStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(equipToCompanion.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
          })
          .addCase(equipToCompanion.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            const updateId = state.companions.findIndex(
              (el) => el._id.toString() === action.payload.id
            );
            state.companions[updateId] = action.payload.updated;
          })
          .addCase(equipToCompanion.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
          .addCase(unequipCompanionItem.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
          })
          .addCase(unequipCompanionItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            const updateId = state.companions.findIndex(
              (el) => el._id.toString() === action.payload.companion
            );
            if (action.payload.slotName === "slot1" ) {
              state.companions[updateId].slot1 = null;
            } else {
              state.companions[updateId].slot2 = null;
            }
          })
          .addCase(unequipCompanionItem.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
          })
    }
})

export const {reset} = companionSlice.actions
export default companionSlice.reducer

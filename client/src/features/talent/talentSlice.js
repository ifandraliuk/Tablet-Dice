import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import talentService from "./talentService";

const initialState = {
  allTalents: [],
  playerTalents: [],
  userclassName: '',
  userclassBonus: '',
  kindName: '',
  kindBonusName: '',
  kindBonus: '',
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get talents
export const getTalent = createAsyncThunk(
  "talents/getAll",
  async (_, thunkAPI) => {
    try {
      return await talentService.getTalent();
    } catch (error) {
      const msg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(error.message);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const getPlayerTalent = createAsyncThunk(
    "talents/player/getAll",
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await talentService.getPlayerTalent(token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error.message);
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );
  
  export const getUserBoni = createAsyncThunk(
    "talents/userboni/getAll",
    async (_, thunkAPI) => {
      try {
        const token = thunkAPI.getState().auth.user.token;
        return await talentService.getUserBoni(token);
      } catch (error) {
        const msg =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error.message);
        return thunkAPI.rejectWithValue(msg);
      }
    }
  );
  



// Posting a talent to player
export const addToPlayer = createAsyncThunk(
  "talents/to_player/post",
  async (talentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await talentService.addToPlayer(talentData, token);
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
// Posting a talent to user
export const removeFromPlayer = createAsyncThunk(
  "talents/from_player/delete",
  async (talentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await talentService.removeFromPlayer(talentData, token);
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

// Updating users talent
export const updatePlayersTalent = createAsyncThunk(
  "talents/to_player/putAll",
  async (talentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await talentService.updatePlayersTalent(talentData, token);
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

export const talentSlice = createSlice({
  name: "talent",
  initialState,
  reducers: {
    reset: (state) => initialState,
    sortedTalents: (state, { payload }) => {
      const sortedTalents = [...state.playerTalents]; // Create a shallow copy
    
      // Sort based on points or other attributes
      if (payload.sortKey === "points") {
        sortedTalents.sort((a, b) => payload.reverse ? b.points - a.points : a.points - b.points);
      } else {
        sortedTalents.sort((a, b) => {
          const comparison = a.talent[payload.sortKey]?.localeCompare(b.talent[payload.sortKey]);
          return payload.reverse ? -comparison : comparison;
        });
      }
    
      // Log the sorted talents to the console for debugging
      console.log('Sorted Talents:', sortedTalents);
    
      // Update the state with sorted talents
      state.playerTalents = sortedTalents;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTalent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTalent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.allTalents = action.payload;
      })
      .addCase(getTalent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getPlayerTalent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlayerTalent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.playerTalents = action.payload;
      })
      .addCase(getPlayerTalent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getUserBoni.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserBoni.fulfilled, (state, action) => {
        const {kindName, kindAdvantageName, kindAdvantage, userclassName, userclassAdvantage } = action.payload
        console.log(action.payload)
        state.isLoading = false;
        state.isSuccess = true;
        state.kindName = kindName;
        state.kindBonus = kindAdvantage;
        state.kindBonusName = kindAdvantageName;
        state.userclassName = userclassName;
        state.userclassBonus = userclassAdvantage
      })
      .addCase(getUserBoni.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToPlayer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(addToPlayer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.player.talents = action.payload
        state.playerTalents.push(action.payload);
        state.isError = false;
      })
      .addCase(addToPlayer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(removeFromPlayer.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(removeFromPlayer.fulfilled, (state, action) => {
        state.isLoading = false; // Assuming you set loading to true elsewhere
        state.isSuccess = true; // Indicate successful removal
        // Filter out the removed talent by its ID
        state.playerTalents = state.playerTalents.filter(item => item._id !== action.payload.id);
        console.log('Updated Player Talents after removal:', state.playerTalents); // Debugging output
      })
      .addCase(removeFromPlayer.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updatePlayersTalent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(updatePlayersTalent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        //state.player.playerTalents=action.payload
        console.log(action.payload);
        state.playerTalents = state.playerTalents.map((t) =>
          t._id === action.payload._id ? action.payload : t
        );
        state.isError = false;
      })
      .addCase(updatePlayersTalent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
  },
});

export const { reset, sortedTalents } = talentSlice.actions;
export default talentSlice.reducer;

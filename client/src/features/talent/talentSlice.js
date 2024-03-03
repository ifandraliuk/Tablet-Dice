import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import talentService from "./talentService";

const initialState = {
  allTalents: [],
  playerTalents: [],
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
        let sortedTalents;
      
        if (payload.sortKey === "points") {
          sortedTalents = [...state.playerTalents]; // Use spread operator for shallow copy
          if (payload.reverse) {
            sortedTalents.sort((a, b) => b.points - a.points);
          } else {
            sortedTalents.sort((a, b) => a.points - b.points);
          }
        } else {
          sortedTalents = [...state.playerTalents]; // Use spread operator for shallow copy
          if (payload.reverse) {
            sortedTalents.sort((a, b) => b.talent[payload.sortKey]?.localeCompare(a.talent[payload.sortKey]));
          } else {
            sortedTalents.sort((a, b) => a.talent[payload.sortKey]?.localeCompare(b.talent[payload.sortKey]));
          }
        }
      
        // Log the sorted talents to the console for debugging
        console.log('Sorted Talents:', sortedTalents);
      
        // Update the state using setState or equivalent in your React component
        // Ensure that you're triggering a re-render
        state.playerTalents = sortedTalents;
      }
      ,
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
        state.isLoading = false;
        state.isSuccess = true;
        state.playerTalents = state.playerTalents.filter(
          (item) => item._id !== action.payload.id
        );
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

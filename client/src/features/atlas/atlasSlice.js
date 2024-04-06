import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import atlasService from "./atlasService";

const initialState = {
  kingdom: [],
  activeKingdomName: "Belltamor",
  kingdomCategory: "general",
  activeHabitat: {},
  activeCreatures: [],
  activeMap:'',
  habitatView: false,
  habitatCategory: "ressource",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get kingdoms
export const getKingdom = createAsyncThunk(
  "kingdom/getAll",
  async (_, thunkAPI) => {
    try {
      return await atlasService.getKingdom();
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

export const getHabitatCreature = createAsyncThunk(
  "creatures/getAll",
  async (data, thunkAPI) => {
    try {
      return await atlasService.getHabitatCreature(data);
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

export const atlasSlice = createSlice({
  name: "atlas",
  initialState,
  reducers: {
    reset: (state) => initialState,
    setKingdomCategory: (state, { payload }) => {
      const { name, category } = payload;
      console.log(name, category, payload);
      return {
        ...state,
        activeKingdomName: name,
        kingdomCategory: category,
        activeHabitat: {},
        habitatView: false,
      };
    },
    setActiveHabitat: (state, { payload }) => {
      const id = payload.id;
      console.log(id);
      const activekingdom = state.kingdom.find(
        (el) => el.name === state.activeKingdomName
      );
      console.log(activekingdom);
      const activeHabitat = activekingdom.habitat?.find((el) => el._id === id);
      console.log(activekingdom);
      return {
        ...state,
        activeHabitat: activeHabitat,
        habitatView: true,
      };
    },
    resetActiveHabitat: (state) => {
      return {
        ...state,
        activeHabitat: {},
        habitatView: false,
      };
    },
    setHabitatCategory: (state, { payload }) => {
      const { category } = payload;
      console.log(category);
      return {
        ...state,
        habitatCategory: category,
      };
    },
    resetCreatures: (state) => {
      return {
        ...state,
        activeCreatures: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKingdom.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getKingdom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.kingdom = action.payload;
      })
      .addCase(getKingdom.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getHabitatCreature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHabitatCreature.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.activeCreatures = action.payload;
      })
      .addCase(getHabitatCreature.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  setKingdomCategory,
  setActiveHabitat,
  resetActiveHabitat,
  setHabitatCategory,
  resetCreatures,
} = atlasSlice.actions;
export default atlasSlice.reducer;

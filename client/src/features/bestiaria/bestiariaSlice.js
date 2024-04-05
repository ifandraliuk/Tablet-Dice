import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bestiariaService from "./bestiariaService";

const initialState = {
  bestiaria: [],
  artList: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get talents
export const getBestiaria = createAsyncThunk(
  "creatures/getAll",
  async (_, thunkAPI) => {
    try {
      return await bestiariaService.getBestiaria();
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

export const bestiariaSlice = createSlice({
  name: "bestiaria",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },

  extraReducers: (builder) => {
    builder
      .addCase(getBestiaria.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBestiaria.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bestiaria = action.payload;
        const artlist = action.payload.reduce((acc, curr) => {
           acc.add(curr.art);
           return acc;
         }, new Set());
         state.artList = [...artlist];
         
      })
      .addCase(getBestiaria.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, getArtList } = bestiariaSlice.actions;
export default bestiariaSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { researchAPI } from "@lib/API/api";
import { ResearchType } from "@lib/types";

interface ResearchState {
  research: ResearchType | null;
}

const initialState: ResearchState = {
  research: null
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(research.fulfilled, (state, action: PayloadAction<ResearchType>) => {
      state.research = action.payload;
    });
  }
});

export const research = createAsyncThunk(
  "researches/get",
  async (data: string) => {
    const response = await researchAPI.getResearch(data);
    if (response.status === 200) return response.data;
  }
);

export default researchSlice.reducer;


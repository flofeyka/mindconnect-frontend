import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResearchDataType, ResearchType } from "@lib/types";
import { researchAPI } from "@lib/API/authAPI";

interface ResearchState {
  research: ResearchType | null;
}

const initialState: ResearchState = {
  research: null
};

const researchSlice = createSlice({
  name: "research",
  initialState,
  reducers: {
    research: (state, action: PayloadAction<ResearchType>) => {
      state.research = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(research.fulfilled, (state, action: PayloadAction<ResearchType>) => {
      state.research = action.payload;
    });
  }
});

export const research = createAsyncThunk(
  "researches/get",
  async (data: ResearchDataType) => {
    const response = await researchAPI.getResearch(data);
    if (response.status === 200) return response.data;
  }
);

export default researchSlice.reducer;


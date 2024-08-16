import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentInfoService from '../../services/HrDocumentInfos';

export const initialState = {
    isLoading: true,
    error: null,
    steps: [],
};

export const fetchSteps = createAsyncThunk(
    'steps/fetchSteps',
    async (documentId, { rejectedWithValue }) => {
        try {
            const response = await HrDocumentInfoService.get_by_id(documentId);
            return response;
        } catch (e) {
            return rejectedWithValue(e.response.data);
        }
    },
);

export const stepsSlice = createSlice({
    name: 'steps',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSteps.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchSteps.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.steps = action.payload;
        });
        builder.addCase(fetchSteps.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const { steps } = stepsSlice.actions;

export default stepsSlice.reducer;

// HR Doc
//   NeW value
//   oldVal

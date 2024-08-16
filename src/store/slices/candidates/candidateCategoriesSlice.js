import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidatesService from '../../../services/candidates/CandidatesService';

let initialState = {
    data: [],
    isLoading: true,
    error: '',
};

export const getCandidateCategories = createAsyncThunk(
    'candidateCategories/get',
    async (_, thunkAPI) => {
        try {
            const response = await CandidatesService.getCategories();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const сandidateCategoriesSlice = createSlice({
    name: 'candidateCategories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getCandidateCategories.pending, (state) => {
                state.isLoading = true;
                state.error = '';
                state.data = [];
            })
            .addCase(getCandidateCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.data = action.payload;
            })
            .addCase(getCandidateCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

export const { candidateCategories } = сandidateCategoriesSlice.actions;

export default сandidateCategoriesSlice.reducer;

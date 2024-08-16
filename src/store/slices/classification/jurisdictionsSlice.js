import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import JurisdictionsService from 'services/JurisdictionsService';

let initialState = {
    jurisdictions: [],
    isLoading: false,
    error: '',
};

export const jurisdictionsAll = createAsyncThunk(
    'jurisdictions/fetchJurisdictions',
    async (_, thunkAPI) => {
        try {
            const response = await JurisdictionsService.get_jurisdictions();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const jurisdictionsSlice = createSlice({
    name: 'jurisdictions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(jurisdictionsAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(jurisdictionsAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.jurisdictions = action.payload;
            })
            .addCase(jurisdictionsAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.jurisdictions = [];
            });
    },
});

export const { jurisdictions } = jurisdictionsSlice.actions;

export default jurisdictionsSlice.reducer;

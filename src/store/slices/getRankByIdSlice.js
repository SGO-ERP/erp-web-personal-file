import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserRankById from 'services/GetRankByIdService';

const initialState = {
    userRank: null,
    isLoading: false,
    error: null,
};

export const fetchUserRankById = createAsyncThunk(
    'userRankById/fetchUserRankById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await UserRankById.get_user_rankById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

const userRankByIdSlice = createSlice({
    name: 'userRankById',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserRankById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserRankById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userRank = action.payload;
            })
            .addCase(fetchUserRankById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default userRankByIdSlice.reducer;

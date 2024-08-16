import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidateEssayTypeService from '../../../services/candidates/CandidateEssayType';

let initialState = {
    data: [],
    isLoading: true,
    error: '',
};

export const getEssayType = createAsyncThunk('essayType/getEssayType', async (_, thunkAPI) => {
    try {
        const response = await CandidateEssayTypeService.getEssayType();
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const postEssayName = createAsyncThunk('essayType/postEssayName', async (data, thunkAPI) => {
    const candidate_id = data[0];
    const name = data[1];
    const essay_id = data[2];
    try {
        const response = await CandidateEssayTypeService.post_essay_name(
            candidate_id,
            essay_id,
            name,
        );
        return response;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const essayTypeSlice = createSlice({
    name: 'essayType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEssayType.pending, (state) => {
                state.isLoading = true;
                state.error = '';
                state.data = [];
            })
            .addCase(getEssayType.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.data = action.payload;
            })
            .addCase(getEssayType.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

export const { essayType } = essayTypeSlice.actions;

export default essayTypeSlice.reducer;

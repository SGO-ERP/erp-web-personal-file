import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidatesService from '../../../services/candidates/CandidatesService';

let initialState = {
    stages: [],
    isLoading: false,
    error: '',
    candidate: null,
};

export const candidateStagesInfo = createAsyncThunk(
    'candidate/candidateStagesInfo',
    async (candidateId, thunkAPI) => {
        try {
            const response = await CandidatesService.get_all_candidate_stage_info_by_candidateId(
                candidateId,
            );
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const сandidateStagesSlice = createSlice({
    name: 'candidateStages',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(candidateStagesInfo.pending, (state) => {
                state.isLoading = true;
                state.stages = [];
            })
            .addCase(candidateStagesInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.stages = action.payload;
            })
            .addCase(candidateStagesInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.stages = [];
            });
    },
});

export const { candidateStages } = сandidateStagesSlice.actions;

export default сandidateStagesSlice.reducer;

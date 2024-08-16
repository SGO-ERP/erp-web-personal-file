import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidatesService from '../../../services/candidates/CandidatesService';
import { candidateStagesInfo } from './selectedCandidateStagesSlice';
import { getCandidateCategories } from './candidateCategoriesSlice';
import { resetRedirect } from './answersSlice/answersSlice';
import PersonalInfoService from '../../../services/myInfo/PersonalInfoService';

let initialState = {
    isLoading: false,
    error: null,
    data: null,
    profile: null,
    profileLoading: false,
};

export const selectedCandidateInfo = createAsyncThunk(
    'selectedCandidateInfo',
    async (candidateId, { dispatch, thunkAPI }) => {
        try {
            const response = await CandidatesService.get_candidate_id(candidateId);
            await dispatch(candidateStagesInfo(candidateId));
            await dispatch(getCandidateCategories());
            await dispatch(resetRedirect());
            // await dispatch(getUsers());
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const profileCandidateById = createAsyncThunk(
    'profileCandidateById',
    async (userId, { thunkAPI }) => {
        try {
            const response = await PersonalInfoService.get_personal_info(userId);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const selectedCandidateInfoSlice = createSlice({
    name: 'selectedCandidateInfo',
    initialState,
    reducers: {
        resetSelectedCandidate: (state) => {
            state.data = null;
            state.error = null;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(selectedCandidateInfo.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(selectedCandidateInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(selectedCandidateInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.data = null;
            })
            .addCase(profileCandidateById.pending, (state) => {
                state.profileLoading = true;
                state.error = null;
                state.profile = null;
            })
            .addCase(profileCandidateById.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.error = null;
                state.profile = action.payload;
            })
            .addCase(profileCandidateById.rejected, (state, action) => {
                state.profileLoading = false;
                state.error = action.payload;
                state.profile = null;
            });
    },
});

export const { selectedCandidate, resetSelectedCandidate } = selectedCandidateInfoSlice.actions;

export default selectedCandidateInfoSlice.reducer;

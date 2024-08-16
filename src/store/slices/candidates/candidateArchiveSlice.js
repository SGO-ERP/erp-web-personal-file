import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import CandidatesService from 'services/candidates/CandidatesService';
import CandidateUpdate from '../../../services/candidates/stage/CandidateUpdate';

let initialState = {
    candidatesAllArchive: {
        data: [],
        isLoading: true,
        error: '',
        hasMore: false,
    },
};

export const candidatesAllArchive = createAsyncThunk(
    'candidateArchive/candidatesAllArchive',
    async ({ page, limit }, { getState }) => {
        try {
            const state = getState();
            const response = await CandidatesService.get_all_candidates_in_archive(
                page,
                limit,
                state.candidates.allCandidateList.search,
            );
            return response;
        } catch (error) {
            return error;
        }
    },
);

export const candidatesUpdateStatus = createAsyncThunk(
    'candidateArchive/candidatesUpdateStatus',
    async ({ candidate_id, reason }) => {
        try {
            const response = await CandidateUpdate.updateService(candidate_id, reason);
            return response;
        } catch (error) {
            return error;
        }
    },
);

export const сandidateArchiveSlice = createSlice({
    name: 'candidateArchive',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(candidatesAllArchive.pending, (state) => {
                state.candidatesAllArchive.isLoading = true;
            })
            .addCase(candidatesAllArchive.fulfilled, (state, action) => {
                state.candidatesAllArchive.isLoading = false;
                state.candidatesAllArchive.error = '';
                state.candidatesAllArchive.data = action.payload.data;
                state.candidatesAllArchive.hasMore = action.payload.hasMore;
            })
            .addCase(candidatesAllArchive.rejected, (state, action) => {
                state.candidatesAllArchive.isLoading = false;
                state.candidatesAllArchive.error = action.payload;
            });
    },
});

export const { сandidateArchive } = сandidateArchiveSlice.actions;

export default сandidateArchiveSlice.reducer;

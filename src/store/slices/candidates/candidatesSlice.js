import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import CandidatesService from 'services/candidates/CandidatesService';
import { resetSelectedCandidate } from './selectedCandidateSlice';

let initialState = {
    allCandidateList: {
        data: [],
        isLoading: true,
        error: '',
        hasMore: false,
        search: '',
    },
    updateCandidate: {
        isLoading: false,
        error: '',
    },
};

export const candidatesAll = createAsyncThunk(
    'candidates/candidatesAll',
    async ({ page, limit }, { getState, dispatch }) => {
        try {
            const state = getState();
            const response = await CandidatesService.get_all_candidates(
                page,
                limit,
                state.candidates.allCandidateList.search,
            );
            await dispatch(resetSelectedCandidate());
            return response;
        } catch (error) {
            return error;
        }
    },
);

export const updateCandidateById = createAsyncThunk(
    'candidates/users/get',
    async ({ candidateId, data }, thunkAPI) => {
        try {
            const response = await CandidatesService.update_candidate_id(candidateId, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const сandidatesSlice = createSlice({
    name: 'candidates',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.allCandidateList.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(candidatesAll.pending, (state) => {
                state.allCandidateList.isLoading = true;
            })
            .addCase(candidatesAll.fulfilled, (state, action) => {
                state.allCandidateList.isLoading = false;
                state.allCandidateList.error = '';
                state.allCandidateList.data = action.payload.data;
                state.allCandidateList.hasMore = action.payload.hasMore;
            })
            .addCase(candidatesAll.rejected, (state, action) => {
                state.allCandidateList.isLoading = false;
                state.allCandidateList.error = action.payload;
            })
            .addCase(updateCandidateById.pending, (state) => {
                state.updateCandidate.isLoading = true;
            })
            .addCase(updateCandidateById.fulfilled, (state, action) => {
                state.updateCandidate.isLoading = false;
                state.updateCandidate.error = '';
            })
            .addCase(updateCandidateById.rejected, (state, action) => {
                state.updateCandidate.isLoading = false;
                state.updateCandidate.error = action.payload;
            });
    },
});

export const { candidates, setSearchText } = сandidatesSlice.actions;

export default сandidatesSlice.reducer;

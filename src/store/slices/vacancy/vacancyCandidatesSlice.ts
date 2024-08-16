import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../../../API/types';
import HRVacancyService from '../../../services/vacancy/HRVacancyService';

interface vacancyCandidatesState {
    candidates: components['schemas']['HrVacancyCandidateRead'][];
    isLoading: boolean;
    error: any;
}

const initialState: vacancyCandidatesState = {
    candidates: [],
    isLoading: true,
    error: null,
};

export const getVacancyCandidates = createAsyncThunk('getVacancyCandidates', async (id: string) => {
    const response = await HRVacancyService.getCandidatesOfVacancy(id);
    return response;
});

export const vacancyCandidatesSlice = createSlice({
    name: 'vacanciesCandidates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getVacancyCandidates.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getVacancyCandidates.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = null;
                state.candidates = action.payload;
            })
            .addCase(getVacancyCandidates.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                state.candidates = [];
            });
    },
});

export default vacancyCandidatesSlice.reducer;

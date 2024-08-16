import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidateStageService from '../../../../services/candidates/stage/CandidateStageService';
import React from 'react';
import CandidatesStageInfo from '../../../../services/candidates/CandidateStageInfo';

export const initialState = {
    isLoading: false,
    redirect: '',
};

export const saveAnswers = createAsyncThunk(
    'сandidateStageAnswers/save',
    async (answers, thunkAPI) => {
        const data = { candidate_stage_answers: null };
        data.candidate_stage_answers = answers;
        try {
            const response = await CandidateStageService.save_answers(data);
            return response;
            // window.location.reload();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const saveAndSign = createAsyncThunk(
    'сandidateStageAnswers/saveAndSign',
    async ({ answers, stageId, data }, thunkAPI) => {
        const dataAnswers = { candidate_stage_answers: null };
        dataAnswers.candidate_stage_answers = answers;
        try {
            const responseSave = await CandidateStageService.save_answers(dataAnswers);

            let responseUpdate;
            if (data.status === 'Пройден успешно') {
                responseUpdate = await CandidatesStageInfo.sign_stage_info(stageId);
            } else if (data.status === 'Завален') {
                responseUpdate = await CandidatesStageInfo.reject_stage_info(stageId);
            }
            return responseSave;
            // window.location.reload();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const saveAndSignEcp = createAsyncThunk(
    'сandidateStageAnswers/saveAndSignEcp',
    async ({ answers, stageId, data }, thunkAPI) => {
        const dataAnswers = { candidate_stage_answers: null };
        dataAnswers.candidate_stage_answers = answers;
        try {
            const responseSave = await CandidateStageService.save_answers(dataAnswers);

            let responseUpdate;
            if (data.status === 'Пройден успешно') {
                responseUpdate = await CandidatesStageInfo.sign_stage_info(stageId);
            } else if (data.status === 'Завален') {
                responseUpdate = await CandidatesStageInfo.reject_stage_info(stageId);
            }
            return responseSave;
            // window.location.reload();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const updateStage = createAsyncThunk(
    'сandidateStage/update',
    async ({ stageId, data }, thunkAPI) => {
        try {
            const response = await CandidateStageService.update_stage(stageId, data);
            return response;
            // window.location.reload();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const сandidateStageAnswersSlice = createSlice({
    name: 'сandidateStageAnswers',
    initialState,
    reducers: {
        resetRedirect: (state) => {
            state.redirect = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveAnswers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(saveAnswers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.redirect = 'saveAnswers';
            })
            .addCase(saveAnswers.rejected, (state, action) => {
                state.isLoading = false;
            })
            .addCase(updateStage.pending, (state) => {
                state.isLoading = true;
                state.redirect = null;
            })
            .addCase(updateStage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.redirect = 'updateStage';
            })
            .addCase(updateStage.rejected, (state, action) => {
                state.isLoading = false;
                state.redirect = null;
            })

            .addCase(saveAndSign.pending, (state) => {
                state.isLoading = true;
                state.redirect = null;
            })
            .addCase(saveAndSign.fulfilled, (state, action) => {
                state.isLoading = false;
                state.redirect = 'saveAndSign';
            })
            .addCase(saveAndSign.rejected, (state, action) => {
                state.isLoading = false;
                state.redirect = null;
            })
            .addCase(saveAndSignEcp.pending, (state) => {
                state.isLoading = true;
                state.redirect = null;
            })
            .addCase(saveAndSignEcp.fulfilled, (state, action) => {
                state.isLoading = false;
                state.redirect = 'saveAndSign';
            })
            .addCase(saveAndSignEcp.rejected, (state, action) => {
                state.isLoading = false;
                state.redirect = null;
            });
    },
});

export const { candidateStageAnswers, resetRedirect } = сandidateStageAnswersSlice.actions;

export default сandidateStageAnswersSlice.reducer;

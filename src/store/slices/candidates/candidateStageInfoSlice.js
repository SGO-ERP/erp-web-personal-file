import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import CandidatesStageInfo from 'services/candidates/CandidateStageInfo';
import CandidateStageService from '../../../services/candidates/stage/CandidateStageService';

let initialState = {
    allCandidateListByStaffUnitId: [],
    isLoading: true,
    error: '',
    hasMore: false,
    search: '',
    sendStageInfoLoading: false,
    signRejectLoading: false,
};
export const candidatesAllListByStaffId = createAsyncThunk(
    'сandidateStageInfo/candidatesAllListByStaffId',
    async ({ page, limit }, { getState, dispatch }) => {
        try {
            const state = getState();
            const response = await CandidatesStageInfo.get_all_candidates_by_staff_unit_id(
                page,
                limit,
                state.candidateStageInfoStaffId.search,
            );
            return response;
        } catch (error) {
            return error;
        }
    },
);

export const sendStageInfo = createAsyncThunk(
    'сandidateStageInfo/send',
    async ({ stageInfoId, data, dataStatus }, thunkAPI) => {
        try {
            const response = await CandidatesStageInfo.send_stage_info(stageInfoId, data);
            const responseUpdate = await CandidateStageService.update_stage(
                stageInfoId,
                dataStatus,
            );

            return responseUpdate;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const candidate_stage_info_sign = createAsyncThunk(
    'candidate_stage_info_sign',
    async (stageInfoId, thunkAPI) => {
        try {
            const response = await CandidatesStageInfo.sign_stage_info(stageInfoId);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const candidate_stage_info_sign_ecp = createAsyncThunk(
    'candidate_stage_info_sign_ecp',
    async (stageInfoId, thunkAPI) => {
        try {
            let response;
            response = await CandidatesStageInfo.sign_stage_info_ecp(stageInfoId);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const candidate_stage_info_reject = createAsyncThunk(
    'candidate_stage_info_reject',
    async (stageInfoId, thunkAPI) => {
        try {
            const response = await CandidatesStageInfo.reject_stage_info(stageInfoId);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const сandidateStageInfoSlice = createSlice({
    name: 'сandidateStageInfo',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(candidatesAllListByStaffId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(candidatesAllListByStaffId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.allCandidateListByStaffUnitId = action.payload;
                state.hasMore = action.payload.hasMore;
            })
            .addCase(candidatesAllListByStaffId.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(sendStageInfo.pending, (state) => {
                state.sendStageInfoLoading = true;
            })
            .addCase(sendStageInfo.fulfilled, (state, action) => {
                state.sendStageInfoLoading = false;
            })
            .addCase(sendStageInfo.rejected, (state, action) => {
                state.sendStageInfoLoading = false;
            })
            .addCase(candidate_stage_info_sign.pending, (state) => {
                state.signRejectLoading = true;
            })
            .addCase(candidate_stage_info_sign.fulfilled, (state, action) => {
                state.signRejectLoading = false;
            })
            .addCase(candidate_stage_info_sign.rejected, (state, action) => {
                state.signRejectLoading = false;
            })
            .addCase(candidate_stage_info_sign_ecp.pending, (state) => {
                state.signRejectLoading = true;
            })
            .addCase(candidate_stage_info_sign_ecp.fulfilled, (state, action) => {
                state.signRejectLoading = false;
            })
            .addCase(candidate_stage_info_sign_ecp.rejected, (state, action) => {
                state.signRejectLoading = false;
            })
            .addCase(candidate_stage_info_reject.pending, (state) => {
                state.signRejectLoading = true;
            })
            .addCase(candidate_stage_info_reject.fulfilled, (state, action) => {
                state.signRejectLoading = false;
            })
            .addCase(candidate_stage_info_reject.rejected, (state, action) => {
                state.signRejectLoading = false;
            });
    },
});

export const { сandidateStageInfo, setSearchText } = сandidateStageInfoSlice.actions;

export default сandidateStageInfoSlice.reducer;

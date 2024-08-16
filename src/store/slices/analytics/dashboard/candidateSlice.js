import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PrivateServices } from '../../../../API';

export const fetchCandidatesData = createAsyncThunk(
    'candidates/fetchCandidatesData',
    async (_, { rejectWithValue }) => {
        try {
            const stagesResponse = await PrivateServices.get('/api/v1/dashboard/candidates/stages');
            const durationResponse = await PrivateServices.get(
                '/api/v1/dashboard/candidates/duration',
            );
            const completedResponse = await PrivateServices.get(
                '/api/v1/dashboard/candidates/completed',
            );

            return {
                stagesData: stagesResponse.data,
                durationData: durationResponse.data,
                completedData: completedResponse.data,
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    },
);

const candidatesSlice = createSlice({
    name: 'candidates',
    initialState: {
        stagesData: [],
        durationData: [],
        completedData: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidatesData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCandidatesData.fulfilled, (state, action) => {
                state.loading = false;
                state.stagesData = action.payload.stagesData;
                state.durationData = action.payload.durationData;
                state.completedData = action.payload.completedData;
            })
            .addCase(fetchCandidatesData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const selectCandidatesStagesData = (state) => state.candidates.stagesData;
export const selectCandidatesDurationData = (state) => state.candidates.durationData;
export const selectCandidatesCompletedData = (state) => state.candidates.completedData;

export default candidatesSlice.reducer;

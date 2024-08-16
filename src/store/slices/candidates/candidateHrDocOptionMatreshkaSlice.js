import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import HrDocumentOptionMatreshka from '../../../services/candidates/HrDocumentOptionMatreshka';

let initialState = {
    data: [],
    isLoading: true,
    error: '',
};

export const hrDocOptionAll = createAsyncThunk('candidateHrDocOption/hrDocOptionAll', async () => {
    try {
        const response = await HrDocumentOptionMatreshka.get_hr_document_option_matreshka();
        return response;
    } catch (error) {
        return error;
    }
});

export const candidateHrDocOptionSlice = createSlice({
    name: 'candidateHrDoc',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(hrDocOptionAll.pending, (state) => {
                state.isLoading = true;
                state.data = [];
            })
            .addCase(hrDocOptionAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.data = action.payload;
            })
            .addCase(hrDocOptionAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.data = [];
            });
    },
});

export const { candidateHrDoc } = candidateHrDocOptionSlice.actions;

export default candidateHrDocOptionSlice.reducer;

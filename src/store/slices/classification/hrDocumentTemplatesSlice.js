import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';

let initialState = {
    hrDocumentTemplates: [],
    isLoading: false,
    error: '',
};

export const hrDocumentTemplatesAll = createAsyncThunk(
    'hrDocumentTemplates/fetchHrDocumentTemplates',
    async (_, thunkAPI) => {
        try {
            const response = await HrDocumentTemplatesService.get_hr_document_template();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const hrDocumentTemplatesSlice = createSlice({
    name: 'hrDocumentTemplates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(hrDocumentTemplatesAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(hrDocumentTemplatesAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.hrDocumentTemplates = action.payload;
            })
            .addCase(hrDocumentTemplatesAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.hrDocumentTemplates = [];
            });
    },
});

export const { hrDocumentTemplates } = hrDocumentTemplatesSlice.actions;

export default hrDocumentTemplatesSlice.reducer;

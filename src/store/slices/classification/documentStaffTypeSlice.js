import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import DocumentStaffFunctionTypeService from 'services/DocumentStaffFunctionTypeService';

let initialState = {
    documentStaffFunctionType: [],
    isLoading: false,
    error: '',
};

export const documentStaffTypeAll = createAsyncThunk(
    'documentStaffType/fetchDocumentStaffType',
    async (_, thunkAPI) => {
        try {
            const response = await DocumentStaffFunctionTypeService.get_document_staff_type();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const documentStaffTypeSlice = createSlice({
    name: 'documentStaffType',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(documentStaffTypeAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(documentStaffTypeAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.documentStaffFunctionType = action.payload;
            })
            .addCase(documentStaffTypeAll.rejected, (state, action) => {
                state.isLoading = false;
                state.documentStaffFunctionType = [];
                state.error = action.payload;
            });
    },
});

export const { documentStaffType } = documentStaffTypeSlice.actions;

export default documentStaffTypeSlice.reducer;

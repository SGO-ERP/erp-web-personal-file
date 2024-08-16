import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentService from '../../../services/HrDocumentsService';

export const initialState = {
    isLoading: true,
    error: null,
    hrDocumentsSigned: [],
    hasMore: false,
};

export const getSignedDocuments = createAsyncThunk(
    'hrDocument/fetchSignedDocuments',
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const searchQuery = state.tableController.searchValue;
        const response = await HrDocumentService.get_signed_history(page, limit, searchQuery);
        return response;
    },
);

export const signedLettersSlice = createSlice({
    name: 'signedLetters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSignedDocuments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getSignedDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hrDocumentsSigned = action.payload.data;
                state.hasMore = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getSignedDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.hrDocumentsSigned = [];
            });
    },
});

export const { signedLetters } = signedLettersSlice.actions;

export default signedLettersSlice.reducer;

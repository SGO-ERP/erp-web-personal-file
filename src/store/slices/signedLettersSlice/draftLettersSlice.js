import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentService from '../../../services/HrDocumentsService';

export const initialState = {
    isLoading: true,
    error: null,
    hrDraftDocuments: [],
    hasMore: false,
};

export const getDraftLetters = createAsyncThunk(
    'hrDocument/fetchDraftLetters',
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const searchQuery = state.tableController.searchValue;
        const response = await HrDocumentService.get_documents_draft(page, limit, searchQuery);
        return response;
    },
);

export const draftLettersSlice = createSlice({
    name: 'draftLetters',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDraftLetters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDraftLetters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hrDraftDocuments = action.payload.data;
                state.hasMore = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getDraftLetters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.hrDraftDocuments = [];
            });
    },
});

export const { draftLetters, setSearchTextForArchieve } = draftLettersSlice.actions;

export default draftLettersSlice.reducer;

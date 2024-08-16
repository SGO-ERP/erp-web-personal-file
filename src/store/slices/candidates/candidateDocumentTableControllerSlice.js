import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const candidateDocumentTableControllerSlice = createSlice({
    name: 'candidateDocumentTableControllerSlice',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = candidateDocumentTableControllerSlice.actions;

export default candidateDocumentTableControllerSlice.reducer;

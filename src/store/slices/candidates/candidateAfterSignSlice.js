import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const CandidateAfterSignSlice = createSlice({
    name: 'CandidateAfterSignSlice',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = CandidateAfterSignSlice.actions;

export default CandidateAfterSignSlice.reducer;

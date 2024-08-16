import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const candidateTableArchieveControllerSlice = createSlice({
    name: 'candidateTableArchieveController',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = candidateTableArchieveControllerSlice.actions;

export default candidateTableArchieveControllerSlice.reducer;

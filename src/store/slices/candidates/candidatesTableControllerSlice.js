import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const candidatesTableControllerSlice = createSlice({
    name: 'condidatesTableController',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = candidatesTableControllerSlice.actions;

export default candidatesTableControllerSlice.reducer;

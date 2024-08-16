import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const usersTableControllerSlice = createSlice({
    name: 'usersTableController',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = usersTableControllerSlice.actions;

export default usersTableControllerSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    currentPage: 1,
    pageSize: 5,
};

export const userArchieveTableControllerSlice = createSlice({
    name: 'userArchieveTableControllerSlice',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
});

export const { changeCurrentPage } = userArchieveTableControllerSlice.actions;

export default userArchieveTableControllerSlice.reducer;

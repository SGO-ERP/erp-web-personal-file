import { createSlice } from '@reduxjs/toolkit';
export const initialState = {
    loading: false,
};

export const spinSlice = createSlice({
    name: 'spin',
    initialState,
    reducers: {
        changeLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { changeLoading } = spinSlice.actions;

export default spinSlice.reducer;

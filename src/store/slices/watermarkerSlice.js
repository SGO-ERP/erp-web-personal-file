import { createSlice } from '@reduxjs/toolkit';
export const initialState = {
    text: '',
};

export const watermarkerSlice = createSlice({
    name: 'watermarker',
    initialState,
    reducers: {
        changeWatermarker: (state, action) => {
            let newText = action.payload.repeat(2000);
            state.text = newText;
        },
    },
});

export const { changeWatermarker } = watermarkerSlice.actions;

export default watermarkerSlice.reducer;

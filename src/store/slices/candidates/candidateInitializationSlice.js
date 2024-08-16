import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
    candidateUserId: null,
    orderId: null,
};

export const candidateInitializationSlice = createSlice({
    name: 'candidateInitializationSlice',
    initialState,
    reducers: {
        setCandidateUserId(state, action) {
            state.candidateUserId = action.payload;
        },
        setOrderId(state, action) {
            state.orderId = action.payload;
        },
    },
});

export const { candidateInitialization, setCandidateUserId, setOrderId } =
    candidateInitializationSlice.actions;

export default candidateInitializationSlice.reducer;

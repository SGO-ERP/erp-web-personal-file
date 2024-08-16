import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import IpService from '../../services/IpService';

let initialState = {
    ipData: null,
    loading: true,
    error: '',
};

export const getIp = createAsyncThunk(
    'ip/getIp',
    async (_, { rejectWithValue, dispatch, getState }) => {
        const response = await IpService.get_ip();
        return response;
    },
);

export const ipSlice = createSlice({
    name: 'ip',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getIp.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getIp.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.ipData = action.payload;
        });
        builder.addCase(getIp.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.ipData = [];
        });
    },
});

export const { ip } = ipSlice.actions;

export default ipSlice.reducer;

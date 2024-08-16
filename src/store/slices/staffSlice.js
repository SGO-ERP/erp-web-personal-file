import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import ServicesService from '../../services/myInfo/ServicesService';
let initialState = {
    data: [],
    loading: false,
    error: null,
};
export const getAllStaffDivisions = createAsyncThunk(
    'getAllStaffDivisions',
    async (_, { rejectWithValue }) => {
        try {
            return await ServicesService.get_staff_divisions();
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);
export const staffSlice = createSlice({
    name: 'staffSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllStaffDivisions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getAllStaffDivisions.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
        });
        builder.addCase(getAllStaffDivisions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
// export const {} = staffScheduleSlice.actions;
export default staffSlice.reducer;

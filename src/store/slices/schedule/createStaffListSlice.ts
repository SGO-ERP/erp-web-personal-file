import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../API/types';
import { PrivateServices } from 'API';

interface createStaffListState {
    staffList?: components['schemas']['StaffListRead'];
    isLoading: boolean;
    error: any;
}

const initialState: createStaffListState = {
    staffList: undefined,
    isLoading: false,
    error: null,
};

export const createStaffList = createAsyncThunk(
    'createStaffList',
    (body: paths['/api/v1/staff_list']['post']['requestBody']['content']['application/json']) =>
        PrivateServices.post('/api/v1/staff_list', {
            body,
        }),
);

export const createStaffListSlice = createSlice({
    name: 'createStaffListSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createStaffList.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createStaffList.fulfilled, (state, action) => {
            state.isLoading = false;
            state.staffList = action.payload.data;
        });
        builder.addCase(createStaffList.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export default createStaffListSlice.reducer;

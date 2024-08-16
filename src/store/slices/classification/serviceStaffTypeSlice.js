import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import ServiceStaffFunctionTypeService from 'services/ServiceStaffFunctionTypeService';

let initialState = {
    serviceStaffFunctionType: [],
    error: '',
    isLoading: false,
};

export const serviceStaffTypeAll = createAsyncThunk(
    'serviceStaffType/fetchServiceStaffType',
    async (_, thunkAPI) => {
        try {
            const response = await ServiceStaffFunctionTypeService.get_service_staff_type();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const serviceStaffTypeSlice = createSlice({
    name: 'serviceStaffType',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(serviceStaffTypeAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(serviceStaffTypeAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.serviceStaffFunctionType = action.payload;
            })
            .addCase(serviceStaffTypeAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.serviceStaffFunctionType = [];
            });
    },
});

export const { serviceStaffType } = serviceStaffTypeSlice.actions;

export default serviceStaffTypeSlice.reducer;

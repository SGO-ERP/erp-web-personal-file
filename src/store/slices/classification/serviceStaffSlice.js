import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import ServiceStaffFunctionService from 'services/ServiceStaffFunctionService';

let initialState = {
    serviceStaffFunction: [],
    error: '',
    isLoading: false,
};

export const serviceStaffAll = createAsyncThunk(
    'serviceStaff/fetchServiceStaff',
    async (_, thunkAPI) => {
        try {
            const response = await ServiceStaffFunctionService.get_service_staff();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const postServiceStaff = createAsyncThunk(
    'postServiceStaffType/postServiceStaffType',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await ServiceStaffFunctionService.post_service_staff(data);
            dispatch(serviceStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const deleteServiceStaff = createAsyncThunk(
    'deleteServiceStaff/deleteServiceStaff',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await ServiceStaffFunctionService.delete_service_staff(id);
            dispatch(serviceStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const postServiceStaffDuplicate = createAsyncThunk(
    'postServiceStaffDuplicate/postServiceStaffDuplicate',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await ServiceStaffFunctionService.post_service_staff_duplicate(id);
            dispatch(serviceStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const serviceStaffSlice = createSlice({
    name: 'serviceStaff',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(serviceStaffAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(serviceStaffAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.serviceStaffFunction = action.payload;
            })
            .addCase(serviceStaffAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { serviceStaff } = serviceStaffSlice.actions;

export default serviceStaffSlice.reducer;

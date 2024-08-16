import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../API/types';
import { PrivateServices } from 'API';

interface FunctionScheduleState {
    serviceStaffFunction: {
        data: components['schemas']['ServiceStaffFunctionRead'][];
        loading: boolean;
        error: any;
    };
    documentStaffFunction: {
        data: components['schemas']['DocumentStaffFunctionRead'][];
        loading: boolean;
        error: any;
    };
}

const initialState: FunctionScheduleState = {
    serviceStaffFunction: {
        data: [],
        loading: false,
        error: null,
    },
    documentStaffFunction: {
        data: [],
        loading: false,
        error: null,
    },
};

export const getServiceStaffFunction = createAsyncThunk(
    'staffUnit/getServiceStaffFunction',
    (
        parameters: paths['/api/v1/staff_unit/get-service-staff-functions/{id}']['get']['parameters'],
    ) =>
        PrivateServices.get('/api/v1/staff_unit/get-service-staff-functions/{id}', {
            params: parameters,
        }),
);
export const FunctionScheduleSlice = createSlice({
    name: 'functionScheduleSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getServiceStaffFunction.pending, (state) => {
            state.serviceStaffFunction.loading = true;
            state.serviceStaffFunction.error = null;
            state.serviceStaffFunction.data = [];
        });
        builder.addCase(getServiceStaffFunction.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.serviceStaffFunction.loading = false;
                state.serviceStaffFunction.data = action.payload.data;
            }
        });
        builder.addCase(getServiceStaffFunction.rejected, (state, action) => {
            state.serviceStaffFunction.loading = false;
            state.serviceStaffFunction.error = action.payload;
        });
    },
});

export default FunctionScheduleSlice.reducer;

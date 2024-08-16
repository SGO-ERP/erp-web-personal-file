import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../API/types';
import { PrivateServices } from 'API';

interface FunctionArchieveScheduleState {
    serviceArchiveStaffFunction: {
        data: components['schemas']['ArchiveServiceStaffFunctionRead'][];
        loading: boolean;
        error: any;
    };
    documentArchiveStaffFunction: {
        data: components['schemas']['ArchiveDocumentStaffFunctionRead'][];
        loading: boolean;
        error: any;
    };
}

const initialState: FunctionArchieveScheduleState = {
    serviceArchiveStaffFunction: {
        data: [],
        loading: false,
        error: null,
    },
    documentArchiveStaffFunction: {
        data: [],
        loading: false,
        error: null,
    },
};

export const getArchiveServiceStaffFunction = createAsyncThunk(
    'ArchiveStaffUnit/getArchiveServiceStaffFunction',
    (
        parameters: paths['/api/v1/archive_staff_unit/get-service-staff-functions/{id}']['get']['parameters'],
    ) =>
        PrivateServices.get('/api/v1/archive_staff_unit/get-service-staff-functions/{id}', {
            params: parameters,
        }),
);

export const FunctionArchieveScheduleSlice = createSlice({
    name: 'functionArchieveScheduleSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getArchiveServiceStaffFunction.pending, (state) => {
            state.serviceArchiveStaffFunction.loading = true;
            state.serviceArchiveStaffFunction.error = null;
            state.serviceArchiveStaffFunction.data = [];
        });
        builder.addCase(getArchiveServiceStaffFunction.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.serviceArchiveStaffFunction.loading = false;
                state.serviceArchiveStaffFunction.data = action.payload.data;
            }
        });
        builder.addCase(getArchiveServiceStaffFunction.rejected, (state, action) => {
            state.serviceArchiveStaffFunction.loading = false;
            state.serviceArchiveStaffFunction.error = action.payload;
        });
    },
});

export default FunctionArchieveScheduleSlice.reducer;

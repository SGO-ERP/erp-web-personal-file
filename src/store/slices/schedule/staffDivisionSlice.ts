import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components, paths } from '../../../API/types';
import { PrivateServices } from 'API';

interface StaffDivisionState {
    data: components['schemas']['StaffDivisionRead'][];
    loading: boolean;
    error: any;
}

const initialState: StaffDivisionState = {
    data: [],
    loading: false,
    error: null,
};

export const getStaffDivision = createAsyncThunk(
    'staffDivision/getStaffDivision',
    (args: paths['/api/v1/staff_division']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/staff_division/schedule/', {
            params: args,
        });
    },
);

export const getStaffDivisionByDiv = createAsyncThunk(
    'staffDivision/getStaffDivisionByDiv',
    async (parameters: paths['/api/v1/staff_division/{id}/']['get']['parameters']) => {
        const response = await PrivateServices.get('/api/v1/staff_division/schedule/{id}/', {
            params: parameters,
        });

        if (response.data) {
            return [response.data];
        }
    },
);

export const StaffDivisionSlice = createSlice({
    name: 'staffDivisionSlice',
    initialState,
    reducers: {
        change: (state, action: PayloadAction<components['schemas']['StaffDivisionRead'][]>) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getStaffDivision.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = [];
        });
        builder.addCase(getStaffDivision.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.loading = false;
                state.data = action.payload.data;
            }
        });
        builder.addCase(getStaffDivision.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(getStaffDivisionByDiv.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = [];
        });
        builder.addCase(getStaffDivisionByDiv.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.data = action.payload;
            }
        });
        builder.addCase(getStaffDivisionByDiv.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { change } = StaffDivisionSlice.actions;

export default StaffDivisionSlice.reducer;

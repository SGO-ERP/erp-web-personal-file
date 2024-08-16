import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../API/types';
import { PrivateServices } from 'API';

interface ArchiveStaffDivisionState {
    data: components['schemas']['ArchiveStaffDivisionRead'][];
    loading: boolean;
    error: any;
}

const initialState: ArchiveStaffDivisionState = {
    data: [],
    loading: false,
    error: null,
};

export const getDraftStaffDivision = createAsyncThunk(
    'users/getDraftStaffDivision',
    (options: paths['/api/v1/archive_staff_division']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/archive_staff_division', {
            params: options,
        });
    },
);

export const archiveStaffDivision = createSlice({
    name: 'archiveStaffDivision',
    initialState,
    reducers: {
        change: (
            state,
            action: PayloadAction<components['schemas']['ArchiveStaffDivisionRead'][]>,
        ) => {
            state.data = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getDraftStaffDivision.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = [];
        });
        builder.addCase(getDraftStaffDivision.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.loading = false;
                state.data = action.payload.data;
            }
        });
        builder.addCase(getDraftStaffDivision.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { change } = archiveStaffDivision.actions;

export default archiveStaffDivision.reducer;

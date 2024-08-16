import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../../../API/types';
import HRVacancyService from '../../../services/vacancy/HRVacancyService';

interface staffDivisionDepartments {
    departments: components['schemas']['StaffDivisionRead'][];
    isLoading: boolean;
    error: any;
}

const initialState: staffDivisionDepartments = {
    departments: [],
    isLoading: true,
    error: null,
};

export const getStaffDivisionDepartments = createAsyncThunk(
    'getStaffDivisionDepartments',
    async () => {
        const response = await HRVacancyService.getStaffDivisionDepartments(0, 100);
        return response;
    },
);

export const staffDivisionDepartmentsSlice = createSlice({
    name: 'staffDivisionDepartments',
    initialState,
    reducers: {
        cleanDepartments: (state) => {
            state.departments = [];
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffDivisionDepartments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStaffDivisionDepartments.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = null;
                state.departments = action.payload;
            })
            .addCase(getStaffDivisionDepartments.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                state.departments = [];
            });
    },
});

export const { cleanDepartments } = staffDivisionDepartmentsSlice.actions;

export default staffDivisionDepartmentsSlice.reducer;

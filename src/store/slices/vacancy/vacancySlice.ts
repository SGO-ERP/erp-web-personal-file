import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../../../API/types';
import HRVacancyService from '../../../services/vacancy/HRVacancyService';

interface vacancyState {
    departmentVacancies: components['schemas']['HrVacancyStaffDivisionRead'][];
    isLoading: boolean;
    error: any;
}

const initialState: vacancyState = {
    departmentVacancies: [],
    isLoading: false,
    error: null,
};

export const getByDepartmentId = createAsyncThunk(
    'vacancies/getByDepartmentId',
    async (id: string) => {
        const response = await HRVacancyService.getByDepartmentId(id);
        return response;
    },
);

export const vacancySlice = createSlice({
    name: 'vacancySlice',
    initialState,
    reducers: {
        removeSelectedDepartmentFilter: (state, action: PayloadAction<any>) => {
            state.departmentVacancies = state.departmentVacancies.filter(
                (filter) => filter.id !== action.payload,
            );
        },
        cleanVacancies: (state) => {
            state.departmentVacancies = [];
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getByDepartmentId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getByDepartmentId.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = null;
            state.departmentVacancies.push(action.payload);
        });
        builder.addCase(getByDepartmentId.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.departmentVacancies = [];
        });
    },
});

export const { removeSelectedDepartmentFilter, cleanVacancies } = vacancySlice.actions;

export default vacancySlice.reducer;

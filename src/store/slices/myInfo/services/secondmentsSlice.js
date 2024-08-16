import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentService from 'services/HrDocumentsService';

let initialState = {
    departments: {
        data: [],
        loading: true,
        error: '',
    },
};

export const getDepartments = createAsyncThunk(
    'secondments/getDepartments',
    async (_, { rejectedWithValue }) => {
        try {
            return await HrDocumentService.getMatreshka();
        } catch (e) {
            return rejectedWithValue(e.response.data);
        }
    },
);

export const secondmentsSlice = createSlice({
    name: 'secondments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getDepartments.pending, (state) => {
            state.departments.loading = true;
        });
        builder.addCase(getDepartments.fulfilled, (state, action) => {
            state.departments.loading = false;
            state.departments.error = '';
            const data = action.payload;
            state.departments.data = data.children;
        });
        builder.addCase(getDepartments.rejected, (state, action) => {
            //TODO: ADD PROPER EXCEPTION HANDLING

            state.departments.loading = false;
            state.departments.error = action.payload;

            state.departments.error = 'Данные об образовании не найдены';
        });
    },
});

// export const { education, deleteByPathEducation } = secondmentsSlice.actions;

export default secondmentsSlice.reducer;

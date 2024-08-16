import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentService from 'services/HrDocumentsService';

export const initialState = {
    isLoading: true,
    error: null,
    staffDivision: '',
};

export const fetchStaffDivision = createAsyncThunk(
    'staffDivision/fetchStaffDivision',
    async (parentGroupId, { rejectedWithValue }) => {
        try {
            let result = '';

            const response = await HrDocumentService.getDropdownItems({
                option: 'staff_division',
                dataTaken: 'matreshka',
            });

            for (let i of response) {
                if (i.id == parentGroupId) {
                    result += '\n' + i.name;
                    break;
                }
            }

            return result;
        } catch (e) {
            console.error(e);
            return rejectedWithValue(e.response.data);
        }
    },
);

export const staffDivisionSlice = createSlice({
    name: 'staffDivision',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchStaffDivision.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchStaffDivision.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.staffDivision = action.payload;
        });
        builder.addCase(fetchStaffDivision.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        });
    },
});

export const { staffDivision } = staffDivisionSlice.actions;

export default staffDivisionSlice.reducer;

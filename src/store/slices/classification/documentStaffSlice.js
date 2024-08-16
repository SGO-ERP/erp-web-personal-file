import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import DocumentStaffFunctionService from 'services/DocumentStaffFunctionService';

let initialState = {
    documentStaffFunction: [],
    isLoading: false,
    error: '',
    currentPage: 1,
    pageSize: 5,
    hasMore: false,
};

export const documentStaffAll = createAsyncThunk(
    'documentStaff/fetchDocumentStaff',
    async (_, thunkAPI) => {
        try {
            const response = await DocumentStaffFunctionService.get_document_staff();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);
export const deleteDocumentStaff = createAsyncThunk(
    'deleteDocumentStaff/deleteDocumentStaff',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await DocumentStaffFunctionService.delete_document_staff(id);
            dispatch(documentStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const postDocumentStaffDuplicate = createAsyncThunk(
    'postDocumentStaffDuplicate/postDocumentStaffDuplicate',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await DocumentStaffFunctionService.post_document_staff_duplicate(id);
            dispatch(documentStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);
export const postDocumentStaff = createAsyncThunk(
    'postDocumentStaff/postDocumentStaff',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const response = await DocumentStaffFunctionService.post_document_staff(data);
            dispatch(documentStaffAll());
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);
export const documentStaffSlice = createSlice({
    name: 'documentStaff',
    initialState,
    reducers: {
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(documentStaffAll.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(documentStaffAll.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = '';
                state.documentStaffFunction = action.payload;
            })
            .addCase(documentStaffAll.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { getDocumentStaff, changeCurrentPage } = documentStaffSlice.actions;

export default documentStaffSlice.reducer;

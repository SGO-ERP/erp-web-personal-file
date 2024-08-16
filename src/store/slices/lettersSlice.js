import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import HrDocumentService from '../../services/HrDocumentsService';

export const initialState = {
    historyTable: false,
    rowTapped: false,
    idsArray: [],
    tableData: [],
    documents: [],
    isLoading: false,
    error: null,
    tableArray: [],
    checkedValue: 'unchecked',
    openModal: false,
    commetModal: 'Коментарий отсутсвует',
    login: '',
};

export const fetchDocuments = createAsyncThunk('hrDocument/fetchDocuments', async () => {
    try {
        const response = await HrDocumentService.hr_document_get();
        return response;
    } catch (error) {
        console.error(error);
        throw error;
    }
});

export const lettersSlice = createSlice({
    name: 'letters',
    initialState,
    reducers: {
        isHistoryTable: (state, action) => {
            state.historyTable = action.payload;
        },
        isTapped: (state, action) => {
            state.rowTapped = action.payload;
        },
        addId: (state, action) => {
            state.idsArray.push(action.payload);
        },
        addLogin: (state, action) => {
            state.login = action.payload;
        },
        deleteId: (state, action) => {
            state.idsArray = state.idsArray.filter((id) => id !== action.payload);
        },
        clearIds: (state, action) => {
            state.idsArray = [];
        },
        setTableData: (state, action) => {
            state.tableData = action.payload;
        },
        getDocumentsStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        getDocumentsSuccess: (state, action) => {
            state.isLoading = false;
            state.documents = action.payload;
        },
        getDocumentsFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        isParentChecked: (state, action) => {
            state.checkedValue = action.payload;
        },
        showModal: (state, action) => {
            state.openModal = action.payload;
        },
        changeComment: (state, action) => {
            state.commetModal = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDocuments.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDocuments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tableArray = action.payload;
            })
            .addCase(fetchDocuments.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    isHistoryTable,
    isTapped,
    addId,
    deleteId,
    clearIds,
    setTableData,
    getDocumentsSuccess,
    isParentChecked,
    changeComment,
    addLogin,
} = lettersSlice.actions;

export const selectTableData = (state) => state.table.tableData;

export default lettersSlice.reducer;

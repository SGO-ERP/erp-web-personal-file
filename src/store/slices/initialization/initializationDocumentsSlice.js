import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";

let initialState = {
    loading: false,
    error: null,

    documentsError: null,
    documentsLoading: true,

    needDueDate: false,
    needComment: false,

    documents: [],
    selectedDocument: {},
};

export const getDocuments = createAsyncThunk(
    "initialization/getDocuments",
    async (id, { dispatch, thunkAPI }) => {
        try {
            return await HrDocumentTemplatesService.get_hr_documents_template_by_user_id(id);
        } catch (error) {}
    },
);

export const initializationDocuments = createSlice({
    name: "initializationDocuments",
    initialState,
    reducers: {
        setDocument: (state, action) => {
            state.selectedDocument = action.payload;
            state.needComment = action.payload.is_initial_comment_required;
            state.needDueDate = action.payload.is_due_date_required;
        },
        resetDocument: (state) => {
            state.selectedDocument = {};
        },
        resetDocuments: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDocuments.pending, (state) => {
                state.documentsLoading = true;
            })
            .addCase(getDocuments.fulfilled, (state, action) => {
                state.documentsLoading = false;
                state.documentsError = "";
                state.documents = action.payload;
            })
            .addCase(getDocuments.rejected, (state, action) => {
                state.documentsLoading = false;
                state.documents = [];
                state.documentsError = action.payload;
            });
    },
});

export const { setDocument, resetDocument, resetDocuments } = initializationDocuments.actions;

export default initializationDocuments.reducer;

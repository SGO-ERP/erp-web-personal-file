import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import HrDocumentService from "../../../services/HrDocumentsService";

export const initialState = {
    isLoading: true,
    error: null,
    commentModal: false,
    hrDocumentsNotSigned: [],
    hasMore: false,
    isSigned: false,
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getHrDocumentSNotSigned = createAsyncThunk(
    "hrDocument/fetchDocuments",
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const searchQuery = state.tableController.searchValue;

        const response = await HrDocumentService.get_hr_documents_not_signed(
            page,
            limit,
            searchQuery,
        );
        return response;
    },
);

export const postHrDocumentById = createAsyncThunk(
    "postHrDocumentById/postHrDocumentById",
    async ({ hrDocuments, page, pageSize }, { rejectWithValue, dispatch }) => {
        return HrDocumentService.hr_document_post_id(hrDocuments)
            .then(async (response) => {
                // Wait for 2 seconds before dispatching the next action
                await delay(2000);

                dispatch(getHrDocumentSNotSigned({ page: page, limit: pageSize }));
                return response;
            })
            .catch((error) => {
                console.error(error);
                return rejectWithValue(error.response.data);
            });
    },
);

export const postHrDocumentByIdAndEcp = createAsyncThunk(
    "postHrDocumentById/postHrDocumentByIdAndEcp",
    async ({ hrDocuments, page, pageSize }, { rejectWithValue, dispatch }) => {
        return HrDocumentService.hr_document_post_id_and_ecp(hrDocuments)
            .then(async (response) => {
                // Wait for 2 seconds before dispatching the next action
                await delay(2000);

                dispatch(getHrDocumentSNotSigned({ page: page, limit: pageSize }));
                return response;
            })
            .catch((error) => {
                console.error(error);
                return rejectWithValue(error.response.data);
            });
    },
);

export const postMultiHrDocumentByIdAndEcp = createAsyncThunk(
    "postHrDocumentById/postMultiHrDocumentByIdAndEcp",
    async ({ hrDocuments, page, pageSize }, { rejectWithValue, dispatch }) => {
        return HrDocumentService.multi_hr_document_post_id_and_ecp(hrDocuments)
            .then(async (response) => {
                // Wait for 2 seconds before dispatching the next action
                await delay(2000);

                dispatch(getHrDocumentSNotSigned({ page: page, limit: pageSize }));
                return response;
            })
            .catch((error) => {
                console.error(error);
                return rejectWithValue(error.response.data);
            });
    },
);

export const lettersOrdersSlice = createSlice({
    name: "lettersOrders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHrDocumentSNotSigned.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getHrDocumentSNotSigned.fulfilled, (state, action) => {
                state.isLoading = false;
                state.hrDocumentsNotSigned = action.payload?.data;
                state.hasMore = action.payload?.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentSNotSigned.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.hrDocumentsNotSigned = [];
            })
            .addCase(postHrDocumentById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postHrDocumentById.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
                state.isSigned = true;
            })
            .addCase(postHrDocumentById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isSigned = false;
            })
            .addCase(postHrDocumentByIdAndEcp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postHrDocumentByIdAndEcp.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(postHrDocumentByIdAndEcp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(postMultiHrDocumentByIdAndEcp.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(postMultiHrDocumentByIdAndEcp.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(postMultiHrDocumentByIdAndEcp.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { lettersOrders, addSelectedOrder } = lettersOrdersSlice.actions;

export default lettersOrdersSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';

export const initialState = {
    orderTemplates: [],
};

export const getHrDocumentsTemplates = createAsyncThunk(
    'hrDocumentTemplates/fetchDocuments',
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const response = await HrDocumentTemplatesService.get_hr_doc_templates_with_pagination(
            page,
            limit,
            state.tableConstructorSlice.searchValue === null
                ? ''
                : state.tableConstructorSlice.searchValue,
        );
        return response;
    },
);

export const getHrDocumentsTemplatesById = createAsyncThunk(
    'getHrDocumentsTemplatesById/fetchDocuments',
    async (id) => {
        return await HrDocumentTemplatesService.get_hr_documents_template_by_user_id(id);
    },
);

export const getHrDocumentsTemplatesArchive = createAsyncThunk(
    'getHrDocumentsTemplatesArchive/fetchDocuments',
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const response =
            await HrDocumentTemplatesService.get_hr_doc_templates_archive_with_pagination(
                page,
                limit,
                state.tableConstructorSlice.searchValue === null
                    ? ''
                    : state.tableConstructorSlice.searchValue,
            );
        return response;
    },
);

export const getHrDocumentsTemplatesDraft = createAsyncThunk(
    'getHrDocumentsTemplatesDraft/fetchDocuments',
    async ({ page, limit }, { getState }) => {
        const state = getState();
        const response =
            await HrDocumentTemplatesService.get_hr_doc_templates_draft_with_pagination(
                page,
                limit,
                state.tableConstructorSlice.searchValue === null
                    ? ''
                    : state.tableConstructorSlice.searchValue,
            );
        return response;
    },
);

export const tableControllerSlice = createSlice({
    name: 'tableConstructorController',
    initialState,
    reducers: {
        changeTabAction(state, action) {
            state.currentTab = action.payload;
        },
        changeCurrentPage(state, action) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
        querySearch(state, action) {
            state.searchValue = action.payload;
        },
        changeHrDocsTemplatesParams(state, action) {
            state.limit = action.payload.limit;
            state.page = action.payload.page;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHrDocumentsTemplates.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data.filter(
                    (order) => order.is_draft === false,
                );
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesArchive.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesArchive.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data.filter(
                    (order) => order.is_draft === false,
                );
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesArchive.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesDraft.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesDraft.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data;
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesDraft.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data;
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.orderTemplates = [];
            });
    },
});

export const {
    changeTabAction,
    changeCurrentPage,
    querySearch,
    resetInitialState,
    changeHrDocsTemplatesParams,
} = tableControllerSlice.actions;

export default tableControllerSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import HrDocumentTemplatesService from 'services/HrDocumentTemplatesService';

// Define types for the state and other elements
export const Tabs = {
    letter: 'letter',
    history: 'history',
    draft: 'draft',
    candidates: 'candidates',
} as const;

type TabType = keyof typeof Tabs;

interface HrDocumentTemplate {
    id: string;
    title: string;
    is_draft: boolean;
    // other relevant fields...
}

interface HrDocumentTemplatesResponse {
    data: HrDocumentTemplate[];
    hasMore: boolean;
}

interface TableConstructorState {
    orderTemplates: HrDocumentTemplate[];
    currentTab: TabType;
    currentPage: number;
    pageSize: number;
    searchValue: string | null;
    hasNextPage: boolean;
    isLoading: boolean;
    error?: string | null;
    page: number;
    limit: number;
}

export const initialState: TableConstructorState = {
    orderTemplates: [],
    currentTab: Tabs.letter,
    currentPage: 1,
    pageSize: 5,
    searchValue: null,
    hasNextPage: false,
    isLoading: false,
    page: 1,
    limit: 5,
};

export const getHrDocumentsTemplates = createAsyncThunk<HrDocumentTemplatesResponse>(
    'hrDocumentTemplates/fetchDocuments',
    async (_, { getState }) => {
        const state = getState() as { tableConstructorSlice: TableConstructorState };
        const { page, limit } = initialState;
        const response = await HrDocumentTemplatesService.get_hr_doc_templates_with_pagination(
            page,
            limit,
            state.tableConstructorSlice.searchValue === null
                ? ''
                : state.tableConstructorSlice.searchValue,
        );

        // Ensure response is defined and has the expected shape
        if (!response) {
            throw new Error("Failed to fetch document templates");
        }

        return response;
    },
);


export const getHrDocumentsTemplatesById = createAsyncThunk<
    HrDocumentTemplate,
    string,
    { rejectValue: string }
>(
    'getHrDocumentsTemplatesById/fetchDocuments',
    async (id: string, { rejectWithValue }) => {
        return await HrDocumentTemplatesService.get_hr_documents_template_by_user_id(id);
    },
);

export const getHrDocumentsTemplatesArchive = createAsyncThunk<
    HrDocumentTemplatesResponse,
    { page: number; limit: number }, // Argument type
    { rejectValue: string } // ThunkAPI config with reject value type
>(
    'getHrDocumentsTemplatesArchive/fetchDocuments',
    async ({ page, limit }: { page: number; limit: number }, { getState }) => {
        const state = getState() as { tableConstructorSlice: TableConstructorState };
        const response =
            await HrDocumentTemplatesService.get_hr_doc_templates_archive_with_pagination(
                page,
                limit,
                state.tableConstructorSlice.searchValue === null
                    ? ''
                    : state.tableConstructorSlice.searchValue,
            );

        // Ensure response is defined and has the expected shape
        if (!response) {
            throw new Error("Failed to fetch document templates");
        }
        return response;
    },
);

export const getHrDocumentsTemplatesDraft = createAsyncThunk<
    HrDocumentTemplatesResponse, // Return type of the thunk
    { page: number; limit: number }, // Argument type
    { state: { tableConstructorSlice: TableConstructorState } } // ThunkAPI config, specifically defining the state type
>(
    'getHrDocumentsTemplatesDraft/fetchDocuments',
    async ({ page, limit }, { getState }) => {
        const state = getState(); // Properly typed state
        const response = await HrDocumentTemplatesService.get_hr_doc_templates_draft_with_pagination(
            page,
            limit,
            state.tableConstructorSlice.searchValue === null ? '' : state.tableConstructorSlice.searchValue,
        );

        // Optional: Handle undefined responses
        if (!response) {
            throw new Error("Failed to fetch draft documents templates.");
        }

        return response;
    }
);


export const tableControllerSlice = createSlice({
    name: 'tableConstructorController',
    initialState,
    reducers: {
        changeTabAction(state, action: PayloadAction<TabType>) {
            state.currentTab = action.payload;
        },
        changeCurrentPage(state, action: PayloadAction<{ page: number; pageSize: number }>) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
        querySearch(state, action: PayloadAction<string | null>) {
            state.searchValue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHrDocumentsTemplates.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplates.fulfilled, (state, action: PayloadAction<HrDocumentTemplatesResponse>) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data.filter(
                    (order) => !order.is_draft,
                );
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? null;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesArchive.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesArchive.fulfilled, (state, action: PayloadAction<HrDocumentTemplatesResponse>) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data.filter(
                    (order) => !order.is_draft,
                );
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesArchive.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? null;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesDraft.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesDraft.fulfilled, (state, action: PayloadAction<HrDocumentTemplatesResponse>) => {
                state.isLoading = false;
                state.orderTemplates = action.payload.data;
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesDraft.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? null;
                state.orderTemplates = [];
            })
            .addCase(getHrDocumentsTemplatesById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
            })
            .addCase(getHrDocumentsTemplatesById.fulfilled, (state, action: PayloadAction<HrDocumentTemplate>) => {
                state.isLoading = false;
                state.orderTemplates = [action.payload];
                state.error = null;
            })
            .addCase(getHrDocumentsTemplatesById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message ?? null;
                state.orderTemplates = [];
            });
    },
});

export const {
    changeTabAction,
    changeCurrentPage,
    querySearch,
} = tableControllerSlice.actions;

export default tableControllerSlice.reducer;

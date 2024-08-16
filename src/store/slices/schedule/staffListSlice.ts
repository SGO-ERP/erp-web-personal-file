import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components, operations } from '../../../API/types';
import { RootState } from '../../index';
import { PrivateServices } from 'API';

interface staffListState {
    list: components['schemas']['StaffListStatusRead'][];
    currentPage: number;
    pageSize: number;
    searchValue: string | null;
    hasNextPage: boolean;
    isLoading?: boolean;
    error?: any;
}

export const initialState: staffListState = {
    list: [],
    currentPage: 1,
    pageSize: 5,
    searchValue: null,
    hasNextPage: false,
    isLoading: false,
    error: null,
};

export const getStaffListDrafts = createAsyncThunk(
    'staffList/getDrafts',
    async (
        {
            // @ts-expect-error Exists
            skip = 1,
            // @ts-expect-error Exists
            limit = 5,
        }: operations['get_history_api_v1_staff_list_drafts__get']['parameters']['query'],
        thunkAPI,
    ) => {
        skip = (skip - 1) * limit;
        const limitParam = limit + 1;
        const state = thunkAPI.getState() as RootState;

        const response = await PrivateServices.get('/api/v1/staff_list/drafts/', {
            params: {
                query: { skip, limit: limitParam, filter: state.staffList.searchValue ?? '' },
            },
        });
        if (response.data) {
            const hasMore = response.data.length > limit;
            if (hasMore) {
                response.data.pop(); // Remove the extra item
            }
            return { data: response.data, hasMore };
        }
    },
);

export const getStaffListSigned = createAsyncThunk(
    'staffList/getSigned',
    async (
        {
            // @ts-expect-error Exists
            skip = 1,
            // @ts-expect-error Exists
            limit = 5,
        }: operations['get_history_api_v1_staff_list_signed__get']['parameters']['query'],
        thunkAPI,
    ) => {
        skip = (skip - 1) * limit;
        const limitParam = limit + 1;

        const state = thunkAPI.getState() as RootState;

        const response = await PrivateServices.get('/api/v1/staff_list/signed/', {
            params: {
                query: {
                    skip,
                    limit: limitParam,
                    filter: state.staffList.searchValue ?? '',
                },
            },
        });
        if (response.data) {
            const hasMore = response.data.length > limit;
            if (hasMore) {
                response.data.pop(); // Remove the extra item
            }
            return { data: response.data, hasMore };
        }
    },
);

export const staffListSlice = createSlice({
    name: 'staffListSlice',
    initialState,
    reducers: {
        changeCurrentPage(state, action: PayloadAction<{ page: number; pageSize: number }>) {
            state.currentPage = action.payload.page;
            state.pageSize = action.payload.pageSize;
        },
        querySearch(state, action: PayloadAction<string>) {
            state.searchValue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStaffListDrafts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
                state.list = [];
            })
            .addCase(getStaffListDrafts.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.list = action.payload.data;
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getStaffListDrafts.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                state.list = [];
            })
            .addCase(getStaffListSigned.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.hasNextPage = false;
                state.list = [];
            })
            .addCase(getStaffListSigned.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.list = action.payload.data;
                state.hasNextPage = action.payload.hasMore;
                state.error = null;
            })
            .addCase(getStaffListSigned.rejected, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.error = action.payload;
                state.list = [];
            });
    },
});

export const { changeCurrentPage, querySearch } = staffListSlice.actions;

export default staffListSlice.reducer;

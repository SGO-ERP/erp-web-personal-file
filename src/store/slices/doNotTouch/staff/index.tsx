import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { UsersService } from 'services/doNotTouch/UserService';

export const getActiveStaff = createAsyncThunk(
    'staff/getActiveStaff',
    async (
        params: {
            skip: number;
            limit: number;
            filter: string;
        },
        thunkAPI,
    ) => {
        const response = await UsersService.getActiveUsers(params);

        return response;
    },
);

export const getArchivedStaff = createAsyncThunk(
    'staff/getArchivedStaff',
    async (
        params: {
            skip: number;
            limit: number;
            filter: string;
        },
        thunkAPI,
    ) => {
        const response = await UsersService.getArchivedUsers(params);

        return response;
    },
);

interface IStaffState {
    activeStaff: {
        total: number;
        users: any[];
    };
    archivedStaff: {
        total: number;
        users: any[];
    };
    isLoading: boolean;
    search: string;
}

const initialState = {
    activeStaff: {
        total: 0,
        users: [],
    },
    archivedStaff: {
        total: 0,
        users: [],
    },
    isLoading: false,
    search: '',
} as IStaffState;

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        setSearch(state, action) {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getActiveStaff.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getActiveStaff.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.activeStaff = payload;
        });
        builder.addCase(getActiveStaff.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getArchivedStaff.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getArchivedStaff.fulfilled, (state, { payload }) => {
            state.isLoading = false;
            state.archivedStaff = payload;
        });
        builder.addCase(getArchivedStaff.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setSearch } = staffSlice.actions;

export default staffSlice.reducer;

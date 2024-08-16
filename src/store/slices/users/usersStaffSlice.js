import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UsersService from '../../../services/UserService';

let initialState = {
    archive: {
        data: [],
        loading: false,
        error: '',
        commentModal: false,
        hasMore: false,
    },
    active: {
        data: [],
        loading: false,
        error: '',
        commentModal: false,
        hasMore: false,
    },
    search: '',
};

export const getArchivedUsers = createAsyncThunk(
    'users2/getArchivedUsers',
    async ({ page, limit }, { getState, dispatch }) => {
        const state = getState();
        const response = await UsersService.feat_archived_users(
            page,
            limit,
            state.usersStaff.search,
        );
        return response;
    },
);
export const getActiveUsers = createAsyncThunk(
    'users2/getActiveUsers',
    async ({ page, limit }, { getState, dispatch }) => {
        const state = getState();
        const response = await UsersService.feat_active_users(page, limit, state.usersStaff.search);
        return response;
    },
);

export const usersStaffSlice = createSlice({
    name: 'usersStaff',
    initialState,
    reducers: {
        setSearchTextForStaff: (state, action) => {
            state.search = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getArchivedUsers.pending, (state) => {
            state.archive.loading = true;
        });
        builder.addCase(getArchivedUsers.fulfilled, (state, action) => {
            state.archive.loading = false;
            state.archive.error = '';
            state.archive.data = action.payload.data;
            state.archive.hasMore = action.payload.hasMore;
        });
        builder.addCase(getArchivedUsers.rejected, (state, action) => {
            state.archive.loading = false;
            state.archive.error = action.payload;
        });
        builder.addCase(getActiveUsers.pending, (state) => {
            state.active.loading = true;
        });
        builder.addCase(getActiveUsers.fulfilled, (state, action) => {
            state.active.loading = false;
            state.active.error = '';
            state.active.data = action.payload.data;
            state.active.hasMore = action.payload.hasMore;
        });
        builder.addCase(getActiveUsers.rejected, (state, action) => {
            state.active.loading = false;
            state.active.error = action.payload;
        });
    },
});

export const { usersStaff, setSearchTextForStaff } = usersStaffSlice.actions;

export default usersStaffSlice.reducer;

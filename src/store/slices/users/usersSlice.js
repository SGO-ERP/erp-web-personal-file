import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';
import UsersService from '../../../services/myInfo/UsersService';

let initialState = {
    user: null,
    loading: true,
    error: '',
    usersFields: [],
};

export const getUser = createAsyncThunk('user/getUser', async (userId, { rejectWithValue }) => {
    try {
        return await UsersService.get_user_by_id(userId);
    } catch (e) {
        return rejectWithValue(e.response.data);
    }
});
export const getFamilyStatus = createAsyncThunk('user/getFamilyStatus', async () => {
    return await UsersService.get_family_status();
});

export const getFields = createAsyncThunk('user/getFields', async () => {
    return await UsersService.get_users_fields();
});


export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        resetUsersSlice: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.user = action.payload;
        });
        builder.addCase(getUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = [];
        });
        builder.addCase(getFields.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getFields.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.usersFields = action.payload;
        });
        builder.addCase(getFields.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.usersFields = [];
        });
    },
});

export const { users, resetUsersSlice } = usersSlice.actions;

export default usersSlice.reducer;

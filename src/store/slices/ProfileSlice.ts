import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';
import { NewUserService } from '../../services/UserService';

interface State {
    data?: components['schemas']['schemas__user__UserRead'];
    permissions: number[];
    loading: boolean;
    error: any;
}

const initialState: State = {
    data: undefined,
    loading: true,
    permissions: [],
    error: '',
};

export const getProfile = createAsyncThunk(
    'profile/user',
    // TODO: Перенести потом на UserService с NewUserService
    NewUserService.getProfileService,
);

export const getPermissions = createAsyncThunk(
    'profile/permissions',
    NewUserService.getPermissions,
);

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetProfileSlice: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.data = action.payload.data;
        });
        builder.addCase(getProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.data = undefined;
        });
        builder.addCase(getPermissions.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getPermissions.fulfilled, (state, action) => {
            state.loading = false;
            state.error = '';
            state.permissions = action.payload.data.map((item: any) => item.type.sequence_id);
        });
        builder.addCase(getPermissions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.permissions = [];
        });
    },
});

export const { resetProfileSlice } = profileSlice.actions;

export default profileSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { components, paths } from 'API/types';
import { PrivateServices } from '../../../../API';

interface State {
    data: components['schemas']['UserShortReadPagination'];
    error: any;
    loading: boolean;
}

const initialState: State = {
    data: {},
    loading: false,
    error: null,
};


export const getUsersAbsent = createAsyncThunk(
    'users/getAbsentUsers',
    (options: paths['/api/v1/attendance/absent/{id}/']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/attendance/absent/{id}/', {
            params: options,
        });
    },
);

export const tableAbsentAttendance = createSlice({
    name: 'tableAbsentAttendance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUsersAbsent.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = {};
        });
        builder.addCase(getUsersAbsent.fulfilled, (state, action) => {
            if (action?.payload && action.payload.data) {
                state.loading = false;
                state.data = action.payload.data;
            }
        });
        builder.addCase(getUsersAbsent.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export default tableAbsentAttendance.reducer;

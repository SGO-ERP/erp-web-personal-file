import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { components, paths } from 'API/types';
import { PrivateServices } from '../../../../API';

interface State {
    weeks: string[];
    data: components['schemas']['UserShortReadStatusPagination'];
    date: string[];
    error: any;
    loading: boolean;
}

const initialState: State = {
    weeks: [],
    data: {},
    date: [],
    loading: false,
    error: null,
};

export const getUsersBySchedule = createAsyncThunk(
    'users/getUsers',
    (options: paths['/api/v1/users/schedule/{id}']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/users/schedule/{id}', {
            params: options,
        });
    },
);
export const listUserData = createSlice({
    name: 'listUserData',
    initialState,
    reducers: {
        setWeeks: (state, action: PayloadAction<string[]>) => {
            state.weeks = action.payload;
        },
        setDate: (state, action: PayloadAction<string[]>) => {
            state.date = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUsersBySchedule.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.data = {};
        });
        builder.addCase(getUsersBySchedule.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.loading = false;
                state.data = action.payload.data;
            }
        });
        builder.addCase(getUsersBySchedule.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { setWeeks, setDate } = listUserData.actions;

export default listUserData.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../../API/types';
import { PrivateServices } from 'API';

interface TableTypes {
    lessons: {
        dataLessons: components['schemas']['ScheduleYearReadPagination'];
        loading: boolean;
        error: any;
    };
    credits: {
        dataCredits: components['schemas']['ScheduleYearReadPagination'];
        loading: boolean;
        error: any;
    };
}

const initialState: TableTypes = {
    lessons: {
        dataLessons: {},
        loading: false,
        error: null,
    },
    credits: {
        dataCredits: {},
        loading: false,
        error: null,
    },
};

export const getLessonsBsp = createAsyncThunk(
    'bsp/getLessonsBsp',
    (options: paths['/api/v1/schedule_year']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/schedule_year', {
            params: options,
        });
    },
);

export const getCreditsBsp = createAsyncThunk(
    'bsp/getCreditsBsp',
    (options: paths['/api/v1/schedule_year']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/schedule_year', {
            params: options,
        });
    },
);

export const tableMonthPlan = createSlice({
    name: 'tableMonthPlan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getLessonsBsp.pending, (state) => {
            state.lessons.loading = true;
            state.lessons.error = null;
            state.lessons.dataLessons = {};
        });
        builder.addCase(getLessonsBsp.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.lessons.loading = false;
                state.lessons.dataLessons = action.payload.data;
            }
        });
        builder.addCase(getLessonsBsp.rejected, (state, action) => {
            state.lessons.loading = false;
            state.lessons.error = action.payload;
        });

        builder.addCase(getCreditsBsp.pending, (state) => {
            state.credits.loading = true;
            state.credits.error = null;
            state.credits.dataCredits = {};
        });
        builder.addCase(getCreditsBsp.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.credits.loading = false;
                state.credits.dataCredits = action.payload.data;
            }
        });
        builder.addCase(getCreditsBsp.rejected, (state, action) => {
            state.credits.loading = false;
            state.credits.error = action.payload;
        });
    },
});

export default tableMonthPlan.reducer;

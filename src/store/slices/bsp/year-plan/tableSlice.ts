import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { components, paths } from '../../../../API/types';
import { PrivateServices } from 'API';

interface TableTypes {
    signed: {
        dataSigned: components['schemas']['BspPlanReadPagination'];
        loading: boolean;
        error: any;
    };
    draft: {
        dataDraft: components['schemas']['BspPlanReadPagination'];
        loading: boolean;
        error: any;
    };
}

const initialState: TableTypes = {
    signed: {
        dataSigned: {},
        loading: false,
        error: null,
    },
    draft: {
        dataDraft: {},
        loading: false,
        error: null,
    },
};

export const getSignedBsp = createAsyncThunk(
    'users/getSignedBsp',
    (options: paths['/api/v1/plan/signed/']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/plan/signed/', {
            params: options,
        });
    },
);

export const getDraftBsp = createAsyncThunk(
    'users/getDraftBsp',
    (options: paths['/api/v1/plan/draft/']['get']['parameters']) => {
        return PrivateServices.get('/api/v1/plan/draft/', {
            params: options,
        });
    },
);

export const tableSlice = createSlice({
    name: 'tableYearPlanBSP',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSignedBsp.pending, (state) => {
            state.signed.loading = true;
            state.signed.error = null;
            state.signed.dataSigned = {};
        });
        builder.addCase(getSignedBsp.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.signed.loading = false;
                state.signed.dataSigned = action.payload.data;
            }
        });
        builder.addCase(getSignedBsp.rejected, (state, action) => {
            state.signed.loading = false;
            state.signed.error = action.payload;
        });

        builder.addCase(getDraftBsp.pending, (state) => {
            state.draft.loading = true;
            state.draft.error = null;
            state.draft.dataDraft = {};
        });
        builder.addCase(getDraftBsp.fulfilled, (state, action) => {
            if (action.payload.data) {
                state.draft.loading = false;
                state.draft.dataDraft = action.payload.data;
            }
        });
        builder.addCase(getDraftBsp.rejected, (state, action) => {
            state.draft.loading = false;
            state.draft.error = action.payload;
        });
    },
});

export default tableSlice.reducer;

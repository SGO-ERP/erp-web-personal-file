import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface LiberationTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    liberation_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedLiberation: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    liberation_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedLiberation: null,
    modalLoading: false,
};

export const getLiberation = createAsyncThunk(
    "adminLiberation/getLiberation",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("medical/liberations?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminLiberation = createSlice({
    name: "adminLiberation",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedLiberation: (state, action) => {
            state.selectedLiberation = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLiberation.pending, (state) => {
            state.liberation_types.loading = true;
            state.liberation_types.error = null;
            state.liberation_types.data = [];
        });
        builder.addCase(getLiberation.fulfilled, (state, action) => {
            state.liberation_types.loading = false;
            state.liberation_types.data = action.payload as LiberationTypeRead;
        });
        builder.addCase(getLiberation.rejected, (state, action) => {
            state.liberation_types.loading = false;
            state.liberation_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedLiberation, setLoadingModal } =
    adminLiberation.actions;

export default adminLiberation.reducer;

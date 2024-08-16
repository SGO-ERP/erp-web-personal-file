import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface ViolationTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    violation_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedViolation: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    violation_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedViolation: null,
    modalLoading: false,
};

export const getViolation = createAsyncThunk(
    "adminViolation/getViolation",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("additional/violation_type?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminViolation = createSlice({
    name: "adminViolation",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedViolation: (state, action) => {
            state.selectedViolation = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getViolation.pending, (state) => {
            state.violation_types.loading = true;
            state.violation_types.error = null;
            state.violation_types.data = [];
        });
        builder.addCase(getViolation.fulfilled, (state, action) => {
            state.violation_types.loading = false;
            state.violation_types.data = action.payload as ViolationTypeRead;
        });
        builder.addCase(getViolation.rejected, (state, action) => {
            state.violation_types.loading = false;
            state.violation_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedViolation, setLoadingModal } =
    adminViolation.actions;

export default adminViolation.reducer;

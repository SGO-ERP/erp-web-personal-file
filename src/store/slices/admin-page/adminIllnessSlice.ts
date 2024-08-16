import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface IllnessTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    illness_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedIllness: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    illness_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedIllness: null,
    modalLoading: false,
};

export const getIllness = createAsyncThunk(
    "adminIllness/getIllness",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("medical/illness_type?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminIllness = createSlice({
    name: "adminIllness",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedIllness: (state, action) => {
            state.selectedIllness = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getIllness.pending, (state) => {
            state.illness_types.loading = true;
            state.illness_types.error = null;
            state.illness_types.data = [];
        });
        builder.addCase(getIllness.fulfilled, (state, action) => {
            state.illness_types.loading = false;
            state.illness_types.data = action.payload as IllnessTypeRead;
        });
        builder.addCase(getIllness.rejected, (state, action) => {
            state.illness_types.loading = false;
            state.illness_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedIllness, setLoadingModal } =
    adminIllness.actions;

export default adminIllness.reducer;

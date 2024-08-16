import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface NationalityTypeRead {
    created_at: string;
    id: string;
    name: string;
    nameKZ: string;
    updated_at: string;
}

interface TableTypes {
    nationality_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedNationality: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    nationality_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedNationality: null,
    modalLoading: false,
};

export const getNationalities = createAsyncThunk(
    "adminNationalities/getNationalities",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("personal/nationality?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminNationalities = createSlice({
    name: "adminNationalities",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedNationality: (state, action) => {
            state.selectedNationality = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getNationalities.pending, (state) => {
            state.nationality_types.loading = true;
            state.nationality_types.error = null;
            state.nationality_types.data = [];
        });
        builder.addCase(getNationalities.fulfilled, (state, action) => {
            state.nationality_types.loading = false;
            state.nationality_types.data = action.payload as NationalityTypeRead;
        });
        builder.addCase(getNationalities.rejected, (state, action) => {
            state.nationality_types.loading = false;
            state.nationality_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedNationality, setLoadingModal } =
    adminNationalities.actions;

export default adminNationalities.reducer;

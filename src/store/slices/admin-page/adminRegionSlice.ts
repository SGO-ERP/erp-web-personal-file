import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface RegionTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    region_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedRegion: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    region_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedRegion: null,
    modalLoading: false,
};

export const getRegion = createAsyncThunk(
    "adminRegion/getRegion",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("personal/region?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminRegion = createSlice({
    name: "adminRegion",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedRegion: (state, action) => {
            state.selectedRegion = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRegion.pending, (state) => {
            state.region_types.loading = true;
            state.region_types.error = null;
            state.region_types.data = [];
        });
        builder.addCase(getRegion.fulfilled, (state, action) => {
            state.region_types.loading = false;
            state.region_types.data = action.payload as RegionTypeRead;
        });
        builder.addCase(getRegion.rejected, (state, action) => {
            state.region_types.loading = false;
            state.region_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedRegion, setLoadingModal } =
    adminRegion.actions;

export default adminRegion.reducer;

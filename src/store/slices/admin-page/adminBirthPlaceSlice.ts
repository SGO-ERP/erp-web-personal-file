import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface BirthPlaceTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    birthPlace_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedBirthPlace: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    birthPlace_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedBirthPlace: null,
    modalLoading: false,
};

export const getBirthPlaces = createAsyncThunk(
    "adminBirthPlaces/getBirthPlaces",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("personal/birthplace?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminBirthPlaces = createSlice({
    name: "adminBirthPlaces",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedBirthPlace: (state, action) => {
            state.selectedBirthPlace = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBirthPlaces.pending, (state) => {
            state.birthPlace_types.loading = true;
            state.birthPlace_types.error = null;
            state.birthPlace_types.data = [];
        });
        builder.addCase(getBirthPlaces.fulfilled, (state, action) => {
            state.birthPlace_types.loading = false;
            state.birthPlace_types.data = action.payload as BirthPlaceTypeRead;
        });
        builder.addCase(getBirthPlaces.rejected, (state, action) => {
            state.birthPlace_types.loading = false;
            state.birthPlace_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedBirthPlace, setLoadingModal } =
    adminBirthPlaces.actions;

export default adminBirthPlaces.reducer;

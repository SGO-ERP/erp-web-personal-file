import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface ClothingTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    clothing_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedClothing: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    clothing_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedClothing: null,
    modalLoading: false,
};

export const getClothingType = createAsyncThunk(
    "adminClothingType/getClothingType",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/type/clothing/?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminClothingType = createSlice({
    name: "adminClothingType",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedClothing: (state, action) => {
            state.selectedClothing = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getClothingType.pending, (state) => {
            state.clothing_types.loading = true;
            state.clothing_types.error = null;
            state.clothing_types.data = [];
        });
        builder.addCase(getClothingType.fulfilled, (state, action) => {
            state.clothing_types.loading = false;
            state.clothing_types.data = action.payload as ClothingTypeRead;
        });
        builder.addCase(getClothingType.rejected, (state, action) => {
            state.clothing_types.loading = false;
            state.clothing_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedClothing, setLoadingModal } =
    adminClothingType.actions;

export default adminClothingType.reducer;

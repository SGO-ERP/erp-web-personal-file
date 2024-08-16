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
    clothing_models: {
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
    clothing_models: {
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

export const getClothingModel = createAsyncThunk(
    "adminClothingModel/getClothingModel",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/model/clothing/");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminClothingModels = createSlice({
    name: "adminClothingModel",
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
        builder.addCase(getClothingModel.pending, (state) => {
            state.clothing_models.loading = true;
            state.clothing_models.error = null;
            state.clothing_models.data = [];
        });
        builder.addCase(getClothingModel.fulfilled, (state, action) => {
            state.clothing_models.loading = false;
            state.clothing_models.data = action.payload as ClothingTypeRead;
        });
        builder.addCase(getClothingModel.rejected, (state, action) => {
            state.clothing_models.loading = false;
            state.clothing_models.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedClothing, setLoadingModal } =
    adminClothingModels.actions;

export default adminClothingModels.reducer;

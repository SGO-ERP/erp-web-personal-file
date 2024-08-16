import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface WeaponTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    weapon_models: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedWeapon: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    weapon_models: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedWeapon: null,
    modalLoading: false,
};

export const getWeaponModel = createAsyncThunk(
    "adminWeaponModels/getWeaponModel",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/models/army");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminWeaponModels = createSlice({
    name: "adminWeaponModels",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedWeapon: (state, action) => {
            state.selectedWeapon = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getWeaponModel.pending, (state) => {
            state.weapon_models.loading = true;
            state.weapon_models.error = null;
            state.weapon_models.data = [];
        });
        builder.addCase(getWeaponModel.fulfilled, (state, action) => {
            state.weapon_models.loading = false;
            state.weapon_models.data = action.payload as WeaponTypeRead;
        });
        builder.addCase(getWeaponModel.rejected, (state, action) => {
            state.weapon_models.loading = false;
            state.weapon_models.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedWeapon, setLoadingModal } =
    adminWeaponModels.actions;

export default adminWeaponModels.reducer;

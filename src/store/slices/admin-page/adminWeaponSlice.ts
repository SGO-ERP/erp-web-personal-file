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
    weapon_types: {
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
    weapon_types: {
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

export const getWeaponType = createAsyncThunk(
    "adminWeaponType/getWeaponType",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/type/army/?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminWeaponType = createSlice({
    name: "adminWeaponType",
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
        builder.addCase(getWeaponType.pending, (state) => {
            state.weapon_types.loading = true;
            state.weapon_types.error = null;
            state.weapon_types.data = [];
        });
        builder.addCase(getWeaponType.fulfilled, (state, action) => {
            state.weapon_types.loading = false;
            state.weapon_types.data = action.payload as WeaponTypeRead;
        });
        builder.addCase(getWeaponType.rejected, (state, action) => {
            state.weapon_types.loading = false;
            state.weapon_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedWeapon, setLoadingModal } =
    adminWeaponType.actions;

export default adminWeaponType.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface OtherTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    other_models: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedOther: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    other_models: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedOther: null,
    modalLoading: false,
};

export const getOtherModel = createAsyncThunk(
    "adminOtherModel/getOtherModel",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/models/other/");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminOtherModel = createSlice({
    name: "adminOtherModel",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedOther: (state, action) => {
            state.selectedOther = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getOtherModel.pending, (state) => {
            state.other_models.loading = true;
            state.other_models.error = null;
            state.other_models.data = [];
        });
        builder.addCase(getOtherModel.fulfilled, (state, action) => {
            state.other_models.loading = false;
            state.other_models.data = action.payload as OtherTypeRead;
        });
        builder.addCase(getOtherModel.rejected, (state, action) => {
            state.other_models.loading = false;
            state.other_models.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedOther, setLoadingModal } =
    adminOtherModel.actions;

export default adminOtherModel.reducer;

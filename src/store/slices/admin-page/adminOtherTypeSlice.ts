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
    other_types: {
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
    other_types: {
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

export const getOtherType = createAsyncThunk(
    "adminOtherType/getOtherType",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("equipments/type/other/?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminOtherType = createSlice({
    name: "adminOtherType",
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
        builder.addCase(getOtherType.pending, (state) => {
            state.other_types.loading = true;
            state.other_types.error = null;
            state.other_types.data = [];
        });
        builder.addCase(getOtherType.fulfilled, (state, action) => {
            state.other_types.loading = false;
            state.other_types.data = action.payload as OtherTypeRead;
        });
        builder.addCase(getOtherType.rejected, (state, action) => {
            state.other_types.loading = false;
            state.other_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedOther, setLoadingModal } =
    adminOtherType.actions;

export default adminOtherType.reducer;

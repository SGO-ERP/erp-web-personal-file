import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface CitizenshipTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    citizenship_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedCitizenship: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    citizenship_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedCitizenship: null,
    modalLoading: false,
};

export const getCitizenship = createAsyncThunk(
    "adminCitizenship/getCitizenship",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ApiService.get("personal/citizenship?skip=0&limit=10000");

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminCitizenship = createSlice({
    name: "adminCitizenship",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedCitizenship: (state, action) => {
            state.selectedCitizenship = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCitizenship.pending, (state) => {
            state.citizenship_types.loading = true;
            state.citizenship_types.error = null;
            state.citizenship_types.data = [];
        });
        builder.addCase(getCitizenship.fulfilled, (state, action) => {
            state.citizenship_types.loading = false;
            state.citizenship_types.data = action.payload as CitizenshipTypeRead;
        });
        builder.addCase(getCitizenship.rejected, (state, action) => {
            state.citizenship_types.loading = false;
            state.citizenship_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedCitizenship, setLoadingModal } =
    adminCitizenship.actions;

export default adminCitizenship.reducer;

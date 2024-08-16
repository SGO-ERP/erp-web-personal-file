import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

interface CityTypeRead {
    created_at: string;
    id: string;
    name: string | null;
    nameKZ: string | null;
    updated_at: string;
}

interface TableTypes {
    city_types: {
        data: any;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedCity: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    city_types: {
        data: [],
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedCity: null,
    modalLoading: false,
};

export const getCity = createAsyncThunk("adminCity/getCity", async (_, { rejectWithValue }) => {
    try {
        const response = await ApiService.get("personal/city?skip=0&limit=10000");

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const adminCity = createSlice({
    name: "adminCity",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedCity: (state, action) => {
            state.selectedCity = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCity.pending, (state) => {
            state.city_types.loading = true;
            state.city_types.error = null;
            state.city_types.data = [];
        });
        builder.addCase(getCity.fulfilled, (state, action) => {
            state.city_types.loading = false;
            state.city_types.data = action.payload as CityTypeRead;
        });
        builder.addCase(getCity.rejected, (state, action) => {
            state.city_types.loading = false;
            state.city_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedCity, setLoadingModal } = adminCity.actions;

export default adminCity.reducer;

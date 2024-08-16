import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface CountryTypeRead {
    total: number;
    objects: components["schemas"]["CountryRead"][];
}

interface TableTypes {
    country_types: {
        data: CountryTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedCountry: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    country_types: {
        data: {
            total: 0,
            objects: [],
        },
        loading: false,
        error: null,
    },
    tablePagination: {
        page: 1,
        size: 10,
    },
    selectedCountry: null,
    modalLoading: false,
};

export const getCountryTypes = createAsyncThunk(
    "adminCountries/getCountryTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/additional/country", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminCountries = createSlice({
    name: "adminCountries",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCountryTypes.pending, (state) => {
            state.country_types.loading = true;
            state.country_types.error = null;
            state.country_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getCountryTypes.fulfilled, (state, action) => {
            state.country_types.loading = false;
            state.country_types.data = action.payload as CountryTypeRead;
        });
        builder.addCase(getCountryTypes.rejected, (state, action) => {
            state.country_types.loading = false;
            state.country_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedCountry, setLoadingModal } =
    adminCountries.actions;

export default adminCountries.reducer;

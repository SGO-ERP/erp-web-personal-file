import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface PropertyTypeRead {
    total: number;
    objects: components["schemas"]["PropertyTypePaginationRead"][];
}

interface TableTypes {
    property_types: {
        data: PropertyTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedProperty: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    property_types: {
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
    selectedProperty: null,
    modalLoading: false,
};

export const getPropertyTypes = createAsyncThunk(
    "adminProperties/getPropertyTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/additional/property_types", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminProperties = createSlice({
    name: "adminProperties",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedProperty: (state, action) => {
            state.selectedProperty = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPropertyTypes.pending, (state) => {
            state.property_types.loading = true;
            state.property_types.error = null;
            state.property_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getPropertyTypes.fulfilled, (state, action) => {
            state.property_types.loading = false;
            state.property_types.data = action.payload as PropertyTypeRead;
        });
        builder.addCase(getPropertyTypes.rejected, (state, action) => {
            state.property_types.loading = false;
            state.property_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedProperty, setLoadingModal } =
    adminProperties.actions;

export default adminProperties.reducer;

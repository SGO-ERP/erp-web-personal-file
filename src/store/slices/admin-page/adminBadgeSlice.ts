import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface BadgeTypePaginationRead {
    total: number;
    objects: components["schemas"]["BadgeTypeRead"][];
}

interface TableTypes {
    badge_types: {
        data: BadgeTypePaginationRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedBadge: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    badge_types: {
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
    selectedBadge: null,
    modalLoading: false,
};

export const getBadgeTypes = createAsyncThunk(
    "adminBadge/getBadgeTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/badge_types", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminBadge = createSlice({
    name: "adminBadge",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedBadge: (state, action) => {
            state.selectedBadge = action.payload;
        },
        setModalBadge: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBadgeTypes.pending, (state) => {
            state.badge_types.loading = true;
            state.badge_types.error = null;
            state.badge_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getBadgeTypes.fulfilled, (state, action) => {
            state.badge_types.loading = false;
            state.badge_types.data = action.payload as BadgeTypePaginationRead;
        });
        builder.addCase(getBadgeTypes.rejected, (state, action) => {
            state.badge_types.loading = false;
            state.badge_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedBadge, setModalBadge } = adminBadge.actions;

export default adminBadge.reducer;

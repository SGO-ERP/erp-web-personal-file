import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface StatusTypeRead {
    total: number;
    objects: components["schemas"]["StatusRead"][];
}

interface TableTypes {
    status_types: {
        data: StatusTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedStatus: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    status_types: {
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
    selectedStatus: null,
    modalLoading: false,
};

export const getStatusTypes = createAsyncThunk(
    "adminStatuses/getStatusTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/status_types", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminStatuses = createSlice({
    name: "adminStatuses",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedStatus: (state, action) => {
            state.selectedStatus = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getStatusTypes.pending, (state) => {
            state.status_types.loading = true;
            state.status_types.error = null;
            state.status_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getStatusTypes.fulfilled, (state, action) => {
            state.status_types.loading = false;
            state.status_types.data = action.payload as StatusTypeRead;
        });
        builder.addCase(getStatusTypes.rejected, (state, action) => {
            state.status_types.loading = false;
            state.status_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedStatus, setLoadingModal } =
    adminStatuses.actions;

export default adminStatuses.reducer;

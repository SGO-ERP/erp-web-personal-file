import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface PositionTypeRead {
    total: number;
    objects: components["schemas"]["PositionRead"][];
}

interface TableTypes {
    position_types: {
        data: PositionTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedPosition: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    position_types: {
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
    selectedPosition: null,
    modalLoading: false,
};

export const getPositionTypes = createAsyncThunk(
    "adminPositions/getPositionTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/positions/all", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminPositions = createSlice({
    name: "adminPositions",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedPosition: (state, action) => {
            state.selectedPosition = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPositionTypes.pending, (state) => {
            state.position_types.loading = true;
            state.position_types.error = null;
            state.position_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getPositionTypes.fulfilled, (state, action) => {
            state.position_types.loading = false;
            state.position_types.data = action.payload as PositionTypeRead;
        });
        builder.addCase(getPositionTypes.rejected, (state, action) => {
            state.position_types.loading = false;
            state.position_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedPosition, setLoadingModal } =
    adminPositions.actions;

export default adminPositions.reducer;

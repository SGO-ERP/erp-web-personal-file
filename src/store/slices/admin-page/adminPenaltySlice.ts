import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface PenaltyTypeRead {
    total: number;
    objects: components["schemas"]["schemas__penalty__PenaltyRead"][];
}

interface TableTypes {
    penalty_types: {
        data: PenaltyTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedPenalty: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    penalty_types: {
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
    selectedPenalty: null,
    modalLoading: false,
};

export const getPenaltyTypes = createAsyncThunk(
    "adminPenalties/getPenaltyTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/penalty_types", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminPenalties = createSlice({
    name: "adminPenalties",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedPenalty: (state, action) => {
            state.selectedPenalty = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getPenaltyTypes.pending, (state) => {
            state.penalty_types.loading = true;
            state.penalty_types.error = null;
            state.penalty_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getPenaltyTypes.fulfilled, (state, action) => {
            state.penalty_types.loading = false;
            state.penalty_types.data = action.payload as PenaltyTypeRead;
        });
        builder.addCase(getPenaltyTypes.rejected, (state, action) => {
            state.penalty_types.loading = false;
            state.penalty_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedPenalty, setLoadingModal } =
    adminPenalties.actions;

export default adminPenalties.reducer;

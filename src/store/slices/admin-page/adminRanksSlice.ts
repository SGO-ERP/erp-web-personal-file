import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface RankTypeRead {
    total: number;
    objects: components["schemas"]["RankRead"][];
}

interface TableTypes {
    rank_types: {
        data: RankTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedRank: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    rank_types: {
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
    selectedRank: null,
    modalLoading: false,
};

export const getRanksTypes = createAsyncThunk(
    "adminRanks/getRanksTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/ranks", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminRanks = createSlice({
    name: "adminRanks",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedRank: (state, action) => {
            state.selectedRank = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRanksTypes.pending, (state) => {
            state.rank_types.loading = true;
            state.rank_types.error = null;
            state.rank_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getRanksTypes.fulfilled, (state, action) => {
            state.rank_types.loading = false;
            state.rank_types.data = action.payload as RankTypeRead;
        });
        builder.addCase(getRanksTypes.rejected, (state, action) => {
            state.rank_types.loading = false;
            state.rank_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedRank, setLoadingModal } = adminRanks.actions;

export default adminRanks.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface SportTypeRead {
    total: number;
    objects: components["schemas"]["SportTypeRead"][];
}

interface TableTypes {
    sport_types: {
        data: SportTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedSport: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    sport_types: {
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
    selectedSport: null,
    modalLoading: false,
};

export const getSportTypes = createAsyncThunk(
    "adminSport/getSportTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/personal/sport_type", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminSportTypes = createSlice({
    name: "adminSportTypes",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedSportTypes: (state, action) => {
            state.selectedSport = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSportTypes.pending, (state) => {
            state.sport_types.loading = true;
            state.sport_types.error = null;
            state.sport_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getSportTypes.fulfilled, (state, action) => {
            state.sport_types.loading = false;
            state.sport_types.data = action.payload as SportTypeRead;
        });
        builder.addCase(getSportTypes.rejected, (state, action) => {
            state.sport_types.loading = false;
            state.sport_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedSportTypes, setLoadingModal } = adminSportTypes.actions;

export default adminSportTypes.reducer;

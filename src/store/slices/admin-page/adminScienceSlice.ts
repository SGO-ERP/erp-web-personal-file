import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface ScienceTypeRead {
    total: number;
    objects: components["schemas"]["ScienceRead"][];
}

interface TableTypes {
    science_types: {
        data: ScienceTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedScience: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    science_types: {
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
    selectedScience: null,
    modalLoading: false,
};

export const getScienceTypes = createAsyncThunk(
    "adminSciences/getScienceTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/sciences", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminSciences = createSlice({
    name: "adminSciences",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedScience: (state, action) => {
            state.selectedScience = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getScienceTypes.pending, (state) => {
            state.science_types.loading = true;
            state.science_types.error = null;
            state.science_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getScienceTypes.fulfilled, (state, action) => {
            state.science_types.loading = false;
            state.science_types.data = action.payload as ScienceTypeRead;
        });
        builder.addCase(getScienceTypes.rejected, (state, action) => {
            state.science_types.loading = false;
            state.science_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedScience, setLoadingModal } =
    adminSciences.actions;

export default adminSciences.reducer;

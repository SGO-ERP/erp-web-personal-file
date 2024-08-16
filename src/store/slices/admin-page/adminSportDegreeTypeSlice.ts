import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";
import {components} from "../../../API/types";

interface SportDegreeTypeRead {
    total: number;
    objects: components["schemas"]["SportDegreeTypeRead"][];
}


interface TableTypes {
    sport_degree_type: {
        data: SportDegreeTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedSportDegreeType: {
        name: string;
        nameKZ: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    sport_degree_type: {
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
    selectedSportDegreeType: null,
    modalLoading: false,
};

export const getSportDegreeType = createAsyncThunk("adminSportDegree/getSportDegree", async (_, { rejectWithValue }) => {
    try {
        const response = await ApiService.get("personal/sport_degree_type?skip=0&limit=10000");

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const adminSportDegreeTypeSlice = createSlice({
    name: "adminSportDegreeTypeSlice",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedSportDegreeTypeSlice: (state, action) => {
            state.selectedSportDegreeType = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSportDegreeType.pending, (state) => {
            state.sport_degree_type.loading = true;
            state.sport_degree_type.error = null;
            state.sport_degree_type.data = { total: 0, objects: [] };
        });
        builder.addCase(getSportDegreeType.fulfilled, (state, action) => {
            state.sport_degree_type.loading = false;
            state.sport_degree_type.data = action.payload as SportDegreeTypeRead;
        });
        builder.addCase(getSportDegreeType.rejected, (state, action) => {
            state.sport_degree_type.loading = false;
            state.sport_degree_type.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedSportDegreeTypeSlice, setLoadingModal } =
    adminSportDegreeTypeSlice.actions;

export default adminSportDegreeTypeSlice.reducer;


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface AcademicTitleTypeRead {
    total: number;
    objects: components["schemas"]["AcademicTitleRead"][];
}

interface TableTypes {
    academic_title_types: {
        data: AcademicTitleTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedAcademicTitle: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    academic_title_types: {
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
    selectedAcademicTitle: null,
    modalLoading: false,
};

export const getAcademicTitleTypes = createAsyncThunk(
    "adminAcademicTitles/getAcademicTitleTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/academic_title_degrees", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminAcademicTitles = createSlice({
    name: "adminAcademicTitles",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedAcademicTitle: (state, action) => {
            state.selectedAcademicTitle = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAcademicTitleTypes.pending, (state) => {
            state.academic_title_types.loading = true;
            state.academic_title_types.error = null;
            state.academic_title_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getAcademicTitleTypes.fulfilled, (state, action) => {
            state.academic_title_types.loading = false;
            state.academic_title_types.data = action.payload as AcademicTitleTypeRead;
        });
        builder.addCase(getAcademicTitleTypes.rejected, (state, action) => {
            state.academic_title_types.loading = false;
            state.academic_title_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedAcademicTitle, setLoadingModal } =
    adminAcademicTitles.actions;

export default adminAcademicTitles.reducer;

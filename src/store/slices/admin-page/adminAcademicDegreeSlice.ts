import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface AcademicDegreeTypeRead {
    total: number;
    objects: components["schemas"]["AcademicDegreeRead"][];
}

interface TableTypes {
    academic_degree_types: {
        data: AcademicDegreeTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedAcademicDegree: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    academic_degree_types: {
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
    selectedAcademicDegree: null,
    modalLoading: false,
};

export const getAcademicDegreeTypes = createAsyncThunk(
    "adminAcademicDegrees/getAcademicDegreeTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get(
                "/api/v1/education/academic_degree_degrees",
                {
                    params: { query: { skip: 0, limit: 10000 } },
                },
            );

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminAcademicDegrees = createSlice({
    name: "adminAcademicDegrees",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedAcademicDegree: (state, action) => {
            state.selectedAcademicDegree = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAcademicDegreeTypes.pending, (state) => {
            state.academic_degree_types.loading = true;
            state.academic_degree_types.error = null;
            state.academic_degree_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getAcademicDegreeTypes.fulfilled, (state, action) => {
            state.academic_degree_types.loading = false;
            state.academic_degree_types.data = action.payload as AcademicDegreeTypeRead;
        });
        builder.addCase(getAcademicDegreeTypes.rejected, (state, action) => {
            state.academic_degree_types.loading = false;
            state.academic_degree_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedAcademicDegree, setLoadingModal } =
    adminAcademicDegrees.actions;

export default adminAcademicDegrees.reducer;

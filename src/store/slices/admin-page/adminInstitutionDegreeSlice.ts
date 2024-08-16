import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface InstitutionDegreeTypeRead {
    total: number;
    objects: components["schemas"]["CourseRead"][];
}

interface TableTypes {
    institution_degree_types: {
        data: InstitutionDegreeTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedInstitutionDegree: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    institution_degree_types: {
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
    selectedInstitutionDegree: null,
    modalLoading: false,
};

export const getInstitutionDegreeTypes = createAsyncThunk(
    "adminInstitutionDegrees/getInstitutionDegreeTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get(
                "/api/v1/education/institution_degree_types",
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

export const adminInstitutionDegrees = createSlice({
    name: "adminInstitutionDegrees",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedInstitutionDegree: (state, action) => {
            state.selectedInstitutionDegree = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInstitutionDegreeTypes.pending, (state) => {
            state.institution_degree_types.loading = true;
            state.institution_degree_types.error = null;
            state.institution_degree_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getInstitutionDegreeTypes.fulfilled, (state, action) => {
            state.institution_degree_types.loading = false;
            state.institution_degree_types.data = action.payload as InstitutionDegreeTypeRead;
        });
        builder.addCase(getInstitutionDegreeTypes.rejected, (state, action) => {
            state.institution_degree_types.loading = false;
            state.institution_degree_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedInstitutionDegree, setLoadingModal } =
    adminInstitutionDegrees.actions;

export default adminInstitutionDegrees.reducer;

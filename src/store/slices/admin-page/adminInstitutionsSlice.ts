import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface InstitutionTypeRead {
    total: number;
    objects: components["schemas"]["CourseRead"][];
}

interface TableTypes {
    institution_types: {
        data: InstitutionTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedInstitution: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    institution_types: {
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
    selectedInstitution: null,
    modalLoading: false,
};

export const getInstitutionTypes = createAsyncThunk(
    "adminInstitutions/getInstitutionTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/institutions", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminInstitutions = createSlice({
    name: "adminInstitutions",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedInstitution: (state, action) => {
            state.selectedInstitution = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getInstitutionTypes.pending, (state) => {
            state.institution_types.loading = true;
            state.institution_types.error = null;
            state.institution_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getInstitutionTypes.fulfilled, (state, action) => {
            state.institution_types.loading = false;
            state.institution_types.data = action.payload as InstitutionTypeRead;
        });
        builder.addCase(getInstitutionTypes.rejected, (state, action) => {
            state.institution_types.loading = false;
            state.institution_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedInstitution, setLoadingModal } =
    adminInstitutions.actions;

export default adminInstitutions.reducer;

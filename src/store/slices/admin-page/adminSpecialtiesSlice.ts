import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface SpecialtyTypeRead {
    total: number;
    objects: components["schemas"]["SpecialtyRead"][];
}

interface TableTypes {
    specialty_types: {
        data: SpecialtyTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedSpecialty: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    specialty_types: {
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
    selectedSpecialty: null,
    modalLoading: false,
};

export const getSpecialtiesTypes = createAsyncThunk(
    "adminSpecialties/getSpecialtiesTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/specialties", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminSpecialties = createSlice({
    name: "adminSpecialties",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedSpecialty: (state, action) => {
            state.selectedSpecialty = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getSpecialtiesTypes.pending, (state) => {
            state.specialty_types.loading = true;
            state.specialty_types.error = null;
            state.specialty_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getSpecialtiesTypes.fulfilled, (state, action) => {
            state.specialty_types.loading = false;
            state.specialty_types.data = action.payload as SpecialtyTypeRead;
        });
        builder.addCase(getSpecialtiesTypes.rejected, (state, action) => {
            state.specialty_types.loading = false;
            state.specialty_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedSpecialty, setLoadingModal } =
    adminSpecialties.actions;

export default adminSpecialties.reducer;

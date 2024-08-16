import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";
import {components} from "../../../API/types";

interface MilitaryInstitutionTypeRead {
    total: number;
    objects: components["schemas"]["MilitaryUnitRead"][];
}



interface TableTypes {
    military_institution_types: {
        data: MilitaryInstitutionTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedMilitaryInstitution: {
        name: string;
        nameKZ: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    military_institution_types: {
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
    selectedMilitaryInstitution: null,
    modalLoading: false,
};

export const getMilitaryInstitution = createAsyncThunk("adminMilitaryInstitution/getMilitaryInstitution", async (_, { rejectWithValue }) => {
    try {
        const response = await ApiService.get("education/military_institution?skip=0&limit=10000");

        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data);
    }
});

export const adminMilitaryInstitutionSlice = createSlice({
    name: "adminMilitaryInstitution",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedMilitaryInstitution: (state, action) => {
            state.selectedMilitaryInstitution = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMilitaryInstitution.pending, (state) => {
            state.military_institution_types.loading = true;
            state.military_institution_types.error = null;
            state.military_institution_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getMilitaryInstitution.fulfilled, (state, action) => {
            state.military_institution_types.loading = false;
            state.military_institution_types.data = action.payload as MilitaryInstitutionTypeRead;
        });
        builder.addCase(getMilitaryInstitution.rejected, (state, action) => {
            state.military_institution_types.loading = false;
            state.military_institution_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedMilitaryInstitution, setLoadingModal } =
    adminMilitaryInstitutionSlice.actions;

export default adminMilitaryInstitutionSlice.reducer;


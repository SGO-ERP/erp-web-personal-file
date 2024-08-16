import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PrivateServices } from "API";
import { components } from "API/types";

interface LanguageTypeRead {
    total: number;
    objects: components["schemas"]["LanguageRead"][];
}

interface TableTypes {
    language_types: {
        data: LanguageTypeRead;
        loading: boolean;
        error: any;
    };
    tablePagination: {
        page: number;
        size: number;
    };
    selectedLanguage: {
        name: string;
        nameKZ: string;
        url: string | null;
        badge_order: string;
    } | null;
    modalLoading: boolean;
}

const initialState: TableTypes = {
    language_types: {
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
    selectedLanguage: null,
    modalLoading: false,
};

export const getLanguageTypes = createAsyncThunk(
    "adminLanguages/getLanguageTypes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await PrivateServices.get("/api/v1/education/languages", {
                params: { query: { skip: 0, limit: 10000 } },
            });

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data);
        }
    },
);

export const adminLanguages = createSlice({
    name: "adminLanguages",
    initialState,
    reducers: {
        setTableSize: (state, action) => {
            state.tablePagination.size = action.payload;
        },
        setTablePage: (state, action) => {
            state.tablePagination.page = action.payload;
        },
        setSelectedLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
        },
        setLoadingModal: (state, action) => {
            state.modalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLanguageTypes.pending, (state) => {
            state.language_types.loading = true;
            state.language_types.error = null;
            state.language_types.data = { total: 0, objects: [] };
        });
        builder.addCase(getLanguageTypes.fulfilled, (state, action) => {
            state.language_types.loading = false;
            state.language_types.data = action.payload as LanguageTypeRead;
        });
        builder.addCase(getLanguageTypes.rejected, (state, action) => {
            state.language_types.loading = false;
            state.language_types.error = action.payload;
        });
    },
});

export const { setTableSize, setTablePage, setSelectedLanguage, setLoadingModal } =
    adminLanguages.actions;

export default adminLanguages.reducer;

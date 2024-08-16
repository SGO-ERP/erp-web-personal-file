import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "auth/FetchInterceptor";

let initialState = {
    tableLoading: true,
    error: null,

    search: "",

    page: 1,
    size: 5,
    total: 0,
    defaultPageSize: 5,

    tableValue: [],
};

export const getTableData = createAsyncThunk(
    "constructor/getTableData",
    async (params, _, thunkAPI) => {
        const { search, size, skip } = params;

        try {
            const response = await ApiService.get(
                `/hr-documents-template?skip=${skip}&limit=${size}&name=${search}`,
            );

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    },
);

export const activeTable = createSlice({
    name: "activeTable",
    initialState,
    reducers: {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setSize: (state, action) => {
            state.size = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTableData.pending, (state) => {
                state.tableLoading = true;
            })
            .addCase(getTableData.fulfilled, (state, action) => {
                const { objects, total } = action.payload;

                state.tableLoading = false;
                state.error = "";
                state.tableValue = objects;
                state.total = total;
            })
            .addCase(getTableData.rejected, (state, action) => {
                state.tableLoading = false;
                state.tableValue = [];
                state.error = action.payload;
            });
    },
});

export const { setPage, setSize } = activeTable.actions;

export default activeTable.reducer;

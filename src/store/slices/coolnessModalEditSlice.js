import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CoolnessService from "services/myInfo/CoolnessService";

const initialState = {
    coolnessStatuses: null,
    coolnessForms: null,
    isLoading: false,
    error: null,
};

export const fetchCoolnessStatuses = createAsyncThunk(
    "fetchCoolnessStatuses",
    async (_, { rejectWithValue }) => {
        try {
            const response = await CoolnessService.get_statuses();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

export const fetchCoolnessForms = createAsyncThunk(
    "fetchCoolnessForms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await CoolnessService.get_coolness_form();
            return response;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    },
);

const coolnessModalEditSlice = createSlice({
    name: "coolnessModalEdit",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoolnessStatuses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCoolnessStatuses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coolnessStatuses = action.payload;
            })
            .addCase(fetchCoolnessStatuses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(fetchCoolnessForms.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCoolnessForms.fulfilled, (state, action) => {
                state.isLoading = false;
                state.coolnessForms = action.payload.objects;
            })
            .addCase(fetchCoolnessForms.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default coolnessModalEditSlice.reducer;

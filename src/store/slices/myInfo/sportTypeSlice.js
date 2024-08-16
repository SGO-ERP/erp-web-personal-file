import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SportTypeService from "../../../services/myInfo/SportTypeService";

let initialState = {
    sportTypes: [],
    sportDegrees: [],
    sportDegreesOptions: [],
    sportTypesOptions: [],
    isLoading: false,
    error: "",
};

export const getSportTypes = createAsyncThunk("myInfo/getSportTypes", async (_, thunkAPI) => {
    try {
        return await SportTypeService.get_document_staff_type();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const getSportDegree = createAsyncThunk("myInfo/getSportDegree", async (_, thunkAPI) => {
    try {
        return await SportTypeService.get_sport_degree_type();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

export const sportTypeSlice = createSlice({
    name: "sportType",
    initialState,
    reducers: {
        addSportDegree: (state, action) => {
            state.sportDegrees = [...state.sportDegrees, action.payload];
        },
        addSportTypes: (state, action) => {
            state.sportTypes = [...state.sportTypes, action.payload];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSportTypes.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSportTypes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.sportTypes = action.payload.objects;
            })
            .addCase(getSportTypes.rejected, (state, action) => {
                state.isLoading = false;
                state.sportTypes = [];
                state.error = action.payload;
            })
            .addCase(getSportDegree.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSportDegree.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.sportDegrees = action.payload.objects;
            })
            .addCase(getSportDegree.rejected, (state, action) => {
                state.isLoading = false;
                state.sportDegrees = [];
                state.error = action.payload;
            });
    },
});

export const { addSportDegree, addSportTypes } = sportTypeSlice.actions;

export default sportTypeSlice.reducer;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import BadgesService from 'services/BadgesService';

const initialState = {
    isLoading: false,
    error: null,
    stateAwards: [],
    otherAwards: [],
    defaultAwards: [],
};

export const getAwards = createAsyncThunk('getAwards', async (_, { rejectWithValue }) => {
    try {
        const response = await BadgesService.get_badge_types();
        return response.objects;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const servicesAwardsSlice = createSlice({
    name: 'servicesAwards',
    initialState,
    reducers: {
        setAwardsList: (state, action) => {
            state[action.payload.type] = [...state[action.payload.type], action.payload.object];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAwards.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAwards.fulfilled, (state, action) => {
                state.isLoading = false;

                action.payload.forEach((item) => {
                    switch (item.badge_order) {
                        case 0:
                            state.otherAwards = [...state.otherAwards, item];
                            break;
                        case 1:
                            state.defaultAwards = [...state.defaultAwards, item];
                            break;
                        case 2:
                            state.stateAwards = [...state.stateAwards, item];
                            break;
                        default:
                            state.otherAwards = [...state.otherAwards, item];
                            break;
                    }
                });
            })
            .addCase(getAwards.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { setAwardsList } = servicesAwardsSlice.actions;

export default servicesAwardsSlice.reducer;

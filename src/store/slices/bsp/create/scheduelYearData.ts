import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from '../../../../API/types';

interface DataType {
    data: components['schemas']['ScheduleYearRead'][];
    loading: boolean;
    error: any;
}
const initialState: DataType = {
    data: [],
    loading: false,
    error: null,
};
export const scheduelYearData = createSlice({
    name: 'scheduelYearData',
    initialState,
    reducers: {
        changeScheduelYearData: (
            state,
            action: PayloadAction<components['schemas']['ScheduleYearRead'][]>,
        ) => {
            state.data = action.payload;
        },
    },
});

export const { changeScheduelYearData } = scheduelYearData.actions;

export default scheduelYearData.reducer;

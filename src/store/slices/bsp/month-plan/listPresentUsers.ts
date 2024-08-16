import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    data: components['schemas']['AttendanceChangeStatusWithSchedule'][];
    customization_data: components['schemas']['ScheduleMonthCreateWithDay'];
}

const initialState: State = {
    data: [],
    customization_data: {
        start_date: '',
        end_date: '',
        place_id: '',
        schedule_id: '',
        days: [],
        instructor_ids: [],
    },
};

export const listPresentUsers = createSlice({
    name: 'listPresentUsers',
    initialState,
    reducers: {
        addData: (
            state,
            action: PayloadAction<components['schemas']['AttendanceChangeStatusWithSchedule']>,
        ) => {
            state.data = [...state.data, action.payload];
        },
        removeData: (state, action: PayloadAction<{ id: string }>) => {
            state.data = state.data.filter((element) => element.user_id !== action.payload.id);
        },
        clearData: (state) => {
            state.data = [];
        },
        addCustomzationData: (
            state,
            action: PayloadAction<components['schemas']['ScheduleMonthCreateWithDay']>,
        ) => {
            state.customization_data = action.payload;
        },
        clearCustomzationData: (state) => {
            state.data = [];
        },
    },
});
export const { addData, removeData, clearData, clearCustomzationData, addCustomzationData } =
    listPresentUsers.actions;

export default listPresentUsers.reducer;

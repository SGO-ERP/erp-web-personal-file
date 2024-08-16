import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';
import { SCHEDULE_YEAR } from '../../../../constants/AuthConstant';

interface State {
    local: components['schemas']['ScheduleYearRead'][];
    remote: (components['schemas']['ScheduleYearCreateString'] & { id: string })[];
    remove: { id: string; division_id: string }[];
}

const initialState: State = {
    local: [],
    remote: [],
    remove: [],
};

export const scheduleYear = createSlice({
    name: 'ScheduleYear',
    initialState,
    reducers: {
        restoreSlice: (state) => {
            const storedValue = localStorage.getItem(SCHEDULE_YEAR);
            return storedValue ? JSON.parse(storedValue) : state;
        },
        addLocalScheduleYear: (
            state,
            action: PayloadAction<components['schemas']['ScheduleYearRead']>,
        ) => {
            state.local = [...state.local, action.payload];
        },
        removeLocalScheduleYear: (state, action: PayloadAction<{ id: string }>) => {
            state.local = state.local.filter((element) => element.id !== action.payload.id);
        },
        removeRemoteScheduleYear: (
            state,
            action: PayloadAction<{ id: string; division_id: string }>,
        ) => {
            state.remove = [...state.remove, action.payload];
            state.remote = state.remote.filter((element) => element.id !== action.payload.id);
        },
        clearLocalScheduleYear: (state) => {
            state.local = [];
        },
        clearRemoteScheduleYear: (state) => {
            state.remote = [];
            state.remove = [];
        },
    },
});

export const {
    restoreSlice,
    addLocalScheduleYear,
    removeLocalScheduleYear,
    removeRemoteScheduleYear,
    clearLocalScheduleYear,
    clearRemoteScheduleYear,
} = scheduleYear.actions;

export default scheduleYear.reducer;

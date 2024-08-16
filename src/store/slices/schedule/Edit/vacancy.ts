import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    local: (components['schemas']['HrVacancyCreate'] & { id: string; isStaffUnitLocal: boolean })[];
    remote: (components['schemas']['HrVacancyUpdate'] & {
        id: string;
        archive_staff_unit_id?: string;
        archive_staff_unit?: components['schemas']['schemas__staff_unit__StaffUnitRead'];
    })[];
    remove: { id: string }[];
}

const initialState: State = {
    local: [],
    remote: [],
    remove: [],
};

export const LOCAL_vacancy = createSlice({
    name: 'Vacancy',
    initialState,
    reducers: {
        addLocalVacancy: (
            state,
            action: PayloadAction<
                components['schemas']['HrVacancyCreate'] & {
                    isLocal: boolean;
                    id: string;
                    isStaffUnitLocal: boolean;
                }
            >,
        ) => {
            state.local = [...state.local, action.payload];
        },
        editLocalVacancy: (
            state,
            action: PayloadAction<
                components['schemas']['HrVacancyCreate'] & {
                    isLocal: boolean;
                    id: string;
                    isStaffUnitLocal: boolean;
                }
            >,
        ) => {
            state.local = state.local.map((element) => {
                if (element.id === action.payload.id) {
                    return { ...element, ...action.payload };
                }
                return element;
            });
        },
        removeLocalVacancy: (state, action: PayloadAction<{ id: string }>) => {
            state.local = state.local.filter((element) => element.id !== action.payload.id);
        },
        clearLocalVacancies: (state) => {
            state.local = [];
        },
        addRemoteVacancy: (
            state,
            action: PayloadAction<
                components['schemas']['HrVacancyCreate'] & {
                    id: string;
                    archive_staff_unit_id?: string;
                    archive_staff_unit?: components['schemas']['schemas__staff_unit__StaffUnitRead'];
                }
            >,
        ) => {
            state.remote = [...state.remote, action.payload];
        },
        editRemoteVacancy: (
            state,
            action: PayloadAction<
                components['schemas']['HrVacancyUpdate'] & {
                    id: string;
                    archive_staff_unit_id?: string;
                    archive_staff_unit?: components['schemas']['schemas__staff_unit__StaffUnitRead'];
                }
            >,
        ) => {
            state.remote = state.remote.map((element) => {
                if (element.id === action.payload.id) {
                    return { ...element, ...action.payload };
                }
                return element;
            });
        },
        removeRemoteVacancy: (state, action: PayloadAction<{ id: string }>) => {
            state.remove = [...state.remove, action.payload];
            state.remote = state.remote.filter((element) => element.id !== action.payload.id);
        },
        clearVacancyRemoved: (state) => {
            state.remove = [];
        },
        clearRemoteVacancies: (state) => {
            state.remote = [];
            state.remove = [];
        },
    },
});

export const {
    addLocalVacancy,
    editLocalVacancy,
    removeLocalVacancy,
    clearLocalVacancies,
    addRemoteVacancy,
    editRemoteVacancy,
    removeRemoteVacancy,
    clearVacancyRemoved,
    clearRemoteVacancies,
} = LOCAL_vacancy.actions;

export default LOCAL_vacancy.reducer;

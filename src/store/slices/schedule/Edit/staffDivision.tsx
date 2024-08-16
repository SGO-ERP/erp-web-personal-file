import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    local: (components['schemas']['NewArchiveStaffDivisionCreate'] & {
        isLocal: boolean;
        id: string;
    })[];
    remote: (components['schemas']['NewArchiveStaffDivisionUpdate'] & { id: string })[];
    remove: { id: string }[];
}

const initialState: State = {
    local: [],
    remote: [],
    remove: [],
};

export const archiveStaffDivision = createSlice({
    name: 'ArchiveStaffDivision',
    initialState,
    reducers: {
        addLocalStaffDivision: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffDivisionCreate'] & {
                    isLocal: boolean;
                    id: string;
                }
            >,
        ) => {
            state.local = [...state.local, action.payload];
        },
        editLocalStaffDivision: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffDivisionCreate'] & {
                    isLocal: boolean;
                    id: string;
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
        removeLocalStaffDivision: (state, action: PayloadAction<{ id: string }>) => {
            state.local = state.local.filter((element) => element.id !== action.payload.id);
        },
        clearLocalStaffDivision: (state) => {
            state.local = [];
        },
        addRemoteStaffDivision: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffDivisionUpdate'] & {
                    id: string;
                }
            >,
        ) => {
            state.remote = [...state.remote, action.payload];
        },
        editRemoteStaffDivision: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffDivisionUpdate'] & { id: string }
            >,
        ) => {
            state.remote = state.remote.map((element) => {
                if (element.id === action.payload.id) {
                    return { ...element, ...action.payload };
                }
                return element;
            });
        },
        removeRemoteStaffDivision: (state, action: PayloadAction<{ id: string }>) => {
            state.remove = [...state.remove, action.payload];
            state.remote = state.remote.filter((element) => element.id !== action.payload.id);
        },
        clearStaffDivisionRemoved: (state) => {
            state.remove = [];
        },
        clearRemoteStaffDivision: (state) => {
            state.remote = [];
            state.remove = [];
        },
    },
});

export const {
    addLocalStaffDivision,
    editLocalStaffDivision,
    removeLocalStaffDivision,
    clearLocalStaffDivision,
    addRemoteStaffDivision,
    editRemoteStaffDivision,
    removeRemoteStaffDivision,
    clearStaffDivisionRemoved,
    clearRemoteStaffDivision,
} = archiveStaffDivision.actions;

export default archiveStaffDivision.reducer;

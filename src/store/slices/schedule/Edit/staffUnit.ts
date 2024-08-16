import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    local: (components['schemas']['NewArchiveStaffUnitCreate'] & {
        isLocal: boolean;
        id: string;
        staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
    } & {
        position?: components['schemas']['PositionRead'];
    })[];
    remote: (components['schemas']['ArchiveStaffUnitRead'] & { id: string } & {
        position?: components['schemas']['PositionRead'];
    } & {
        staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
    })[];
    remove: { id: string }[];
}

const initialState: State = {
    local: [],
    remote: [],
    remove: [],
};

export const archiveStaffUnit = createSlice({
    name: 'ArchiveStaffUnit',
    initialState,
    reducers: {
        // LOCAL
        addLocalStaffUnit: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffUnitCreate'] & {
                    isLocal: boolean;
                    id: string;
                    staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
                } & {
                    position?: components['schemas']['PositionRead'];
                }
            >,
        ) => {
            state.local = [...state.local, action.payload];
        },
        editLocalStaffUnit: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffUnitUpdate'] & {
                    isLocal: boolean;
                    id: string;
                    staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
                } & {
                    position?: components['schemas']['PositionRead'];
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
        removeLocalStaffUnit: (state, action: PayloadAction<{ id: string }>) => {
            state.local = state.local.filter((element) => element.id !== action.payload.id);
        },

        clearLocalStaffUnit: (state) => {
            state.local = [];
        },

        // REMOTE
        addRemoteStaffUnit: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffUnitUpdate'] & {
                    id: string;
                } & {
                    position?: components['schemas']['PositionRead'];
                    staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
                }
            >,
        ) => {
            state.remote = [...state.remote, action.payload];
        },
        editRemoteStaffUnit: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveStaffUnitUpdate'] & { id: string } & {
                    position?: components['schemas']['PositionRead'];
                    staff_functions?: components['schemas']['ArchiveStaffFunctionRead'][];
                }
            >,
        ) => {
            state.remote = state.remote.map((element) => {
                if (element.id === action.payload.id) {
                    return action.payload;
                }
                return element;
            });
        },

        removeRemoteStaffUnit: (state, action: PayloadAction<{ id: string }>) => {
            state.remove = [...state.remove, action.payload];
            state.remote = state.remote.filter((element) => element.id !== action.payload.id);
        },
        clearStaffUnitRemoved: (state) => {
            state.remove = [];
        },
        clearRemoteStaffUnit: (state) => {
            state.remote = [];
            state.remove = [];
        },
    },
});

export const {
    addLocalStaffUnit,
    editLocalStaffUnit,
    removeLocalStaffUnit,
    clearLocalStaffUnit,
    addRemoteStaffUnit,
    editRemoteStaffUnit,
    removeRemoteStaffUnit,
    clearStaffUnitRemoved,
    clearRemoteStaffUnit,
} = archiveStaffUnit.actions;

export default archiveStaffUnit.reducer;

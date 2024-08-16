import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    local: (components['schemas']['NewArchiveServiceStaffFunctionCreate'] & {
        isLocal: boolean;
        id: string;
        staff_unit_id: string;
        isParentLocal: boolean;
    })[];
    remote: (components['schemas']['NewArchiveServiceStaffFunctionUpdate'] & {
        id: string;
        staff_unit_id?: string;
    })[];
    remove: {
        staff_unit_id: string;
        id: string;
    }[];
}

const initialState: State = {
    local: [],
    remote: [],
    remove: [],
};

export const archiveStaffFunction = createSlice({
    name: 'ArchiveStaffFunction',
    initialState,
    reducers: {
        addLocalStaffFunction: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveServiceStaffFunctionCreate'] & {
                    isLocal: boolean;
                    id: string;
                    staff_unit_id: string;
                    isParentLocal: boolean;
                }
            >,
        ) => {
            state.local = [...state.local, action.payload];
        },
        editLocalStaffFunction: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveServiceStaffFunctionCreate'] & {
                    isLocal: boolean;
                    id: string;
                    staff_unit_id: string;
                    isParentLocal: boolean;
                }
            >,
        ) => {
            state.local = state.local.map((element) => {
                if (element.id === action.payload.id) {
                    return { ...action.payload };
                }
                return element;
            });
        },
        removeLocalStaffFunction: (state, action: PayloadAction<{ id: string }>) => {
            state.local = state.local.filter((element) => element.id !== action.payload.id);
        },
        clearLocalStaffFunction: (state) => {
            state.local = [];
        },
        addRemoteStaffFunction: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveServiceStaffFunctionUpdate'] & {
                    id: string;
                }
            >,
        ) => {
            state.remote = [...state.remote, action.payload];
        },
        editRemoteStaffFunction: (
            state,
            action: PayloadAction<
                components['schemas']['NewArchiveServiceStaffFunctionUpdate'] & {
                    id: string;
                    staff_unit_id: string;
                }
            >,
        ) => {
            state.remote = state.remote.map((element) => {
                if (element.id === action.payload.id) {
                    return { ...action.payload };
                }
                return element;
            });
        },
        removeRemoteStaffFunction: (
            state,
            action: PayloadAction<{
                staff_unit_id: string;
                id: string;
            }>,
        ) => {
            state.remote = state.remote.filter((element) => element.id !== action.payload.id);
            state.remove = [...state.remove, action.payload];
        },
        clearRemoteStaffFunction: (state) => {
            state.remote = [];
            state.remove = [];
        },
    },
});

export const {
    addLocalStaffFunction,
    editLocalStaffFunction,
    removeLocalStaffFunction,
    clearLocalStaffFunction,
    addRemoteStaffFunction,
    editRemoteStaffFunction,
    removeRemoteStaffFunction,
    clearRemoteStaffFunction,
} = archiveStaffFunction.actions;

export default archiveStaffFunction.reducer;

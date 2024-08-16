import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { components } from 'API/types';

interface State {
    remote: components['schemas']['ArchiveStaffUnitRead'][];
}

const initialState: State = {
    remote: [],
};

export const disposalSlice = createSlice({
    name: 'disposalSlice',
    initialState,
    reducers: {
        addRemoteDisposal: (
            state,
            action: PayloadAction<components['schemas']['ArchiveStaffUnitRead']>,
        ) => {
            if (state.remote) state.remote = [...state.remote, action.payload];
        },
        clearRemoteDisposal: (state) => {
            state.remote = [];
        },
    },
});

export const { addRemoteDisposal, clearRemoteDisposal } = disposalSlice.actions;

export default disposalSlice.reducer;

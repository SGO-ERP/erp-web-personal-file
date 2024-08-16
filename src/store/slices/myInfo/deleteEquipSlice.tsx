import { PayloadAction, createSlice } from '@reduxjs/toolkit';
interface State {
    remove: { id: string; }[];
}

const initialState: State = {
    remove: [],
};


export const equip = createSlice({
    name: 'equip',
    initialState,
    reducers: {
        removeEquip: (
            state,
            action: PayloadAction<{ id: string }>,
        ) => {
            state.remove = [...state.remove, action.payload];
        },
        clearEquip: (state) => {
            state.remove = [];
        },
    },
});

export const {
    removeEquip,
    clearEquip
} = equip.actions;

export default equip.reducer;

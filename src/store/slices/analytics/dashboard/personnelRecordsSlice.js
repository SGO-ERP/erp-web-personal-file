import { createSlice } from '@reduxjs/toolkit';
import { PrivateServices } from '../../../../API';

const secondRowSlice = createSlice({
    name: 'secondRow',
    initialState: {
        count: 0,
        countStatebylist: 0,
        inline: 0,
    },
    reducers: {
        setCount: (state, action) => {
            state.count = action.payload;
        },
        setCountStatebylist: (state, action) => {
            state.countStatebylist = action.payload;
        },
        setInline: (state, action) => {
            state.inline = action.payload;
        },
    },
});

export const { setCount, setCountStatebylist, setInline } = secondRowSlice.actions;

export const fetchSecondRowData = () => async (dispatch) => {
    try {
        const response1 = await PrivateServices.get('/api/v1/dashboard/states/all');
        dispatch(setCount(response1.data));

        const response2 = await PrivateServices.get('/api/v1/dashboard/states/by_list/');
        dispatch(setCountStatebylist(response2.data));

        const response3 = await PrivateServices.get('/api/v1/dashboard/states/inline/');
        dispatch(setInline(response3.data));
    } catch (error) {
        console.error(error);
    }
};

export default secondRowSlice.reducer;

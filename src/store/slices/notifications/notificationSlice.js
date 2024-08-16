import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import NotificationService from "services/NotificationService";

export const initialState = {
    isLoading: false,
    error: null,

    isNotificationModal: false,
    infoNotifications: {},
    infoTablePagination: { skip: 0, limit: 10 },

    orderNotifications: {},
    orderTablePagination: { skip: 0, limit: 10 },

    ordersTotal: 0,

    orderId: null,
};

export const fetchInfoNotifications = createAsyncThunk(
    "notification/fetchInfoNotifications",
    async (pagination, { dispatch, thunkAPI }) => {
        const response = await NotificationService.get_notifications_info(pagination);
        return response;
    },
);

export const fetchOrdersNotifications = createAsyncThunk(
    "notification/fetchOrdersNotifications",
    async (pagination, { dispatch, thunkAPI }) => {
        const response = await NotificationService.get_notifications_details(pagination);
        return response;
    },
);

export const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        setNotificationModal: (state, action) => {
            state.isNotificationModal = action.payload;
        },
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInfoNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchInfoNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.infoNotifications = action.payload;
            })
            .addCase(fetchInfoNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.infoNotifications = {};
            })
            .addCase(fetchOrdersNotifications.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchOrdersNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.orderNotifications = action.payload;
                state.ordersTotal = action.payload.total;
            })
            .addCase(fetchOrdersNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.orderNotifications = {};
            });
    },
});

export const { setNotificationModal, setOrderId } = notificationSlice.actions;

export default notificationSlice.reducer;

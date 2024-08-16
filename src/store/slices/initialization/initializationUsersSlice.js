import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from "services/UserService";

let initialState = {
    loading: false,
    error: null,
    skip: 0,
    limit: 10_000,
    usersMax: 0,
    usersList: [],
    lastFetchedUsers: [],
    selectUserInitials: "",
    selectedUser: {},
    wrongUser: false,
};

export const fetchUsers = createAsyncThunk(
    "initializationUsers/fetchUsers",
    async ({ id, text }, { getState }) => {
        const { skip, limit } = getState().initializationUsers;
        try {
            return await UserService.info_user(id, text ? text : "", skip, limit);
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },
);

export const fetchUsersByStaffUnit = createAsyncThunk(
    "initializationUsers/fetchUsersByStaffUnit",
    async ({ id, text }, { getState }) => {
        const { skip, limit } = getState().initializationUsers;
        try {
            return await UserService.info_user_by_staffUnit(id, text ? text : "");
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },
);

export const initializationUsersSlice = createSlice({
    name: "initializationUsers",
    initialState,
    reducers: {
        setSkip: (state, action) => {
            state.skip = action.payload;
        },
        setInitials: (state, action) => {
            state.selectUserInitials = action.payload;
        },
        setUser: (state, action) => {
            state.selectedUser = action.payload;
            state.wrongUser = action.payload.is_eligible;
        },
        resetUsers: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.usersList = [...state.usersList, ...action.payload.users];
                state.usersMax = action.payload.total;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.usersList = [];
                state.error = action.payload;
            })
            .addCase(fetchUsersByStaffUnit.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsersByStaffUnit.fulfilled, (state, action) => {
                state.loading = false;
                state.error = "";
                state.usersList = action.payload;
                state.usersMax = action.payload.total;
            })
            .addCase(fetchUsersByStaffUnit.rejected, (state, action) => {
                state.loading = false;
                state.usersList = [];
                state.error = action.payload;
            });
    },
});

export const { setSkip, setInitials, setUser, resetUsers } = initializationUsersSlice.actions;

export default initializationUsersSlice.reducer;

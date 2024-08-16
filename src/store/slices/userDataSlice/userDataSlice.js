import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from 'services/UserService';
import UserStaffDivision from 'services/getUserStaffDivisionService';
import UserMyDataService from 'services/userMyData/userMyDataService';
import UsersService from '../../../services/myInfo/UsersService';

let initialState = {
    user: {},
    timeLine: [],
    actualTimeLine: [],
    familyStatus: {},
    isTimeLineLoading: true,
    userIsLoading: true,
    userDepartment: '',
    error: '',
    hasMore: false,
};

export const getUserDepartment = createAsyncThunk('userData/getUserDepartment', async (staffId) => {
    try {
        const response = await UserStaffDivision.get_user_staff_division(staffId);
        return response;
    } catch (e) {
        console.error(e);
    }
});

export const getUser = createAsyncThunk('userData/getUser', async () => {
    try {
        const userData = await UserService.getMyProfile();
        const response = await UsersService.get_user_by_id(userData.id);
        return response;
    } catch (e) {
        console.error(e);
    }
});

export const getFamilyStatus = createAsyncThunk('userData/getFamilyStatus', async () => {
    try {
        const userData = await UserService.getMyProfile();
        const response = await UsersService.get_family_status(userData.id);
        return response;
    } catch (e) {
        console.error(e);
    }
});

export const getUserTimeline = createAsyncThunk(
    'userData/getUserTimeline',
    async ({ skip, limit, year, month }) => {
        const user = await UserService.getMyProfile();
        const response = await UserMyDataService.getTimeline(user.id, skip, limit, year, month);
        return response;
    },
);

export const continueTimeline = createAsyncThunk(
    'userData/continueTimeline',
    async ({ skip, limit, year, month }) => {
        const user = await UserService.getMyProfile();
        const response = await UserMyDataService.getTimeline(user.id, skip, limit, year, month);
        return response;
    },
);

export const getUserStats = createAsyncThunk('userData/getUserStats', async () => {
    try {
        const userData = await UserService.getMyProfile();
        const response = await UsersService.get_userStats_by_id(userData.id);
        return response;
    } catch (e) {
        console.error(e);
    }
});

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        continueTimelineConcat: (state, action) => {
            const newTimeline = action.payload.filter(
                (item) => !state.timeLine.some((existingItem) => existingItem.id === item.id),
            );
            state.timeLine = [...state.timeLine, ...newTimeline];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUser.pending, (state) => {
            state.userIsLoading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.userIsLoading = false;
            state.error = '';
            state.userDepartment = action.payload;
            state.user = action.payload;
        });
        builder.addCase(getUser.rejected, (state, action) => {
            state.userIsLoading = false;
            state.error = action.payload;
            state.user = [];
        });
        builder.addCase(getFamilyStatus.pending, (state) => {
            state.userIsLoading = true;
        });
        builder.addCase(getFamilyStatus.fulfilled, (state, action) => {
            state.userIsLoading = false;
            state.error = '';
            state.familyStatus = action.payload;
        });
        builder.addCase(getFamilyStatus.rejected, (state, action) => {
            state.userIsLoading = false;
            state.error = action.payload;
            state.familyStatus = [];
        });
        builder.addCase(getUserTimeline.pending, (state) => {
            state.isTimeLineLoading = true;
            state.timeLine = [];
        });
        builder.addCase(getUserTimeline.fulfilled, (state, action) => {
            state.isTimeLineLoading = false;
            state.error = '';
            state.hasMore = action.payload.hasMore;
            state.timeLine = action.payload.data;
        });
        builder.addCase(getUserTimeline.rejected, (state, action) => {
            state.isTimeLineLoading = false;
            state.error = action.payload;
            state.timeLine = [];
        });
        builder.addCase(continueTimeline.pending, (state) => {
            state.isTimeLineLoading = true;
            state.actualTimeLine = [];
        });
        builder.addCase(continueTimeline.fulfilled, (state, action) => {
            state.isTimeLineLoading = false;
            state.error = '';
            state.hasMore = action.payload.hasMore;
            const newTimeline = action.payload.data.filter(
                (item) => !state.timeLine.some((existingItem) => existingItem.id === item.id),
            );
            state.timeLine = [...state.timeLine, ...newTimeline];
            state.actualTimeLine = [];
        });
        builder.addCase(continueTimeline.rejected, (state, action) => {
            state.isTimeLineLoading = false;
            state.error = action.payload;
            state.actualTimeLine = [];
        });
        builder.addCase(getUserDepartment.pending, (state) => {
            state.userIsLoading = true;
        });
        builder.addCase(getUserDepartment.fulfilled, (state, action) => {
            state.userIsLoading = false;
            state.error = '';
            state.userDepartment = action.payload;
        });
        builder.addCase(getUserDepartment.rejected, (state, action) => {
            state.userIsLoading = false;
            state.error = action.payload;
            state.user = [];
        });
    },
});

export const { users, continueTimelineConcat } = usersSlice.actions;

export default usersSlice.reducer;

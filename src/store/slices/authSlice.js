import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AUTH_TOKEN, REFRESH_TOKEN, SCHEDULE_YEAR } from 'constants/AuthConstant';
import IntlMessage from '../../components/util-components/IntlMessage';
import AuthService from '../../services/AuthService';

export const initialState = {
    loading: false,
    message: '',
    showMessage: false,
    redirect: '',
    token: localStorage.getItem(AUTH_TOKEN) || null,
    userData: {},
};

export function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
    );

    return JSON.parse(jsonPayload);
}

export const signIn = createAsyncThunk('auth/signIn', async (data, { rejectWithValue }) => {
    const { email, password } = data;
    try {
        const response = await AuthService.login(email, password);
        if (response.data) {
            const token = response.data.access_token;
            localStorage.setItem(AUTH_TOKEN, response.data.access_token);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
            let payload = { data: await parseJwt(token), token };
            return payload;
        } else {
            return rejectWithValue(response);
        }
    } catch (err) {
        return rejectWithValue(<IntlMessage id={'wrong.password.login'} />);
    }
});
export const getEmail = () => {
    return signIn.fulfilled.email;
};
export const refreshTokenAccess = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        const response = await AuthService.refreshToken(refreshToken);
        if (response.status === 200) {
            const token = response.data.access_token;
            localStorage.setItem(AUTH_TOKEN, token);
            return token;
        } else {
            throw new Error('Refresh token failed');
        }
    } catch (err) {
        throw new Error('Refresh token failed');
    }
});

export const signUp = createAsyncThunk('auth/signUp', async (data, { rejectWithValue }) => {
    const { email, password } = data;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem(SCHEDULE_YEAR);
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticated: (state, action) => {
            state.loading = false;
            state.redirect = '/';
            state.token = action.payload;
        },
        showAuthMessage: (state, action) => {
            state.message = action.payload;
            state.showMessage = true;
            state.loading = false;
        },
        hideAuthMessage: (state) => {
            state.message = '';
            state.showMessage = false;
        },
        signOutSuccess: (state) => {
            state.loading = false;
            state.token = null;
            state.redirect = '/';
        },
        refreshTokenAccess: (state, action) => {
            state.loading = false;
            state.token = action.payload;
        },
        showLoading: (state) => {
            state.loading = true;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.loading = false;
                state.redirect = '/';
                state.token = action.payload.token;
                state.userData = action.payload.data;
            })
            .addCase(signIn.rejected, (state, action) => {
                state.message = action.payload;
                state.showMessage = true;
                state.loading = false;
            })
            .addCase(refreshTokenAccess.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(refreshTokenAccess.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.token = action.payload;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.loading = false;
                state.token = null;
                state.redirect = '/';
            })
            .addCase(signOut.rejected, (state) => {
                state.loading = false;
                state.token = null;
                state.redirect = '/';
            })
            .addCase(signUp.pending, (state) => {
                state.loading = true;
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.loading = false;
                state.redirect = '/';
                state.token = action.payload;
            })
            .addCase(signUp.rejected, (state, action) => {
                state.message = action.payload;
                state.showMessage = true;
                state.loading = false;
            });
    },
});

export const {
    authenticated,
    showAuthMessage,
    hideAuthMessage,
    signOutSuccess,
    showLoading,
    signInSuccess,
} = authSlice.actions;

export default authSlice.reducer;

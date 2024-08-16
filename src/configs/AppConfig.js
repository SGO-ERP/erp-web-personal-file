import { DIR_LTR, NAV_TYPE_SIDE, SIDE_NAV_LIGHT } from 'constants/ThemeConstant';
import { env } from './EnvironmentConfig.js';

export const APP_NAME = 'ERP';
export const API_BASE_URL = env.API_BASE_URL;
export const S3_BASE_URL = env.S3_BASE_URL;
export const APP_PREFIX_PATH = '';
export const AUTH_PREFIX_PATH = '/auth';
export const REDIRECT_URL_KEY = 'redirect';
export const AUTHENTICATED_ENTRY = `${APP_PREFIX_PATH}/duty/data/me`;
export const UNAUTHENTICATED_ENTRY = '/login';
export const API_NEW_BASE_URL = env.API_NEW_BASE_URL;

let lan =
    localStorage.getItem('lan') === null || localStorage.getItem('lan').length < 1
        ? 'ru'
        : localStorage.getItem('lan');

export const THEME_CONFIG = {
    navCollapsed: false,
    sideNavTheme: SIDE_NAV_LIGHT,
    locale: lan,
    navType: NAV_TYPE_SIDE,
    topNavColor: '#3e82f7',
    headerNavColor: '',
    mobileNav: false,
    currentTheme: 'light',
    direction: DIR_LTR,
    blankLayout: false,
};

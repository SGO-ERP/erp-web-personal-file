import { AUTH_TOKEN } from 'constants/AuthConstant';

export const objectToQueryString = (obj: Record<string, any>): string => {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            params.append(key, obj[key]);
        }
    }
    return params.toString();
};

export const queryStringToObject = (queryString: string): Record<string, any> => {
    const params = new URLSearchParams(queryString);
    const result: Record<string, any> = {};

    params.forEach((value, key) => {
        result[key] = value;
    });

    return result;
};

export const getUserID = async () => {
    const token = localStorage.getItem(AUTH_TOKEN);
    if (token) {
        return await parseJwt(token).sub;
    }
    return Promise.resolve(null);
};

export const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(''),
    );

    return JSON.parse(jsonPayload);
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function getStringByNumber(number: number, strings: [string, string, string]): string {
    const cases = [2, 0, 1, 1, 1, 2];
    const stringIndex = number % 100 > 4 && number % 100 < 20 ? 2 : cases[Math.min(number % 10, 5)];

    return strings[stringIndex];
}

export function truncate(source: string, size: number): string {
    return source.length > size ? source.slice(0, size - 1) + '…' : source;
}

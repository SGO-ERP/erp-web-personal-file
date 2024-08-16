export const isTokenExpired = (token: string) => {
    try {
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

        const { exp } = JSON.parse(jsonPayload);
        const expirationDate = new Date(exp * 1000);
        const currentDate = new Date();

        return expirationDate < currentDate;
    } catch (error) {
        console.error('Invalid JWT token', error);
        return false;
    }
};
export const isTokenValid = (token: string): boolean => {
    try {
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

        const jwtPayload = JSON.parse(jsonPayload);

        if (!jwtPayload.exp) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

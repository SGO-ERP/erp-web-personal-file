const getEnv = () => {
    return {
        API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
        API_NEW_BASE_URL: process.env.REACT_APP_API_NEW_BASE_URL,
        S3_BASE_URL: process.env.REACT_APP_S3_BASE_URL,
        NOTIFICATION_WS_URL: process.env.REACT_APP_NOTIFICATION_WS_URL,
    };
};

export const env = getEnv();

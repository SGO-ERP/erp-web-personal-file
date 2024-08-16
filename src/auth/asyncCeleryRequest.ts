import React from 'react';
import FetchInterceptor from './FetchInterceptor';
import { AxiosResponse } from 'axios';

const INTERVAL_DELAY = 2000;
export const asyncCeleryRequest = async <T>(
    statusCheckUrl: string,
    progressSetter?: React.Dispatch<React.SetStateAction<number>>,
): Promise<AxiosResponse<T> | Error> => {
    progressSetter?.(30);

    const statusCheck = new Promise<AxiosResponse<T> | Error>((resolve, reject) => {
        const id = setInterval(async () => {
            const status = await FetchInterceptor.get(statusCheckUrl);
            if (status.status >= 400) {
                clearInterval(id);
                progressSetter?.(100);
                reject(new Error('Failed to fetch celery task status'));
            }
            if (!status.data?.status) {
                clearInterval(id);
                progressSetter?.(100);
                resolve(status.data);
            }
        }, INTERVAL_DELAY);
    });
    return statusCheck;
};

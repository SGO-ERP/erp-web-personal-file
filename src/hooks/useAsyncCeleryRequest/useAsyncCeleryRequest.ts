import { useEffect, useState } from 'react';
import FetchInterceptor from 'auth/FetchInterceptor';
import { useTranslation } from 'react-i18next';
import { delay } from 'utils/helpers/common';
import { UseAsyncCeleryRequestProps } from './types';
import { DELAY_BEFORE_OK, INTERVAL_DELAY, PROGRESS } from './data';
import { checkForProgressStatus, checkForStatus, checkForBodyId } from './utils';

export const useAsyncCeleryRequest = <T,>({ statusCheckUrl, showLoader }: UseAsyncCeleryRequestProps) => {
    const [data, setData] = useState<T | null>(null)
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)

    const { t } = useTranslation()
    const errorMessage = t('schdeule.warning')

    useEffect(() => {
        if (!showLoader) {
            return
        }
        const id = setInterval(async () => {
            try {
                const response = await FetchInterceptor.get(statusCheckUrl);
                const hasProgressStatus = checkForProgressStatus(response)
                const hasBodyId = checkForBodyId(response)

                if (hasProgressStatus) {
                    if (status < 99) {
                        setStatus(prev => prev +1)
                    }
                    return
                }
                if (!hasBodyId) {
                    throw new Error('Response has an unexpected data')
                }
                setProgress(PROGRESS.FULFILLED)
                await delay(DELAY_BEFORE_OK)
                setData(response.data)
            } catch (error) {
                setProgress(PROGRESS.FULFILLED)
                await delay(DELAY_BEFORE_OK)
                setStatus(500)
                setError(errorMessage)
            }
        }, INTERVAL_DELAY)

        return () => {
            clearInterval(id)
        }
    }, [statusCheckUrl, showLoader, errorMessage])

    return {
        data,
        progress,
        status,
        error
    }
};

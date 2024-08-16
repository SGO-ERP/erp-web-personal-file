import { PrivateServices } from 'API';
import { components } from 'API/types';

export const duplicateSurvey = async (id: string) => {
    const { data } = await PrivateServices.post('/api/v1/surveys/{id}/duplicate', {
        params: {
            path: {
                id,
            },
        },
    });

    return data;
};

export const archiveSurvey = async (record: components['schemas']['SurveyRead']) => {
    await PrivateServices.put('/api/v1/surveys/{id}/', {
        params: {
            path: {
                id: record.id || '',
            },
        },
        body: {
            ...record,
            status: 'Архивный',
        },
    });
};

export const unarchiveSurvey = async (record: components['schemas']['SurveyRead']) => {
    await PrivateServices.put('/api/v1/surveys/{id}/', {
        params: {
            path: {
                id: record.id || '',
            },
        },
        body: {
            ...record,
            status: 'Активный',
        },
    });
};

export const deleteSurvey = async (record: components['schemas']['SurveyRead']) => {
    await PrivateServices.del('/api/v1/surveys/{id}/', {
        params: {
            path: {
                id: record.id || '',
            },
        },
    });
};

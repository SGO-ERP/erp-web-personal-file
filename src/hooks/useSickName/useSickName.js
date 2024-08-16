import { PrivateServices } from 'API';
import { useCallback, useEffect, useState } from 'react';
import { defaultSickNameOption, defaultSickNameOptions } from './data';

export const useSickName = (language) => {
    const [sickNameOption, setSickNameOption] = useState(defaultSickNameOption);
    const [sickNameOptions, setSickNameOptions] = useState(defaultSickNameOptions);
    const [sickNameOptionsLoading, setSickNameOptionsLoading] = useState(false);

    const getAllSickNameOptions = useCallback(async () => {
        try {
            setSickNameOptionsLoading(true);

            const url = '/api/v1/medical/illness_type';
            const response = await PrivateServices.get(url, {
                params: {
                    query: {
                        skip: 0,
                        limit: 10000,
                    },
                },
            });
            const sickNameOptions = {
                rus: response.data.map((sick) => ({
                    label: sick.name,
                    value: sick.id,
                })),
                kaz: response.data.map((sick) => ({
                    label: sick.nameKZ,
                    value: sick.id,
                })),
            };
            setSickNameOptions(sickNameOptions);
        } catch (error) {
            console.log(error);
        } finally {
            setSickNameOptionsLoading(false);
        }
    }, []);

    const handleAddNewSickName = async ({ kz, ru }) => {
        try {
            const url = '/api/v1/medical/illness_type';
            await PrivateServices.post(url, {
                body: {
                    name: ru,
                    nameKZ: kz,
                },
            });
            getAllSickNameOptions();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllSickNameOptions();
    }, [getAllSickNameOptions, language]);

    const resetSickNameOption = () => {
        setSickNameOption(defaultSickNameOption)
    }

    return {
        sickNameOption,
        setSickNameOption,
        sickNameOptions,
        sickNameOptionsLoading,
        handleAddNewSickName,
        resetSickNameOption
    };
};

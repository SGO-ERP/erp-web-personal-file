import { useCallback, useEffect, useState } from 'react';
import { PrivateServices } from 'API';
import { defaultViolationNameOption, defaultViolationNameOptions } from './data';

export const useViolationName = (language) => {
    const [violationNameOption, setViolationNameOption] = useState(defaultViolationNameOption);
    const [violationNameOptions, setViolationNameOptions] = useState(defaultViolationNameOptions);
    const [violationNameOptionsLoading, setViolationNameOptionsLoading] = useState(false);

    const getAllViolationTypes = useCallback(async () => {
        try {
            setViolationNameOptionsLoading(true);

            const url = '/api/v1/additional/violation_type';
            const response = await PrivateServices.get(url, {
                params: {
                    query: {
                        skip: 0,
                        limit: 10000,
                    },
                },
            });
            const nameOptionsKaz = response.data.map((violation) => ({
                value: violation.id,
                label: violation.nameKZ,
            }));
            const nameOptionsRus = response.data.map((violation) => ({
                value: violation.id,
                label: violation.name,
            }));
            setViolationNameOptions({
                rus: nameOptionsRus,
                kaz: nameOptionsKaz,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setViolationNameOptionsLoading(false);
        }
    }, []);

    useEffect(() => {
        getAllViolationTypes();
    }, [getAllViolationTypes, language]);

    const handleViolationNameChange = (id) => {
        const nameRus = violationNameOptions.rus.find((name) => name.value === id);
        const nameKaz = violationNameOptions.kaz.find((name) => name.value === id);

        if (!nameRus || !nameKaz) {
            return;
        }
        setViolationNameOption({
            rus: nameRus,
            kaz: nameKaz,
        });
    };

    const handleAddNewViolationName = async ({ kz, ru }) => {
        try {
            const url = '/api/v1/additional/violation_type';
            await PrivateServices.post(url, {
                body: {
                    name: ru,
                    nameKZ: kz,
                },
            });

            getAllViolationTypes();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        violationNameOption,
        setViolationNameOption,
        violationNameOptions,
        violationNameOptionsLoading,
        handleViolationNameChange,
        handleAddNewViolationName,
        getAllViolationTypes,
    };
};

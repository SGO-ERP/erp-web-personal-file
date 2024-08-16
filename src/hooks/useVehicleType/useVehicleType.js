import { useCallback, useEffect, useState } from 'react';
import { PrivateServices } from 'API';
import { defaultVehicleTypeOption, defaultVehicleTypeOptions } from './data';

export const useVehicleType = (language) => {
    const [vehicleTypeOption, setVehicleTypeOption] = useState(defaultVehicleTypeOption);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState(defaultVehicleTypeOptions);
    const [vehicleTypeOptionsLoading, setVehicleTypeOptionsLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        try {
            setVehicleTypeOptionsLoading(true);

            const url = '/api/v1/additional/vehicle_type';
            const response = await PrivateServices.get(url, {
                params: {
                    query: {
                        skip: 0,
                        limit: 10000,
                    },
                },
            });
            const nameOptionsKaz = response.data.objects.map((violation) => ({
                value: violation.id,
                label: violation.nameKZ ?? violation.name,
            }));
            const nameOptionsRus = response.data.objects.map((violation) => ({
                value: violation.id,
                label: violation.name,
            }));
            setVehicleTypeOptions({
                rus: nameOptionsRus,
                kaz: nameOptionsKaz,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setVehicleTypeOptionsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll, language]);

    const onChange = (id) => {
        const nameRus = vehicleTypeOptions.rus.find((name) => name.value === id);
        const nameKaz = vehicleTypeOptions.kaz.find((name) => name.value === id);

        if (!nameRus || !nameKaz) {
            return;
        }
        setVehicleTypeOption({
            rus: nameRus,
            kaz: nameKaz,
        });
    };

    const handleAddNewVehicleType = async ({ kz, ru }) => {
        try {
            const url = '/api/v1/additional/vehicle_type';
            await PrivateServices.post(url, {
                body: {
                    name: ru,
                    nameKZ: kz,
                },
            });

            fetchAll();
        } catch (error) {
            console.log(error);
        }
    };

    return {
        vehicleTypeOption,
        setVehicleTypeOption,
        vehicleTypeOptions,
        vehicleTypeOptionsLoading,
        onChange,
        fetchAll,
        handleAddNewVehicleType
    };
};

import { PrivateServices } from "API";
import { useCallback, useEffect, useState } from "react";

const languageMap = {
    kz: "nameKZ",
    ru: "name",
};
export const useVillageOptions = (language, deps = [], regionId = "") => {
    const [villageOptions, setVillageOptions] = useState([]);
    const [villageOptionsLoading, setVillageOptionsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getVillageOptions = useCallback(async () => {
        try {
            setVillageOptionsLoading(true);
            setError(null);

            const url = !regionId
                ? "/api/v1/personal/city"
                : `/api/v1/personal/city/get_by_region/${regionId}`;
            const response = await PrivateServices.get(url, {
                params: {
                    query: {
                        skip: 0,
                        limit: 10000,
                    },
                },
            });
            const field = languageMap[language];

            if (response.error) {
                throw error;
            }
            if (!Array.isArray(response.data)) {
                throw new Error("Response is not array type");
            }

            const villageOptions = response.data
                .filter((option) => option.is_village)
                .map((city) => ({
                    value: city.id,
                    label: city[field],
                    is_village: true,
                }));
            setVillageOptions(villageOptions);
        } catch (error) {
            console.log(error);
            setError("Error on loading country options");
        } finally {
            setVillageOptionsLoading(false);
        }
    }, [language, regionId, error, ...deps]);

    useEffect(() => {
        getVillageOptions();
    }, [language, getVillageOptions, ...deps]);

    const createNew = async (values) => {
        try {
            const url = "/api/v1/personal/city";
            await PrivateServices.post(url, {
                body: {
                    name: values.name ?? values.ru,
                    nameKZ: values.nameKZ ?? values.kz,
                    is_village: true,
                    region_id: regionId,
                },
            });
            getVillageOptions();
        } catch (error) {
            console.log(error);
            setError("Error on create");
        }
    };

    return {
        villageOptions,
        villageOptionsLoading,
        error,
        getVillageOptions,
        createNew,
    };
};

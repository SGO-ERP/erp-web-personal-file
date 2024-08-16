import { PrivateServices } from "API";
import { useCallback, useEffect, useState } from "react";

const languageMap = {
    kz: "nameKZ",
    ru: "name",
};
export const useCityOptions = (language, deps = [], regionId = "") => {
    const [cityOptions, setCityOptions] = useState([]);
    const [cityOptionsLoading, setCityOptionsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCityOptions = useCallback(async () => {
        try {
            setCityOptionsLoading(true);
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

            const cityOptions = response.data
                .filter((option) => !option.is_village)
                .map((city) => ({
                    value: city.id,
                    label: city[field],
                    is_village: false,
                }));
            setCityOptions(cityOptions);
        } catch (error) {
            console.log(error);
            setError("Error on loading country options");
        } finally {
            setCityOptionsLoading(false);
        }
    }, [language, regionId, error, ...deps]);

    useEffect(() => {
        getCityOptions();
    }, [language, getCityOptions, ...deps]);

    const createNew = async (values) => {
        try {
            const url = "/api/v1/personal/city";
            await PrivateServices.post(url, {
                body: {
                    name: values.name ?? values.ru,
                    nameKZ: values.nameKZ ?? values.kz,
                    is_village: false,
                    region_id: regionId,
                },
            });
            getCityOptions();
        } catch (error) {
            console.log(error);
            setError("Error on create");
        }
    };

    return {
        cityOptions,
        cityOptionsLoading,
        error,
        getCityOptions,
        createNew,
    };
};

import { PrivateServices } from "API";
import { useCallback, useEffect, useState } from "react";

const languageMap = {
    kz: "nameKZ",
    ru: "name",
};
export const useRegionOptions = (language, deps = [], countryId = "") => {
    const [regionOptions, setRegionOptions] = useState([]);
    const [regionOptionsLoading, setRegionOptionsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getRegionOptions = useCallback(async () => {
        try {
            setRegionOptionsLoading(true);
            setError(null);

            const url = !countryId
                ? "/api/v1/personal/region"
                : `/api/v1/personal/region/get_by_country/${countryId}`;
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

            const regionOptions = response.data.map((region) => ({
                value: region.id,
                label: region[field],
            }));
            setRegionOptions(regionOptions);
        } catch (error) {
            console.log(error);
            setError("Error on loading country options");
        } finally {
            setRegionOptionsLoading(false);
        }
    }, [language, countryId, error, ...deps]);

    useEffect(() => {
        getRegionOptions();
    }, [language, getRegionOptions, ...deps]);

    const createNew = async (params) => {
        console.log(params);
        const { ru, kz, name, nameKZ } = params;
        try {
            const url = "/api/v1/personal/region";
            await PrivateServices.post(url, {
                body: {
                    name: ru ?? name,
                    nameKZ: kz ?? nameKZ,
                    country_id: countryId,
                },
            });
            getRegionOptions();
        } catch (error) {
            console.log(error);
            setError("Error on create");
        }
    };

    return {
        regionOptions,
        regionOptionsLoading,
        error,
        getRegionOptions,
        createNew,
    };
};

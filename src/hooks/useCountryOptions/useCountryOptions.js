import { PrivateServices } from "API";
import { useCallback, useEffect, useState } from "react";

const languageMap = {
    kz: "nameKZ",
    ru: "name",
};
export const useCountryOptions = (language, deps = []) => {
    const [countryOptions, setCountryOptions] = useState([]);
    const [countryOptionsLoading, setCountryOptionsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCountryOptions = useCallback(async () => {
        try {
            setCountryOptionsLoading(true);
            setError(null);

            const url = "/api/v1/additional/country";
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
            if (!Array.isArray(response.data.objects)) {
                throw new Error("Response is not array type");
            }

            const countryOptions = response.data.objects.map((country) => ({
                value: country.id,
                label: country[field],
            }));
            setCountryOptions(countryOptions);
        } catch (error) {
            console.log(error);
            setError("Error on loading country options");
        } finally {
            setCountryOptionsLoading(false);
        }
    }, [language, ...deps]);

    useEffect(() => {
        getCountryOptions();
    }, [language, getCountryOptions, ...deps]);

    const createNew = async (params) => {
        const { ru, kz, name, nameKZ } = params;
        try {
            const url = "/api/v1/additional/country";
            await PrivateServices.post(url, {
                body: {
                    name: ru ?? name,
                    nameKZ: kz ?? nameKZ,
                },
            });
            getCountryOptions();
        } catch (error) {
            console.log(error);
            setError("Error on create");
        }
    };

    return {
        countryOptions,
        countryOptionsLoading,
        error,
        getCountryOptions,
        createNew,
    };
};

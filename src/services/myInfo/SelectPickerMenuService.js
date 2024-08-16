import ApiService from "auth/FetchInterceptor";

const getEducation = async (props) => {
    const { skip, limit, search = null, baseUrl } = props;
    const queryParams = `skip=${skip}&limit=${limit}`;

    let url = `${baseUrl}?${queryParams}`;

    if (search && Object.keys(search).length > 0 && search?.trim() !== "") {
        url += `&filter=${search}`;
    }

    const response = await ApiService.get(url);

    return response.data;
};

const getPosition = async (props) => {
    const { skip, limit, search = null, baseUrl } = props;
    const queryParams = `skip=${skip}&limit=${limit}`;

    let url = `${baseUrl}?${queryParams}`;

    if (search && search.trim() !== "") {
        url += `&filter=${search}`;
    }

    const response = await ApiService.get(url);

    return response.data;
};

export default {
    getEducation,
    getPosition,
};

import ApiService from "../../auth/FetchInterceptor";

const UserMyDataService = {};

UserMyDataService.get_new_timeline = async function (date) {
    try {
        let url = "histories/timeline";

        if (date) {
            url += `?date_till=${date}`;
        }

        const response = await ApiService.get(url, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

UserMyDataService.getTimeline = async function (userId, skip, limit, year, month) {
    try {
        if (year !== null && month !== null) {
            const response = await ApiService.get(
                `/histories/personal/${userId}?date_from=${year}-${month}-1&skip=${skip}&limit=${limit}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = response.data;
            const hasMore = response.data.length + 1 > limit;
            return { data, hasMore };
        } else {
            const response = await ApiService.get(
                `/histories/personal/${userId}?skip=${skip}&limit=${limit}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const data = response.data;
            const hasMore = response.data.length + 1 > limit;
            return { data: data || [], hasMore };
        }
    } catch (e) {
        console.error(e);
    }
};

UserMyDataService.get_personal_histories = async function (id) {
    try {
        const response = await ApiService.get(`/histories/personal/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

UserMyDataService.get_user_histories = async function (id) {
    try {
        const response = await ApiService.get(`/histories/user/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

UserMyDataService.get_histories = async function (id) {
    try {
        const response = await ApiService.get(`/histories/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default UserMyDataService;

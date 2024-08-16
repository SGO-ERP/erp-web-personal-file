import ApiService from "../auth/FetchInterceptor";
import { AUTH_TOKEN } from "../constants/AuthConstant";
import { objectToQueryString, parseJwt } from "../utils/helpers/common";

export class NewUserService {
    static async getProfileService({ id }: { id: string }) {
        return await ApiService.get(`users/${id}/`);
    }

    static async getPermissions() {
        return await ApiService.get("/permissions/user_permissions");
    }
}

const UserService = {};

// @ts-expect-error Такого метода нет у типа UserService
UserService.auto_user_info = async function (id, name) {
    try {
        const response = await ApiService.get(`auto-tags/${id}/?auto_tag=${name}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.info_user = async function (hrDocTempID, search = "", skip = 0, limit = 50) {
    const params = objectToQueryString({
        hr_document_template_id: hrDocTempID,
        skip,
        limit,
        filter: search,
    });
    try {
        const response = await ApiService.get(`/users?${params}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.info_user_by_staffUnit = async function (
    staff_unit_id: string,
    search = "",
    skip = 0,
    limit = 50,
) {
    const params = objectToQueryString({
        skip,
        limit,
        filter: search,
    });
    try {
        const response = await ApiService.get(
            `/users/get_eligible_for_vacancy/${staff_unit_id}?${params}`,
        );
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.position_change_users = async function (id, search = "", skip = 0, limit = 50) {
    const params = objectToQueryString({
        staff_unit_id: id,
        skip,
        limit,
        filter: search,
    });
    try {
        const response = await ApiService.get(`/users/get_eligible_for_vacancy/${params}`);
        return response.data.users;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.feat_archived_users = async function (page, limit, filter) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/users/archived?skip=${skip}&limit=${limit + 1}&filter=${filter}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop(); // Remove the extra item
        }
        return { data, hasMore };
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.feat_active_users = async function (page, limit, filter) {
    try {
        const skip = (page - 1) * limit;
        const response = await ApiService.get(
            `/users/active?skip=${skip}&limit=${limit + 1}&filter=${filter}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
                },
            },
        );
        const data = response.data;
        const hasMore = data.length > limit;
        if (hasMore) {
            data.pop();
        }
        return { data, hasMore };
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.user_get_by_id = async function (id) {
    try {
        const response = await ApiService.get(`/users/${id}/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.getMyProfile = async function () {
    try {
        // @ts-expect-error Такого метода нет у типа UserService
        const userId = await parseJwt(localStorage.getItem(AUTH_TOKEN)).sub;
        const response = await ApiService.get(`/users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.user_short = async function (id) {
    try {
        const response = await ApiService.get(`users/short/${id}`);

        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.getUserWithStaffUnitId = async function (id) {
    try {
        const response = await ApiService.get(`/users/staff-unit/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

// @ts-expect-error Такого метода нет у типа UserService
UserService.getUserWithStaffUnitId = async function (id) {
    try {
        const response = await ApiService.get(`/users/staff-unit/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
            },
        });
        return response.data;
    } catch (e) {
        console.error(e);
    }
};

export default UserService;

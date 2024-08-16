import { useAppDispatch } from "hooks/useStore";
import HandleFileUpload from "../../utils/HandleFileUpload";
import { PrivateServices } from "API";
import { getBadgeTypes } from "store/slices/admin-page/adminBadgeSlice";
import { BadgeOrderMapTypes, PropsRecordType, PropsValueType } from "./interfaces";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { message } from "antd";

const badgeOrderMap: BadgeOrderMapTypes = {
    "otherMedal": 0,
    "defaultMedal": 1,
    "stateMedal": 2,
};

export const EditBadges = async (
    dispatch: ReturnType<typeof useAppDispatch>,
    value: PropsValueType,
    record: PropsRecordType,
) => {
    try {
        const currentBadge =
            badgeOrderMap[value.badge_order] !== null &&
            badgeOrderMap[value.badge_order] !== undefined;

        const badgeOrder = currentBadge ? badgeOrderMap[value.badge_order] : 0;

        const url = value.url ? await HandleFileUpload(value.url) : record.url;

        await PrivateServices.put("/api/v1/badge_types/{id}/", {
            params: { path: { id: record.id } },
            body: { name: value.name, nameKZ: value.nameKZ, url, badge_order: badgeOrder },
        });

        await dispatch(getBadgeTypes());
    } catch (error) {
        console.error("Error editing badges:", error);

        void message.error(
            LocalText.getName({
                name: "Ошибка редактирование медали.",
                nameKZ: "Медальді өңдеу қатесі.",
            }),
        );
    }
};

export const AddBadge = async (
    dispatch: ReturnType<typeof useAppDispatch>,
    value: PropsValueType,
) => {
    try {
        const url = await HandleFileUpload(value.url);

        const postResponse = await PrivateServices.post("/api/v1/badge_types", {
            body: {
                name: value.name,
                nameKZ: value.nameKZ,
                url: url,
                badge_order: badgeOrderMap[value.badge_order],
            },
        });

        if (postResponse.response.status > 400) {
            throw new Error();
        }

        await dispatch(getBadgeTypes());
    } catch (error) {
        console.error("Error adding badge:", error);

        message.error(
            LocalText.getName({
                name: "Ошибка создание медали.",
                nameKZ: "Медаль жасау қатесі.",
            }),
        );
    }
};

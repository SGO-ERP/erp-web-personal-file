import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import { RowItemType } from "./interfaces";
import { notification } from "antd";

export const archive = async (isActive: boolean, rowItem: RowItemType, action: () => void) => {
    try {
        const updatedData = { ...rowItem, is_active: isActive };

        await HrDocumentTemplatesService.update_hr_template(updatedData.id, updatedData);

        action();

        notification.success({
            message:
                localStorage.getItem("lan") === "kk"
                    ? "Бұйрық мұрағатталған"
                    : "Приказ заархивирован",
        });
    } catch (error) {
        notification.error({
            message:
                localStorage.getItem("lan") === "kk"
                    ? "Бұйрықты мұрағаттау қатесі"
                    : "Ошибка архивации приказа",
        });
    }
};

export const duplicate = async (id: string, action: () => void) => {
    try {
        await HrDocumentTemplatesService.hr_template_duplicate(id);

        notification.success({
            message:
                localStorage.getItem("lan") === "kk"
                    ? "Бұйрықтың телнұсқасы құрылды"
                    : "Дубликат приказа создан",
        });

        action();
    } catch (error) {
        const errorMessage =
            localStorage.getItem("lan") === "kk"
                ? "Бұйрықты қайталау қатесі"
                : "Ошибка дублирования приказа";

        notification.error({
            message: errorMessage,
        });
    }
};

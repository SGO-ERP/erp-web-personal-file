import { UploadFile } from "antd/lib/upload/interface";
import { message } from "antd";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

const HandleFileUpload = async (fileList: UploadFile[]) => {
    if (!fileList || fileList.length === 0) {
        return undefined;
    }

    const formData = new FormData();

    try {
        for (const file of fileList) {
            try {
                const response = await fetch(file.originFileObj);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch file: ${response.status} - ${response.statusText}`,
                    );
                }

                const blob = await response.blob();
                formData.append("file", blob, file.name);
            } catch (error) {
                console.error("Error fetching file:", error);
                throw new Error("Error fetching file");
            }
        }

        try {
            const response = await FileUploaderService.upload(formData);
            return response.link;
        } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            throw new Error("Error uploading file");
        }
    } catch (error) {
        void message.error(
            LocalText.getName({
                name: "Не удалось загрузить файл.",
                nameKZ: "Файлды жүктеу мүмкін болмады.",
            }),
        );
    }
};

export default HandleFileUpload;

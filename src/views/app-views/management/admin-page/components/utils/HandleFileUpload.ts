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
            if (file.originFileObj) {
                formData.append("file", file.originFileObj, file.name);
            } else {
                console.error("No file object found");
                throw new Error("No file object found");
            }
        }

        try {
            const response = await FileUploaderService.upload(formData);
            return response.link; // Adjust based on actual response structure
        } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            throw new Error("Error uploading file");
        }
    } catch (error) {
        console.error("Error in file upload process:", error);
        void message.error(
            LocalText.getName({
                name: "Не удалось загрузить файл.",
                nameKZ: "Файлды жүктеу мүмкін болмады.",
            }),
        );
    }
};

export default HandleFileUpload;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, message, Modal, Upload } from "antd";
import { fileExtensions } from "constants/FileExtensionConstants";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { disabledDate } from "utils/helpers/futureDateHelper";
import uuidv4 from "utils/helpers/uuid";
import { addSportDegree, addSportTypes } from "store/slices/myInfo/sportTypeSlice";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalSkillSports = ({ isOpen, onClose }) => {
    const [optionValue, setOptionValue] = useState({});
    const [reformattedSportTypes, setReformattedSportTypes] = useState([]);
    const [sportDegreeTypesOptions, setSportDegreeTypesOptions] = useState([]);
    const [file, setFile] = useState(null);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { sport_degrees } = useSelector((state) => state.myInfo.allTabs.personal_data);
    const { sportDegrees, sportTypes } = useSelector((state) => state.sportTypes);

    useEffect(() => {
        if (!isOpen) return;

        const degreeOptions = generateOptions(sportDegrees);
        const typeOptions = generateOptions(sportTypes);

        setSportDegreeTypesOptions(degreeOptions);
        setReformattedSportTypes(typeOptions);
    }, [isOpen]);

    const generateOptions = (data) => {
        const option = data.map((e) => {
            return { value: e.id, label: LocalText.getName(e), object: e };
        });

        return option;
    };

    const handleFileUpload = async (fileList) => {
        if (!fileList) {
            return undefined;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);

            setFile(response.link);
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.success" />)}`,
                );
            } else if (status === "error") {
                void message.error(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.error" />)}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const validateValues = (rule) => {
        return new Promise((resolve, reject) => {
            if (!optionValue[rule.field]) {
                reject(<IntlMessage id="education.select.empty" />);
            } else {
                resolve();
            }
        });
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const currentSportDegree = sportDegreeTypesOptions.find(
                (item) => item.value === optionValue.sport_degree,
            );
            const currentSportType = reformattedSportTypes.find(
                (item) => item.value === optionValue.sport_type,
            );

            const newSportDegree = {
                name: currentSportDegree.object.name,
                nameKZ: currentSportDegree.object.nameKZ,
                assignment_date: values.date.toDate(),
                sport_type_id: optionValue.sport_type,
                document_link: response ?? null,
                id: uuidv4(),
                sport_type: currentSportType.object,
                sport_degree: currentSportDegree.object,
                sport_degree_type_id: optionValue.sport_degree,
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.personal_data.sport_degrees",
                    value: [...sport_degrees, newSportDegree],
                }),
            );

            onCancel();
        } catch (error) {
            throw new Error(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setOptionValue({});
        setFile(null);

        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title="Добавить навык владения спортом"
                title={<IntlMessage id="skill.sport.add" />}
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id="skill.sport.name" />}
                        name="sport_degree"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={sportDegreeTypesOptions}
                            type="sport_degree"
                            values={optionValue}
                            setValue={setOptionValue}
                            currentOptions={setSportDegreeTypesOptions}
                            placeholder={"skill.sport.name"}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <IntlMessage id="achievement.by.sport.type" />
                            </span>
                        }
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        name="sport_type"
                        required
                    >
                        <SelectPickerMenu
                            options={reformattedSportTypes}
                            type="sport_type"
                            values={optionValue}
                            setValue={setOptionValue}
                            currentOptions={setReformattedSportTypes}
                            placeholder={"achievement.by.sport.type"}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <span>
                                <IntlMessage id="service.data.modalAcademicDegree.dateGiveTxt" />
                            </span>
                        }
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: (
                                    <IntlMessage id="service.data.modalAcademicDegree.dateGive" />
                                ),
                            },
                        ]}
                    >
                        <DatePicker
                            style={{ width: "100%" }}
                            format="DD-MM-YYYY"
                            disabledDate={disabledDate}
                            placeholder={IntlMessageText.getText({
                                id: "date.placeholder",
                            })}
                        />
                    </Form.Item>
                    <p className="fam_form_title_text">
                        <IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />
                    </p>
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
                    >
                        <Dragger fileList={file} {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                <IntlMessage id="dragger.text" />
                            </p>
                        </Dragger>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalSkillSports;

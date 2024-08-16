import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Modal, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import "moment/locale/ru";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { disabledDate } from "utils/helpers/futureDateHelper";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalAllAchievements = ({ isOpen, onClose }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});

    const [optionValue, setOptionValue] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [degreeNames, setDegreeNames] = useState({ name: "", nameKZ: "" });
    const [reformattedSportTypes, setReformattedSportTypes] = useState([]);
    const [file, setFile] = useState();

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const sport_achievements = useSelector(
        (state) => state.myInfo.allTabs.personal_data.sport_achievements,
    );

    useEffect(() => {
        fetchOptions();
    }, [scrollingLength, searchText, isOpen]);

    const fetchOptionsData = async (baseUrl, type) => {
        const response = await SelectPickerMenuService.getEducation({
            ...scrollingLength,
            search: searchText[type],
            baseUrl,
        });

        setMaxCount((prevData) => ({ ...prevData, [type]: response.total }));

        return response.objects.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            obj: item,
        }));
    };

    const fetchOptions = async () => {
        const sportTypesOptions = await fetchOptionsData("personal/sport_type", "sport_degree");

        setReformattedSportTypes(sportTypesOptions);
    };

    const handleInput = (event) => {
        setDegreeNames({
            ...degreeNames,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
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
            // Return the response link, so it can be used in the onOk function
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

    const validateLocalization = () => {
        const isRusEmpty = degreeNames.name.trim() === "";
        const isKZEmpty = degreeNames.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="personal.modals.localization.empty" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="personal.modals.localization.kz" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="personal.modals.localization.ru" />);
            } else {
                resolve();
            }
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

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const currentSportType = reformattedSportTypes.find(
                (item) => item.value === optionValue.sport_type,
            );

            const newSportTitle = {
                name: degreeNames.name,
                nameKZ: degreeNames.nameKZ,
                sport_type_id: optionValue.sport_type,
                assignment_date: values.date.toDate(),
                document_link: response,
                id: uuidv4(),
                sport_type: currentSportType.obj,
            };

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.personal_data.sport_achievements",
                    value: [...sport_achievements, newSportTitle],
                }),
            );

            onCancel();
        } catch (error) {
            throw new Error(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setDegreeNames({ name: "", nameKZ: "" });
        setOptionValue({});
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить достижение в спорте'}
                title={
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginRight: "20px",
                            alignItems: "center",
                        }}
                    >
                        <span>
                            <IntlMessage id="achievement.add" />
                        </span>
                        <LanguageSwitcher
                            size="small"
                            fontSize="12px"
                            height="1.4rem"
                            current={currentLanguage}
                            setLanguage={setCurrentLanguage}
                        />
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id="initiate.save" />}
                cancelText={<IntlMessage id="candidates.warning.cancel" />}
                style={{ height: "500px", width: "400px" }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"achievement.name"} />}
                        name="name"
                        rules={[
                            {
                                validator: validateLocalization,
                            },
                        ]}
                        required
                    >
                        <Input
                            placeholder={IntlMessageText.getText({
                                id: "achievement.degree.placeholder",
                            })}
                            value={
                                currentLanguage === "rus" ? degreeNames.name : degreeNames.nameKZ
                            }
                            onChange={handleInput}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? degreeNames.name : degreeNames.nameKZ}
                        </p>
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
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setReformattedSportTypes}
                            searchText={searchText}
                            placeholder={"personal.personalData.sportsSkills.modal.type"}
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

export default ModalAllAchievements;

import { InboxOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Row, Select, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/personalInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { disabledDate } from "utils/helpers/futureDateHelper";
import SportTypeService from "services/myInfo/SportTypeService";
import "moment/locale/ru";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalAllAchievementsEdit = ({ isOpen, onClose, achievement, source = "get" }) => {
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [degreeNames, setDegreeNames] = useState({ name: "", nameKZ: "" });
    const [reformattedSportTypes, setReformattedSportTypes] = useState([]);
    const [file, setFile] = useState();
    const [filesChanged, setFilesChanged] = useState(false);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { sport_achievements } = useSelector((state) => state.myInfo.edited.personal_data);
    const sportTypes = useSelector((state) => state.sportTypes.sportTypes);

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
            object: item,
        }));
    };

    const fetchOptions = async () => {
        const sportTypesOptions = await fetchOptionsData("personal/sport_type", "sport_degree");
        let uniqueArr = sportTypesOptions.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        setReformattedSportTypes(uniqueArr);
    };

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e, type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };

    const handleInput = (event) => {
        setDegreeNames({
            ...degreeNames,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        if (!fileList || fileList.length === 0) {
            return null;
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
        setFilesChanged(true);
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
        onRemove: handleFileRemove,
        name: "file",
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
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
        const values = await form.validateFields();
        const link = filesChanged
            ? await handleFileUpload(values.dragger)
            : achievement.document_link;

        const newObject = {
            name: degreeNames.name,
            nameKZ: degreeNames.nameKZ,
            sport_type_id: values.sport_type,
            assignment_date: values.date.toDate(),
            document_link: link,
            profile_id: achievement.profile_id,
            id: achievement.id,
            sport_type: sportTypes.find((item) => item.id === values.sport_type),
        };

        changeDispatchValues(newObject);
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "personalInfoData.sport_achievements",
                    id: achievement.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.personal_data.sport_achievements",
                    value: [...sport_achievements, obj],
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.personal_data.sport_achievements",
                    id: achievement.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.personal_data.sport_achievements",
                    id: achievement.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const onDelete = () => {
        changeDispatchValues({ id: achievement.id, delete: true });
    };

    const handleClose = () => {
        form.resetFields();
        setDegreeNames({ name: "", nameKZ: "" });
        setFilesChanged(false);
        onClose();
    };

    useEffect(() => {
        form.resetFields();

        findSelectOption(achievement.sport_type_id);

        const values = {
            sport_type: achievement.sport_type_id,
            date: moment(achievement.assignment_date),
        };

        setDegreeNames({ name: achievement.name, nameKZ: achievement.nameKZ });

        form.setFieldsValue(values);

        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(achievement.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };

        getFile();
    }, [form, achievement, isOpen]);

    const findSelectOption = async (id, type) => {
        const response = await SportTypeService.get_document_staff_type_id(id);

        setReformattedSportTypes((prevData) => [
            ...new Set(prevData),
            { value: response.id, label: LocalText.getName(response)},
        ]);
    };

    return (
        <Modal
            // title={'Редактировать достижение в спорте'}
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
                        <IntlMessage id="achievement.edit" />
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
            onClick={(e) => e.stopPropagation()}
            open={isOpen}
            onCancel={onClose}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={handleClose}>
                        <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={"service.data.modalAddPsycho.save"} />
                    </Button>
                </Row>
            }
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
                        placeholder="III место на соревнованиях"
                        value={currentLanguage === "rus" ? degreeNames.name : degreeNames.nameKZ}
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
                            required: true,
                            message: <IntlMessage id="achievement.by.sport.type.select" />,
                        },
                    ]}
                    name="sport_type"
                >
                    <Select
                        options={reformattedSportTypes}
                        placeholder="Бокс"
                        showSearch
                        onPopupScroll={(e) => handlePopupScroll(e, "sport_degree")}
                        onSearch={(e) => handleSearch(e, "sport_degree")}
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
                            message: <IntlMessage id="service.data.modalAcademicDegree.dateGive" />,
                        },
                    ]}
                >
                    <DatePicker
                        style={{ width: "250px" }}
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
    );
};

export default ModalAllAchievementsEdit;

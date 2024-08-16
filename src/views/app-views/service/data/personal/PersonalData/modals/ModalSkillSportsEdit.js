import { InboxOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, message, Modal, Row, Select, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/personalInfoSlice";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import SportTypeService from "services/myInfo/SportTypeService";
import { disabledDate } from "utils/helpers/futureDateHelper";
import moment from "moment";
import "moment/locale/ru";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalSkillSportsEdit = ({ isOpen, onClose, degree, source = "get" }) => {
    const [file, setFile] = useState();
    const [filesChanged, setFilesChanged] = useState(false);
    const [reformattedSportTypes, setReformattedSportTypes] = useState([]);
    const [sportDegreeTypes, setSportDegreeTypes] = useState([]);

    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const { sport_degrees } = useSelector((state) => state.myInfo.edited.personal_data);
    const { sportDegrees, sportTypes } = useSelector((state) => state.sportTypes);

    useEffect(() => {
        if (!isOpen) return;

        const degreeOptions = generateOptions(sportDegrees);
        const typeOptions = generateOptions(sportTypes);

        setSportDegreeTypes(degreeOptions);
        setReformattedSportTypes(typeOptions);
    }, [isOpen]);

    const generateOptions = (data) => {
        const option = data.map((e) => {
            return { value: e.id, label: LocalText.getName(e), object: e };
        });

        return option;
    };

    useEffect(() => {
        form.resetFields();

        const values = {
            sport_degree: degree?.sport_degree_type_id,
            sport_type: degree?.sport_type_id,
            date: moment(degree?.assignment_date),
        };

        form.setFieldsValue(values);

        if (degree.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(degree.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [degree, form, isOpen]);

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
            if (!value || value.length === 0) {
                resolve();
            } else if (value.length > 1) {
                reject(<IntlMessage id="candidates.warning.singleFile" />);
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

    const handleOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged ? await handleFileUpload(values.dragger) : degree.document_link;
        const currentSportDegree = sportDegreeTypes.find(
            (item) => item.value === values.sport_degree,
        );
        const currentSportType = reformattedSportTypes.find(
            (item) => item.value === values.sport_type,
        );

        const EditedObject = {
            name: currentSportDegree.object.name,
            nameKZ: currentSportDegree.object.nameKZ,
            assignment_date: values.date.toDate(),
            sport_type_id: values.sport_type,
            document_link: link ?? null,
            id: degree.id,
            sport_type: currentSportType.object,
            sport_degree: currentSportDegree.object,
            sport_degree_type_id: values.sport_degree,
        };

        changeDispatchValues(EditedObject);
    };

    const changeDispatchValues = (obj) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "personalInfoData.sport_degrees",
                    id: degree.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                setFieldValue({
                    fieldPath: "edited.personal_data.sport_degrees",
                    value: [...sport_degrees, obj],
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.personal_data.sport_degrees",
                    id: degree.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.personal_data.sport_degrees",
                    id: degree.id,
                    newObj: obj,
                }),
            );
        }

        handleClose();
    };

    const onDelete = () => {
        changeDispatchValues({ delete: true, id: degree.id });
    };

    const handleClose = () => {
        form.resetFields();

        setFile(null);
        setFilesChanged(false);

        onClose();
    };

    return (
        <Modal
            // title="Редактировать навык владения спортом"
            title={<IntlMessage id="skill.sport.edit" />}
            open={isOpen}
            onCancel={onClose}
            onClick={(e) => e.stopPropagation()}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={handleClose}>
                        <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        <IntlMessage id={"service.data.modalAddPsycho.save"} />
                    </Button>
                </Row>
            }
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={
                        <span>
                            <IntlMessage id="skill.sport.name" />
                        </span>
                    }
                    name="sport_degree"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id="skill.sport.name.enter" />,
                        },
                    ]}
                >
                    <Select
                        options={sportDegreeTypes}
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        placeholder="Бокс"
                        showSearch
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
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
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
    );
};

export default ModalSkillSportsEdit;

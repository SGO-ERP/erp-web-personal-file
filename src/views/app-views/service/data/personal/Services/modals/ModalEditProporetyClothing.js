import { InboxOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, Input, Modal, Row, Select, Tag, message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledDate } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

// Тип формы - /type/clothing
const ModalEditPropertyClosing = ({ isOpen, onClose, source = "get", equipment }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [selectedTags, setSelectedTags] = useState([]);
    const [filesChanged, setFilesChanged] = useState(false);
    const clothing_equipments = useSelector((state) => state.services.clothingEquipments);
    const services_local = useSelector((state) => state.myInfo.allTabs.services);
    const services_edited = useSelector((state) => state.myInfo.edited.services);
    const allTabs_services_clothes = useSelector((state) => state.myInfo.allTabs.services.clothes);
    const formatted_clothing_equipments = clothing_equipments.map((item) => {
        return {
            value: item.id,
            label: item.name,
        };
    });

    const [tags, setTags] = useState([]);

    const handleTagClick = (tag) => {
        if (selectedTags.filter((currentTag) => currentTag.value === tag.value).length > 0) {
            setSelectedTags(selectedTags.filter((t) => t.value !== tag.value));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTypeChange = (e) => {
        const id = Array.isArray(e) ? e[0] : e;

        setSelectedTags([]);

        const currentTags =
            clothing_equipments.find((item) => item.id === id)?.type_cloth_eq_models || [];

        const formattedTags = currentTags.map((item) => ({
            value: item.id,
            label: LocalText.getName(item),
            names: { name: item.name, nameKZ: item.nameKZ },
        }));

        setTags(formattedTags);
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id={"service.data.modalAddPsycho.pleaseLoadFile"} />);
            } else if (value.length > 1) {
                reject(
                    <IntlMessage id={"service.data.modalEditPolygraphCheck.pleaseLoadOneFile"} />,
                );
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
        accept: ".pdf,.jpg,.jpeg, .png", // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
            const { status } = info.file;
            if (status === "done") {
                void message.success(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.successLoadFile"} />
                    )}`,
                );
            } else if (status === "error") {
                void message.error(
                    `${info.file.name} ${(
                        <IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile2"} />
                    )}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    function getOuterObject(objects, id) {
        for (let obj of objects) {
            for (let innerObj of obj.type_cloth_eq_models) {
                if (innerObj.id === id) {
                    return { id: obj.id, name: obj.name };
                }
            }
        }
        return null;
    }

    const onOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged
            ? await handleFileUpload(values.dragger)
            : equipment.document_link;

        const addClothingsToStore = async () => {
            const newObject = {
                type_of_equipment: "clothing_equipment",
                cloth_eq_models_id: values.model,
                cloth_eq_types_id: values.form_type,
                date_from: values.date.toDate(),
                document_link: link,
                id: equipment.id,
                clothing_size: values.size_clothing,
                cloth_eq_types_models: {
                    id: values.model,
                    type_of_equipment: {
                        id: values.form_type[0],
                        name: clothing_equipments.find((item) => item.id === values.form_type).name,
                        nameKZ: clothing_equipments.find((item) => item.id === values.form_type)
                            .nameKZ,
                    },
                    model_of_equipment: {
                        name: tags.find((item) => item.value === values.model).names.name,
                        nameKZ: tags.find((item) => item.value === values.model).names.nameKZ,
                    },
                },
            };

            if (source === "get") {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: "serviceData.equipments",
                        id: equipment.id,
                    }),
                );
                // Add to Edited slice
                dispatch(
                    addFieldValue({
                        fieldPath: "edited.services.clothes",
                        value: newObject,
                    }),
                );
            }

            if (source === "edited") {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: "edited.services.clothes",
                        id: equipment.id,
                        newObj: newObject,
                    }),
                );
            }

            if (source === "added") {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: "allTabs.services.clothes",
                        id: equipment.id,
                        newObj: newObject,
                    }),
                );
            }
        };

        await addClothingsToStore();
        setTags([]);
        setSelectedTags([]);
        setFilesChanged(false);
        form.resetFields();
        onClose();
    };

    const getFile = async (form) => {
        const file = await FileUploaderService.getFileByLink(equipment.document_link);
        form.setFieldsValue({
            dragger: [file],
        });
    };

    useEffect(() => {
        const outerObject = getOuterObject(clothing_equipments, equipment.cloth_eq_types_models.id);
        if (outerObject) {
            const currentTag = clothing_equipments
                .find((item) => item.id === outerObject.id)
                .type_cloth_eq_models.find(
                    (item) => item.id === equipment.cloth_eq_types_models.id,
                );

            //outerObject - hat, currentTag - hatType
            handleTypeChange([outerObject.id]);
            setSelectedTags([]);
            setSelectedTags([
                {
                    value: currentTag.id,
                    label: LocalText.getName(currentTag),
                },
            ]);
            const values = {
                date: moment(equipment.date_from),
                form_type: [equipment.cloth_eq_types_id],
                size_clothing: equipment.clothing_size,
                model: equipment.cloth_eq_models_id,
            };
            form.setFieldsValue(values);

            getFile(form);
        }
    }, [form, equipment, isOpen]);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить имущество'}
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
                            <IntlMessage id="Property.add" />
                        </span>
                        <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
            >
                <Form form={form} layout="vertical">
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="clothing.property.form.type" />
                                    </span>
                                }
                                name="form_type"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="clothing.property.form.type.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Select
                                    onChange={handleTypeChange}
                                    options={formatted_clothing_equipments}
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="service.data.modalTransport.marka" />
                                    </span>
                                }
                                name="model"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="clothing.property.date.select.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={tags}
                                    disabled={tags.length === 0 ? true : false}
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="myData.equipment.size.duffel" />
                                    </span>
                                }
                                name="size_clothing"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="clothing.property.date.select.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="clothing.property.date.select" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="clothing.property.date.select.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalAcademicDegree.dateGiveTxt",
                                    })}
                                    format="DD-MM-YYYY"
                                    name="date"
                                    style={{ width: "100%" }}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={
                            <span style={{ fontSize: "14px" }}>
                                <IntlMessage id="Property.weapon.delivery" />
                            </span>
                        }
                    >
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                        >
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    <IntlMessage id="service.data.modalAddPsycho.clickFileToLoad" />
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalEditPropertyClosing;

import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import IntlMessage, {
    IntlMessageText,
} from "../../../../../../../components/util-components/IntlMessage";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import { disabledDate } from "../../../../../../../utils/helpers/futureDateHelper";
import LocalizationText from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import { deleteByPath } from "../../../../../../../store/slices/myInfo/servicesSlice";
import { addFieldValue, replaceByPath } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalEditClothes = ({ isOpen, onClose, source = "get", equipment }) => {
    const [form] = Form.useForm();
    const [filesChanged, setFilesChanged] = useState(false);
    const dispatch = useDispatch();
    const clothing_equipments = useSelector((state) => state.services.clothingEquipments);
    const [tags, setTags] = useState([]);
    const formatted_clothing_equipments = clothing_equipments?.objects?.map((item) => {
        return {
            value: item.id,
            label: item.name,
            nameKZ: item.nameKZ,
        };
    });

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
    const onOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged
            ? await handleFileUpload(values.dragger)
            : equipment.document_link;

        const cloth_eq_models_id = !Object.hasOwnProperty.call(values.model, "value")
            ? values.model
            : values.model.value;
        const cloth_eq_types_id = !Object.hasOwnProperty.call(values.form_type, "value")
            ? values.form_type
            : values.form_type.value;

        const newObject = {
            type_of_equipment: "clothing_equipment",
            cloth_eq_models_id: cloth_eq_models_id,
            cloth_eq_types_id: cloth_eq_types_id,
            date_from: values.date.toDate(),
            document_link: link,
            clothing_size: values.size_clothing,
            cloth_eq_types_models: {
                id: cloth_eq_models_id,
                type_of_equipment: {
                    id: cloth_eq_types_id,
                    name: formatted_clothing_equipments.find(
                        (item) => item.value === cloth_eq_types_id,
                    ).label,
                    nameKZ: formatted_clothing_equipments.find(
                        (item) => item.value === cloth_eq_types_id,
                    ).nameKZ,
                },
                model_of_equipment: {
                    name: tags.find((item) => item.value === cloth_eq_models_id).label,
                    nameKZ: tags.find((item) => item.value === cloth_eq_models_id).nameKZ,
                },
            },
            id: equipment.id,
        };
        if (source === "get") {
            // Delete from GET slice
            await dispatch(
                deleteByPath({
                    path: "serviceData.equipments",
                    id: equipment.id,
                }),
            );
            // Add to Edited slice
            await dispatch(
                addFieldValue({
                    fieldPath: "edited.services.clothes",
                    value: newObject,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            await dispatch(
                replaceByPath({
                    path: "edited.services.clothes",
                    id: equipment.id,
                    newObj: newObject,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            await dispatch(
                replaceByPath({
                    path: "allTabs.services.clothes",
                    id: equipment.id,
                    newObj: newObject,
                }),
            );
        }
        form.resetFields();
        onClose();
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

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

    useEffect(() => {
        const date = moment(equipment.date_from);
        const currentTags = clothing_equipments?.objects?.filter(
            (item) =>
                item.id ===
                formatted_clothing_equipments.find(
                    (item) => item.label === equipment.cloth_eq_types_models.type_of_equipment.name,
                ).value,
        )[0].type_cloth_eq_models;
        const formattedTags = currentTags.map((item) => {
            return {
                value: item.id,
                label: item.name,
                nameKZ: item.nameKZ,
            };
        });

        const values = {
            date: date,
            size_clothing: equipment.clothing_size,
            model: {
                value: formattedTags.find(
                    (item) =>
                        item.label === equipment.cloth_eq_types_models.model_of_equipment.name,
                ).value,
                label: (
                    <LocalizationText text={equipment.cloth_eq_types_models.model_of_equipment} />
                ),
            },
            form_type: {
                value: formatted_clothing_equipments.find(
                    (item) => item.label === equipment.cloth_eq_types_models.type_of_equipment.name,
                ).value,
                label: (
                    <LocalizationText text={equipment.cloth_eq_types_models.type_of_equipment} />
                ),
            },
        };

        setTags(formattedTags);

        form.setFieldsValue(values);
        if (equipment.document_link) {
            const getFile = async () => {
                const file = await FileUploaderService.getFileByLink(equipment.document_link);
                form.setFieldsValue({
                    dragger: [file],
                });
            };
            getFile();
        }
    }, [form, equipment]);

    const handleTypeChange = (e) => {
        const currentTags = clothing_equipments?.objects?.filter((item) => item.id === e)[0]
            .type_cloth_eq_models;
        const formattedTags = currentTags.map((item) => {
            return {
                value: item.id,
                label: item.name,
                nameKZ: item.nameKZ,
            };
        });
        setTags(formattedTags);
        const newObj = {
            model: null,
        };
        form.setFieldsValue(newObj);
    };

    const closeAndClear = () => {
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    const onDelete = () => {
        changeDispatchValues({ id: equipment.id, delete: true });
        closeAndClear();
    };

    const changeDispatchValues = (obj) => {
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
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.clothes",
                    id: equipment.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.clothes",
                    id: equipment.id,
                    newObj: obj,
                }),
            );
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
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
                footer={
                    <Row justify="end">
                        <Button danger onClick={onDelete}>
                            <IntlMessage id={"initiate.deleteAll"} />
                        </Button>
                        <Button onClick={closeAndClear}>
                            <IntlMessage id={"service.data.modalAddPsycho.cancel"} />
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            <IntlMessage id={"service.data.modalAddPsycho.save"} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout={"vertical"}>
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
                                message: <IntlMessage id="clothing.property.form.type.enter" />,
                            },
                        ]}
                        required
                    >
                        <Select
                            onChange={handleTypeChange}
                            options={formatted_clothing_equipments}
                        />
                    </Form.Item>
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
                                message: <IntlMessage id="clothing.property.date.select.enter" />,
                            },
                        ]}
                        required
                    >
                        <Select options={tags} disabled={tags.length === 0} />
                    </Form.Item>
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
                                message: <IntlMessage id="clothing.property.date.select.enter" />,
                            },
                        ]}
                        required
                    >
                        <Input />
                    </Form.Item>
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
                                message: <IntlMessage id="clothing.property.date.select.enter" />,
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
                    <Form.Item
                        name="dragger"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        noStyle
                        rules={[{ validator: validateFileList }]}
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
                </Form>
            </Modal>
        </div>
    );
};

export default ModalEditClothes;

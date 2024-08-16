import { InboxOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledDate } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { addFieldValue, replaceByPath } from "store/slices/myInfo/myInfoSlice";
import { deleteByPath } from "store/slices/myInfo/servicesSlice";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const ModalEditPropertyAnother = ({ isOpen, onClose, source = "get", equipment }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const other_equipments = useSelector((state) => state.services.otherEquipments);
    const formatted_equipments = other_equipments?.objects?.map((equipment) => ({
        value: equipment.id,
        label: equipment.name,
        nameKZ: equipment.nameKZ,
    }));
    const [models, setModels] = React.useState([]);
    const [filesChanged, setFilesChanged] = React.useState(false);

    const handleEquipmentTypeChange = (e) => {
        const models = other_equipments?.objects?.find(
            (item) => item.id === e[0],
        ).type_of_other_equipment_models;
        if (models.length === 0) {
            form.setFieldValue("equipment_name", null);
        }
        const formatted_models = models.map((item) => {
            return {
                value: item.id,
                label: item.name,
                nameKZ: item.nameKZ,
            };
        });
        setModels(formatted_models);
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            resolve();
        });
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

    const onOk = async () => {
        const values = await form.validateFields();
        const link = filesChanged
            ? await handleFileUpload(values.dragger)
            : equipment.document_link;
        const newObject = {
            id: equipment.id,
            inventory_number: values.property_number,
            type_of_other_equipment_model_id: values.model,
            date_from: values.date.toDate(),
            document_link: link,
            type_of_equipment: "other_equipment",
            // view only
            type_of_other_equipment_model: models
                .map((item) => {
                    return {
                        id: item.value,
                        name: item.label,
                        nameKZ: item.nameKZ,
                        type_of_equipment: {
                            name: formatted_equipments.find(
                                (item) => item.value === values.property_type,
                            ).label,
                            nameKZ: formatted_equipments.find(
                                (item) => item.value === values.property_type,
                            ).namKZ,
                        },
                    };
                })
                .find((item) => item.id === values.model),
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
                    fieldPath: "edited.services.others",
                    value: newObject,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.others",
                    id: equipment.id,
                    newObj: newObject,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.others",
                    id: equipment.id,
                    newObj: newObject,
                }),
            );
        }
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    function getOuterObject(objects, id) {
        for (let obj of objects) {
            for (let innerObj of obj.type_of_other_equipment_models) {
                if (innerObj.id === id) {
                    return { id: obj.id, name: obj.name };
                }
            }
        }
        return null;
    }

    useEffect(() => {
        form.resetFields();
        const outerObjectId = getOuterObject(
            other_equipments?.objects,
            equipment.type_of_other_equipment_model_id,
        ).id;
        handleEquipmentTypeChange([outerObjectId]);
        const values = {
            date: moment(equipment.date_from),
            property_number: equipment.inventory_number,
            property_type: outerObjectId,
            model: other_equipments?.objects
                ?.find((item) => item.id === outerObjectId)
                .type_of_other_equipment_models.find(
                    (item) => item.id === equipment.type_of_other_equipment_model.id,
                ).id,
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(equipment.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [equipment, form]);

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
                    fieldPath: "edited.services.others",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.others",
                    id: equipment.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.others",
                    id: equipment.id,
                    newObj: obj,
                }),
            );
        }
    };

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
                onCancel={closeAndClear}
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
                <Form form={form} layout="vertical">
                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="another.property.type" />
                                    </span>
                                }
                                name="property_type"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="another.property.type.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={formatted_equipments}
                                    onChange={handleEquipmentTypeChange}
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="another.property.invent.number" />
                                    </span>
                                }
                                name="property_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="another.property.invent.number.enter" />
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
                                            <IntlMessage id="service.data.modalTransport.chooseMark" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={models}
                                    disabled={models.length === 0}
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
                        <Col xs={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="another.property.date.provide" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="another.property.date.provide.enter" />
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
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalEditPropertyAnother;

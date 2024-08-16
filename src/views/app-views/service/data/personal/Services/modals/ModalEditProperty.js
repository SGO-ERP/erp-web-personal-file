import { InboxOutlined } from "@ant-design/icons";
import { Select, Col, DatePicker, Form, Input, Modal, Row, message, Button } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import moment from "moment";
import React, { useEffect, useState } from "react";
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

// [
//     {
//         value: 'army_equipment',
//         label: 'Вооружение',
//     },
//     {
//         value: 'clothing_equipment',
//         label: 'Вещевое',
//     },
//     {
//         value: 'other_equipment',
//         label: 'Иное',
//     },
// ]

const ModalEditProperty = ({ isOpen, onClose, source = "get", equipment }) => {
    const [form] = Form.useForm();
    const army_equipments = useSelector((state) => state.services.armyEquipments);
    const formatted_army_equipments = army_equipments?.objects?.map((item) => {
        return {
            value: item.id,
            label: LocalText.getName(item),
        };
    });

    const [weapons, setWeapons] = useState([]);
    const [filesChanged, setFilesChanged] = useState(false);
    const dispatch = useDispatch();
    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };
    const handleArmyEquipmentChange = (e) => {
        const weapons = army_equipments?.objects?.find(
            (item) => item.id === e[0],
        )?.type_of_army_equipment_models;
        if (weapons.length === 0) {
            form.setFieldValue("equipment_name", null);
        }
        const formatted_weapons = weapons.map((item) => {
            return {
                value: item.id,
                label: item.name,
            };
        });
        setWeapons(formatted_weapons);
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
        if (!fileList || fileList.length === 0) {
            return null;
        }
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
        onRemove: handleFileRemove,
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
            type_of_equipment: "army_equipment",
            type_of_army_equipment_model_id: values.equipment_name,
            inventory_number: values.equipment_number,
            count_of_ammo: +values.ammo,
            date_from: values.date.toDate(),
            document_link: link,
            id: equipment.id,
            type_of_army_equipment_model: {
                id: values.equipment_name,
                name: weapons.find((item) => item.value === values.equipment_name).label,
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
                    fieldPath: "edited.services.weapons",
                    value: newObject,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.weapons",
                    id: equipment.id,
                    newObj: newObject,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.weapons",
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
            for (let innerObj of obj.type_of_army_equipment_models) {
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
            army_equipments?.objects,
            equipment.type_of_army_equipment_model?.id,
        ).id;
        handleArmyEquipmentChange([outerObjectId]);
        const values = {
            date: moment(equipment.date_from),
            ammo: equipment.count_of_ammo,
            equipment_number: equipment.inventory_number,
            equipment_type: [outerObjectId],
            equipment_name: [
                army_equipments?.objects
                    ?.find((item) => item.id === outerObjectId)
                    .type_of_army_equipment_models.find(
                        (item) => item.id === equipment.type_of_army_equipment_model.id,
                    ).id,
            ],
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
                    fieldPath: "edited.services.weapons",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.services.weapons",
                    id: equipment.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.services.weapons",
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
                onCancel={onClose}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
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
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="Property.weapon.type" />
                                    </span>
                                }
                                name="equipment_type"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="Property.weapon.type.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={formatted_army_equipments}
                                    onChange={handleArmyEquipmentChange}
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

                    <Row gutter={8}>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="name.arrarments" />
                                    </span>
                                }
                                name="equipment_name"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="Property.weapon.name.enter" />,
                                    },
                                ]}
                                required
                            >
                                <Select
                                    options={weapons}
                                    disabled={weapons.length === 0}
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
                                        <IntlMessage id="Property.weapon.invent.num" />
                                    </span>
                                }
                                name="equipment_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="Property.weapon.invent.num.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Col xs={12} style={{ marginTop: "21px" }}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="Property.weapon.give.date" />
                                    </span>
                                }
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="Property.weapon.give.date.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: "service.data.modalTransport.dateBuy",
                                    })}
                                    format="DD-MM-YYYY"
                                    name="date"
                                    style={{ width: "100%" }}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: "14px" }}>
                                        <IntlMessage id="Property.weapon.maximum.patron" />
                                    </span>
                                }
                                name="ammo"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="Property.weapon.maximum.patron.enter" />
                                        ),
                                    },
                                ]}
                                required
                            >
                                <Input />
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
export default ModalEditProperty;

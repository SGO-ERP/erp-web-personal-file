import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import {
    Select,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Row,
    Spin,
    Divider,
    Space,
    Button,
    notification
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledDate } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import { addFieldValue } from "store/slices/myInfo/myInfoSlice";
import uuidv4 from "utils/helpers/uuid";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import EducationService from "../../../../../../../services/myInfo/EducationService";
import ServicesService from "../../../../../../../services/myInfo/ServicesService";
import SportTypeService from "../../../../../../../services/myInfo/SportTypeService";
import AdditionalService from "../../../../../../../services/myInfo/AdditionalService";
import CoolnessService from "../../../../../../../services/myInfo/CoolnessService";
import SelectPickerMenuService from "../../../../../../../services/myInfo/SelectPickerMenuService";
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

const ModalAddProperty = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [weapons, setWeapons] = useState([]);
    const [newValues, setNewValues] = useState({ name: "", nameKZ: "" });
    const [armyEquipments, setArmyEquipments] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});
    const [armyEquipmentsId, setArmyEquipmentsId] = useState(null);

    const dispatch = useDispatch();
    const inputRef = useRef();



    const handleArmyEquipmentChange = (e) => {
        if (e) {
            setArmyEquipmentsId(e);
            const weapons = armyEquipments.find(
                (item) => item.object.id === e,
            ).object.type_of_army_equipment_models;
            // if (weapons.length === 0) {
            //     form.setFieldValue("equipment_name", null);
            // }
            const formatted_weapons = weapons.map((item) => {
                return {
                    value: item.id,
                    label: item.name,
                    object: item
                };
            });
            setWeapons(formatted_weapons);
        } else {
            setWeapons([]);
        }
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

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e,type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
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
        const response = await handleFileUpload(values.dragger);
        const newObject = {
            type_of_equipment: "army_equipment",
            type_of_army_equipment_model_id: values.equipment_name,
            // only for view
            type_of_army_equipment_model: weapons
                .map((item) => {
                    return {
                        id: item.value,
                        name: item.label,
                    };
                })
                .find((item) => item.id === values.equipment_name),
            inventory_number: values.equipment_number,
            count_of_ammo: +values.ammo,
            date_from: values.date.toDate(),
            document_link: response,
            id: uuidv4(),
        };
        dispatch(
            addFieldValue({
                fieldPath: "allTabs.services.weapons",
                value: newObject,
            }),
        );
        form.resetFields();
        onCancel();
    };

    const valuesChange = (event, lang) => {
        setNewValues({
            ...newValues,
            [lang === "ru" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const onCancel = () => {
        form.resetFields();
        setArmyEquipmentsId(null);
        onClose();
    };

    const handleAddNewOption = async (type) => {
        setLoading(true);
            try {
                if (type === "type") {
                    const body = {
                        name: newValues.name,
                        nameKZ: newValues.nameKZ
                    };

                    const response = await ServicesService.create_type_army(body);

                    setArmyEquipments((prevData) => [
                        ...prevData,
                        { value: response.id, label: LocalText.getName(response), object: response },
                    ]);
                    inputRef.current?.focus();
                } else if (type === "modal") {
                    const body = {
                        name: newValues.name,
                        nameKZ: newValues.nameKZ,
                        type_of_army_equipment_id: armyEquipmentsId
                    };

                    const response = await ServicesService.create_modal_army(body);

                    setWeapons((prevData) => [
                        ...prevData,
                        { value: response.id, label: LocalText.getName(response), object: response },
                    ]);
                    inputRef.current?.focus();
                }
            } catch (error) {
                console.log(error);
                notification.error({
                    message: <IntlMessage id={"error.from.backend"} />,
                });
            } finally {
                setNewValues({ name: "", nameKZ: "" });
                setLoading(false);
            }
    };

    const fetchOptions = async () => {
        const army_equipments = await fetchOptionsData(
            "/equipments/type/army/",
            "army_equipments",
        );

        setArmyEquipments(army_equipments);
    };

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

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
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
                    </div>
                }
                open={isOpen}
                onCancel={onCancel}
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
                                    options={armyEquipments}
                                    onChange={handleArmyEquipmentChange}
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    onPopupScroll={(e) => handlePopupScroll(e, "army_equipments")}
                                    onSearch={(e) => handleSearch(e, "army_equipments")}
                                    dropdownRender={(menu) => (
                                        <Spin spinning={loading}>
                                            {menu}
                                            <Divider style={{ margin: "8px 0" }} />
                                            <Space style={{ padding: "0 8px 4px" }}>
                                                <Row>
                                                    {["ru", "kz"].map((lang, idx) => (
                                                        <Input
                                                            key={lang}
                                                            ref={inputRef}
                                                            value={lang === "ru" ? newValues.name : newValues.nameKZ}
                                                            onChange={(e) => valuesChange(e, lang)}
                                                            placeholder={IntlMessageText.getText({
                                                                id: `userData.modals.add.type.${lang}`,
                                                            })}
                                                            style={{
                                                                ...(idx !== 0 ? { marginTop: 10 } : {}),
                                                            }}
                                                        />
                                                    ))}
                                                </Row>
                                                <Row align="top" className="fam_select_add_button">
                                                    <Button
                                                        type="text"
                                                        icon={<PlusOutlined />}
                                                        onClick={(e)=>handleAddNewOption('type')}
                                                        disabled={
                                                            newValues.name.trim() === "" || newValues.nameKZ.trim() === ""
                                                        }
                                                    >
                                                        <IntlMessage id="select.picker.menu.add" />
                                                    </Button>
                                                </Row>
                                            </Space>
                                        </Spin>
                                    )}
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
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    dropdownRender={(menu) => (
                                        <Spin spinning={loading}>
                                            {menu}
                                            <Divider style={{ margin: "8px 0" }} />
                                            <Space style={{ padding: "0 8px 4px" }}>
                                                <Row>
                                                    {["ru", "kz"].map((lang, idx) => (
                                                        <Input
                                                            key={lang}
                                                            ref={inputRef}
                                                            value={lang === "ru" ? newValues.name : newValues.nameKZ}
                                                            onChange={(e) => valuesChange(e, lang)}
                                                            placeholder={IntlMessageText.getText({
                                                                id: `userData.modals.add.type.${lang}`,
                                                            })}
                                                            style={{
                                                                ...(idx !== 0 ? { marginTop: 10 } : {}),
                                                            }}
                                                        />
                                                    ))}
                                                </Row>
                                                <Row align="top" className="fam_select_add_button">
                                                    <Button
                                                        type="text"
                                                        icon={<PlusOutlined />}
                                                        onClick={(e) => handleAddNewOption('modal')}
                                                        disabled={
                                                            newValues.name.trim() === "" || newValues.nameKZ.trim() === ""
                                                        }
                                                    >
                                                        <IntlMessage id="select.picker.menu.add" />
                                                    </Button>
                                                </Row>
                                            </Space>
                                        </Spin>
                                    )}
                                    disabled={armyEquipmentsId===null}
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
export default ModalAddProperty;

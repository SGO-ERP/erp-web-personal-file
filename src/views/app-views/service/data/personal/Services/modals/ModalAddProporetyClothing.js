import {InboxOutlined, PlusOutlined} from "@ant-design/icons";
import {
    Button,
    Cascader,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal, notification,
    Row,
    Select,
    Space,
    Spin,
    Tag
} from "antd";
import Dragger from "antd/lib/upload/Dragger";
import React, {useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledDate } from "utils/helpers/futureDateHelper";
import LanguageSwitcher from "../../../../../../../components/shared-components/LanguageSwitcher";
import FileUploaderService from "../../../../../../../services/myInfo/FileUploaderService";
import { addFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
import uuidv4 from "../../../../../../../utils/helpers/uuid";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import ServicesService from "../../../../../../../services/myInfo/ServicesService";
import {LocalText} from "../../../../../../../components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "../../../../../../../services/myInfo/SelectPickerMenuService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

// Тип формы - /type/clothing
const ModalAddPropertyClosing = ({ isOpen, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [newValues, setNewValues] = useState({ name: "", nameKZ: "" });
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [maxCount, setMaxCount] = useState(0);
    const [searchText, setSearchText] = useState({});
    const [clothingEquipmentsId, setClothingEquipmentsId] = useState(null);
    const [clothingEquipments,setClothingEquipments] = useState([]);
    const [modalIds,setModalsId] = useState([]);

    // const all_available = useSelector((state) => state.services.allAvailable);
    const [tags, setTags] = useState([]);
    const [modals,setModals] = useState([]);
    const inputRef = useRef();

    const handleTypeChange = (e) => {
        if (e) {
            setClothingEquipmentsId(e);
            const currentTags = clothingEquipments?.find((item) => item.object.id === e)
                .object.type_cloth_eq_models;
            const formattedTags = currentTags.map((item) => {
                return {
                    value: item.id,
                    label: item.name,
                    nameKZ: item.nameKZ,
                    object: item
                };
            });
            setTags(formattedTags);
        } else {
            setTags([]);
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

    const onOk = async () => {
        const values = await form.validateFields();
        const response = await handleFileUpload(values.dragger);

        const addClothingsToStore = async () => {
            const newObject = {
                type_of_equipment: "clothing_equipment",
                cloth_eq_models_id: values.model,
                cloth_eq_types_id: values.form_type,
                date_from: values.date.toDate(),
                document_link: response,
                id: uuidv4(),
                clothing_size: values.size_clothing,
                cloth_eq_types_models: {
                    id: values.model,
                    type_of_equipment: {
                        id: values.form_type,
                        name: clothingEquipments.find(
                            (item) => item.value === values.form_type,
                        ).label,
                        nameKZ: clothingEquipments.find(
                            (item) => item.value === values.form_type,
                        ).nameKZ,
                    },
                    model_of_equipment: {
                        name: tags.find((item) => item.value === values.model).label,
                        nameKZ: tags.find((item) => item.value === values.model).nameKZ,
                    },
                },
            };

            dispatch(
                addFieldValue({
                    fieldPath: "allTabs.services.clothes",
                    value: newObject,
                }),
            );
        };

        await addClothingsToStore();
        setTags([]);
        form.resetFields();
        onClose();
    };

    const onCancel = () => {
        form.resetFields();
        setTags([]);
        onClose();
    };

    const valuesChange = (event, lang) => {
        setNewValues({
            ...newValues,
            [lang === "ru" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    useEffect(() => {
       const info = async () => {
           const res = await ServicesService.get_modal();
           const formattedTags = res.map((item) => {
               return {
                   value: item.id,
                   label: item.name,
                   object: item
               };
           });
           setModals(formattedTags);
       }
       info();
    },[]);

    const handleAddNewOption = async (type) => {
        setLoading(true);
        try {
            if (type === "modal") {
                const body = {
                    name: newValues.name,
                    nameKZ: newValues.nameKZ
                };

                const response = await ServicesService.create_modal_clothing(body);

                const find = clothingEquipments.find((item) => item.object.id === clothingEquipmentsId).object;

                const body_clothingIds = {
                    name: find.name,
                    nameKZ: find.nameKZ,
                    model_ids: [response.id]
                };

                 await ServicesService.create_type_clothing(body_clothingIds);


                setTags((prevData) => [
                    ...prevData,
                    { value: response.id, label: LocalText.getName(response), object: response },
                ]);
                inputRef.current?.focus();
            } else if (type === "type") {
                const body = {
                    name: newValues.name,
                    nameKZ: newValues.nameKZ,
                    model_ids: modalIds
                };

                const response = await ServicesService.create_type_clothing(body);

                setClothingEquipments((prevData) => [
                    ...prevData,
                    { value: response.id, label: LocalText.getName(response), object: response },
                ]);

                modalIds.forEach(id => {
                    // Используем find для поиска объекта с нужным идентификатором
                    const foundObject = modals.find(obj => obj.object.id === id).object;

                    // Если объект найден, добавляем его в Set
                    if (foundObject) {
                        setTags((prevData) => [
                            ...prevData,
                            { value: foundObject.id, label: LocalText.getName(foundObject), object: foundObject },
                        ]);
                    }
                });
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
            "/equipments/type/clothing/",
            "clothing_equipments",
        );

        setClothingEquipments(army_equipments);
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
    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={<IntlMessage id="Property.add" />}
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
                                    options={clothingEquipments}
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    onPopupScroll={(e) => handlePopupScroll(e, "clothing_equipments")}
                                    onSearch={(e) => handleSearch(e, "clothing_equipments")}
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
                                                    <Select
                                                     mode={'multiple'}
                                                     options={modals}
                                                     onChange={(e) =>setModalsId(e)}
                                                     style={{marginTop:'10px'}}
                                                    />
                                                </Row>
                                                <Row align="top" className="fam_select_add_button">
                                                    <Button
                                                        type="text"
                                                        icon={<PlusOutlined />}
                                                        onClick={(e) => handleAddNewOption('type')}
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
                                    showSearch
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    disabled={clothingEquipmentsId===null}
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
                        <Col xs={24}>
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
export default ModalAddPropertyClosing;

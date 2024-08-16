import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, Input, Row, Select, Space, Spin, notification, Form } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import React, { useRef, useState } from "react";
import AdditionalService from "services/myInfo/AdditionalService";
import EducationService from "services/myInfo/EducationService";
import ServicesService from "services/myInfo/ServicesService";
import SportTypeService from "services/myInfo/SportTypeService";
import CoolnessService from "services/myInfo/CoolnessService";

const SelectPickerMenu = ({
    options,
    type,
    setValue,
    values,
    currentOptions,
    placeholder,
    setUpdate,
}) => {
    const [loading, setLoading] = useState(false);
    const [newValues, setNewValues] = useState({ name: "", nameKZ: "" });
    const [order, setOrder] = useState(null);
    const inputRef = useRef();
    const [form] = Form.useForm();

    const handleAddNewOption = async (e) => {
        e.preventDefault();
        setLoading(true);

        const endpointMap = {
            institution: EducationService.post_add_institution,
            institutionMilitary: EducationService.post_add_institution_military,
            degree: EducationService.create_institution_degree_types,
            specialization: EducationService.create_specialties,
            course_provider: EducationService.create_course_provider,
            name_language: EducationService.create_language,
            degree_academic: EducationService.create_academic_degree_types,
            science: EducationService.create_sciences,
            degree_title: EducationService.create_academic_title_degree,
            penalty: ServicesService.create_penalty,
            status_holiday: ServicesService.create_status_leave_type,
            military: ServicesService.create_military_units,
            sport_degree: SportTypeService.create_sport_degree_type,
            sport_type: SportTypeService.create_document_staff_type,
            type_id: AdditionalService.create_property_type,
            vehicle_type: AdditionalService.create_vehicle_types,
            destination_country_id: AdditionalService.create_country,
            coolness_type: CoolnessService.create_coolness_type,
        };

        const endpoint = endpointMap[type];

        if (endpoint) {
            try {
                const order_coolness = type === "coolness_type" && { order: order };

                const response = await endpoint({
                    name: newValues.name,
                    nameKZ: newValues.nameKZ,
                    ...order_coolness,
                });

                currentOptions((prevData) => [
                    ...prevData,
                    { value: response.id, label: LocalText.getName(response), object: response },
                ]);

                inputRef.current?.focus();
            } catch (error) {
                console.log(error);
                notification.error({
                    message: <IntlMessage id={"error.from.backend"} />,
                });
            } finally {
                setNewValues({ name: "", nameKZ: "" });
                setOrder(null);
                form.resetFields();
                setLoading(false);
                setUpdate(true);
            }
        }
    };

    const valuesChange = (event, lang) => {
        setNewValues({
            ...newValues,
            [lang === "ru" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const valuesOrderChange = (event) => {
        setOrder(event?.target?.value);
    };

    const handleSelect = (id) => {
        setValue({ ...values, [type]: id });
    };

    return (
        <Select
            placeholder={<IntlMessage id={placeholder} />}
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
                            {type === "coolness_type" && (
                                <Form form={form} layout={"vertical"}>
                                    <Form.Item name={"order"}>
                                        <Input
                                            onChange={(e) => valuesOrderChange(e)}
                                            placeholder={IntlMessageText.getText({
                                                id: `order.add.coolness`,
                                            })}
                                            style={{
                                                ...{ marginTop: 10 },
                                            }}
                                            type={"number"}
                                        />
                                    </Form.Item>
                                </Form>
                            )}
                        </Row>
                        <Row align="top" className="fam_select_add_button">
                            <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={handleAddNewOption}
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
            onChange={handleSelect}
            options={options}
            filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            showSearch
        />
    );
};

export default SelectPickerMenu;

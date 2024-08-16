import { Button, Divider, Form, Input, notification, Row, Select, Space, Spin } from "antd";
import CoolnessService from "services/myInfo/CoolnessService";
import { PlusOutlined } from "@ant-design/icons";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { useRef, useState } from "react";

const SelectPickerMenuCoolness = ({
    form,
    index,
    options,
    type,
    setValue,
    values,
    setScrollingLength,
    scrollingLength,
    maxCount,
    setSearchText,
    currentOptions,
    placeholder,
}) => {
    const [loading, setLoading] = useState(false);
    const [newValues, setNewValues] = useState({ name: "", nameKZ: "" });
    const [order, setOrder] = useState(null);
    const inputRef = useRef();
    const [formOrder] = Form.useForm();

    const handleAddNewOption = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await CoolnessService.create_coolness_type({
                name: newValues.name,
                nameKZ: newValues.nameKZ,
                order: order,
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
            formOrder.resetFields();
            setLoading(false);
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

    const loadMoreOptions = () => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions();
        }
    };

    return (
        <Form form={form} layout="vertical">
            <Form.Item
                name={`coolness_form_${index}`}
                rules={[
                    {
                        message: <IntlMessage id={"personal.coolness.degree.enter"} />,
                        required: true,
                    },
                ]}
            >
                <Select
                    placeholder={<IntlMessage id={placeholder} />}
                    dropdownRender={(menu) => (
                        <Spin spinning={loading}>
                            {menu}
                            <Divider style={{ margin: "8px 0" }} />
                            <Space style={{ padding: "0 8px 4px" }}>
                                <Row justify="center">
                                    {["ru", "kz"].map((lang, idx) => (
                                        <Input
                                            key={lang}
                                            ref={inputRef}
                                            value={
                                                lang === "ru" ? newValues.name : newValues.nameKZ
                                            }
                                            onChange={(e) => valuesChange(e, lang)}
                                            placeholder={IntlMessageText.getText({
                                                id: `userData.modals.add.type.${lang}`,
                                            })}
                                            style={{
                                                ...(idx !== 0 ? { marginTop: 10 } : {}),
                                            }}
                                        />
                                    ))}
                                    <Form
                                        form={formOrder}
                                        layout={"vertical"}
                                        style={{
                                            width: "105%",
                                            height: 52,
                                        }}
                                    >
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
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddNewOption}
                                        disabled={
                                            newValues.name.trim() === "" ||
                                            newValues.nameKZ.trim() === "" ||
                                            (order && order.trim() === "")
                                        }
                                        style={{ marginTop: 10, width: "100%" }}
                                    >
                                        <IntlMessage id="select.picker.menu.add" />
                                    </Button>
                                </Row>
                            </Space>
                        </Spin>
                    )}
                    onChange={handleSelect}
                    onPopupScroll={handlePopupScroll}
                    options={options}
                    filterOption={(inputValue, option) =>
                        option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                    }
                    showSearch
                    onSearch={(value) =>
                        setSearchText((prevData) => ({ ...prevData, [type]: value }))
                    }
                />
            </Form.Item>
        </Form>
    );
};

export default SelectPickerMenuCoolness;

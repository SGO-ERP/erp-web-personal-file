import { Spin, Select, Divider, Space, Row, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const defaultValues = {
    kz: "",
    ru: "",
};
const languages = Object.keys(defaultValues);
export const SelectPickerMenu = ({
    options,
    defaultValue = null,
    value,
    onChange,
    optionsLoading,
    handleAddNewOption,
    ...props
}) => {
    const { t } = useTranslation();

    const [values, setValues] = useState(defaultValues);

    const handleValuesChange = (event, language) => {
        setValues((prev) => ({ ...prev, [language]: event.target.value }));
    };

    const handleButtonClick = () => {
        handleAddNewOption(values);
        setValues(defaultValues);
    };

    return optionsLoading ? (
        <Spin spinning={true} />
    ) : (
        <Select
            value={value}
            defaultValue={defaultValue}
            options={options}
            onChange={onChange}
            filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            showSearch
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space style={{ padding: "4px 8px" }}>
                        <Row>
                            {languages.map((lang, idx) => (
                                <Input
                                    key={lang}
                                    value={values[lang]}
                                    onChange={(e) => handleValuesChange(e, lang)}
                                    placeholder={t(`userData.modals.add.type.${lang}`)}
                                    style={
                                        idx !== 0
                                            ? {
                                                  marginTop: 10,
                                              }
                                            : {}
                                    }
                                />
                            ))}
                        </Row>
                        <Row align="top" className="fam_select_add_button">
                            <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={handleButtonClick}
                                disabled={Object.values(values).some((value) => !value)}
                            >
                                {t("select.picker.menu.add")}
                            </Button>
                        </Row>
                    </Space>
                </>
            )}
            style={{ width: "100%" }}
            {...props}
        />
    );
};

import React, { useEffect, useState } from "react";

import { Form, Input, message, Modal, notification, Radio, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { InboxOutlined } from "@ant-design/icons";
import Dragger from "antd/lib/upload/Dragger";

import IntlMessage, {
    IntlMessageText,
} from "../../../../../../components/util-components/IntlMessage";
import { LocalText } from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import {
    createAcademicDegree,
    createAcademicTitle,
    createBadge,
    createBirthPlaces,
    createCitizenship,
    createCity,
    createClothingModel,
    createClothingType,
    createCountry,
    createCourse,
    createIllness,
    createInstitution,
    createInstitutionDegree,
    createLanguage,
    createLiberation,
    createMilitaryInstitution,
    createNationalities,
    createOtherModel,
    createOtherType,
    createPenalty,
    createPosition,
    createProperty,
    createRank,
    createRegion,
    createScience,
    createSpecialty,
    createSport,
    createSportDegreeType,
    createStatus,
    createViolation,
    createWeaponModel,
    createWeaponType,
    generateAdditionalOptions,
    generateCategoryOption,
    generateFormOption,
    generateModelsOption,
    generateRankOption,
} from "./utils/AddModalFunctions";
import HandleFileUpload from "../utils/HandleFileUpload";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const namesBadgeOrders = {
    defaultMedal: { name: "Медали", nameKZ: "Медальдар" },
    stateMedal: { name: "Государственная награда", nameKZ: "Мемлекеттік награда" },
    otherMedal: { name: "Другие награды", nameKZ: "Басқа марапаттар" },
};

const badgesOrdersOptions = [
    { value: "defaultMedal", label: LocalText.getName(namesBadgeOrders.defaultMedal) },
    { value: "stateMedal", label: LocalText.getName(namesBadgeOrders.stateMedal) },
    { value: "otherMedal", label: LocalText.getName(namesBadgeOrders.otherMedal) },
];

const badgeOrderMap = {
    "otherMedal": 0,
    "defaultMedal": 1,
    "stateMedal": 2,
};

const ModalAdd = ({ onClose, isOpen, choose }) => {
    const [categoryCode, setCategoryCode] = useState([]);
    const [weaponTypes, setWeaponTypes] = useState([]);
    const [clothingTypes, setClothingTypes] = useState([]);
    const [otherTypes, setOtherTypes] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);
    const [forms, setForms] = useState([]);
    const [rank, setRank] = useState([]);

    const [form] = useForm();

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    useEffect(() => {
        if (!isOpen) return;

        if (choose === "Должность") {
            setDivisionOptions();
        }

        if (choose === "Модели вооружения") {
            setModelsOptions("army", "type", setWeaponTypes);
        }

        if (choose === "Модели одежды") {
            setModelsOptions("clothing", "type", setClothingTypes);
        }

        if (choose === "Модели иного") {
            setModelsOptions("other", "type", setOtherTypes);
        }

        if (choose === "Область") {
            setAdditionalOptions("additional/country", setCountryOptions);
        }

        if (choose === "Город") {
            setAdditionalOptions("personal/region", setRegionOptions);
        }
    }, [isOpen, choose]);

    const setDivisionOptions = async () => {
        setRank(await generateRankOption());
        setForms(await generateFormOption());
        setCategoryCode(await generateCategoryOption());
    };

    const setModelsOptions = async (which, type, setState) => {
        setState(await generateModelsOption(which, type));
    };

    const setAdditionalOptions = async (api, setState) => {
        setState(await generateAdditionalOptions(api));
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                resolve();
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

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const body = {
                name: values.name,
                nameKZ: values.nameKZ,
            };

            if (choose === "Звание") {
                body.rank_order = values.rank_order;
                if (values.employee_url) {
                    try {
                        const url = await HandleFileUpload(values.employee_url);
                        body.employee_url = url;
                    } catch (error) {
                        console.error("Error adding badge:", error);
                    }
                }
                if (values.military_url) {
                    try {
                        const url = await HandleFileUpload(values.military_url);
                        body.military_url = url;
                    } catch (error) {
                        console.error("Error adding badge:", error);
                    }
                }
            }

            if (choose === "Должность") {
                body.category_code = values.category_code;
                body.form = values.form;
                body.max_rank_id = values.max_rank_id;
            }

            if (choose === "Медали") {
                body.badge_order = badgeOrderMap[values.badge_order];
                if (values.url) {
                    try {
                        const url = await HandleFileUpload(values.url);
                        body.url = url;
                    } catch (error) {
                        console.error("Error adding badge:", error);
                    }
                }
            }

            if (choose === "Модели вооружения") {
                body.type_of_army_equipment_id = values.type_of_army_equipment_id;
            }

            if (choose === "Модели одежды") {
                body.type_of_clothing_equipment_id = values.type_of_clothing_equipment_id;
            }

            if (choose === "Модели иного") {
                body.type_of_other_equipment_id = values.type_of_other_equipment_id;
            }

            if (choose === "Область") {
                body.country_id = values.country_id;
            }

            if (choose === "Город") {
                body.region_id = values.region_id;
                body.is_village = values.is_village === "village";
            }

            const createFunctions = {
                "Звание": createRank,
                "Должность": createPosition,
                "Медали": createBadge,
                "Взыскание": createPenalty,
                "Вид имущество": createProperty,
                "Вид спорта": createSport,
                "Статус": createStatus,
                "Специальность": createSpecialty,
                "Академическая степень": createAcademicDegree,
                "Ученое звание степени": createAcademicTitle,
                "Страна": createCountry,
                "Поставщики курсов": createCourse,
                "Степень": createInstitutionDegree,
                "Учебные заведения": createInstitution,
                "Языки": createLanguage,
                "Наука": createScience,
                "Национальность": createNationalities,
                "Mесто рождения": createBirthPlaces,
                "Гражданство": createCitizenship,
                "Наименование болезни": createIllness,
                "Освобождение": createLiberation,
                "Правонарушение": createViolation,
                "Город": createCity,
                "Область": createRegion,
                "Военные учебные заведения": createMilitaryInstitution,
                "Наименование спортивного навыка": createSportDegreeType,
                "Тип вооружения": createWeaponType,
                "Модели вооружения": createWeaponModel,
                "Тип одежды`": createClothingType,
                "Модели одежды": createClothingModel,
                "Тип иного": createOtherType,
                "Модели иного": createOtherModel,
            };

            const selectedFunction = createFunctions[choose];

            if (selectedFunction) {
                selectedFunction(body);
            }

            handleCancel();
        } catch (error) {
            notification.error({
                message: <IntlMessage id={"schedule.form.qual.req"} />,
            });

            console.log(error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setRank([]);
        setForms([]);
        setCategoryCode([]);
        onClose();
    };

    const generateDocumentUploader = (name) => {
        return (
            <Form.Item
                name={name}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                label={<IntlMessage id={"admin.page.modal.add.title.upload"} />}
                // noStyle
                // rules={[{ validator: validateFileList }]}
            >
                <Dragger {...props} maxCount={1}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        <IntlMessage id="service.data.modalAddPsycho.clickFileToLoad" />
                    </p>
                </Dragger>
            </Form.Item>
        );
    };

    const generateElements = (which) => {
        if (which === "Звание")
            return (
                <>
                    <Form.Item
                        name="rank_order"
                        label={<IntlMessage id={"admin.page.modal.add.rank.order"} />}
                        re
                        quired
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Input
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            placeholder={LocalText.getName({
                                name: "Порядок ранка",
                                nameKZ: "Дәреженің тәртібі",
                            })}
                        />
                    </Form.Item>
                    {generateDocumentUploader("military_url")}
                    {generateDocumentUploader("employee_url")}
                </>
            );

        if (choose === "Должность")
            return (
                <>
                    <Form.Item
                        name="category_code"
                        label={<IntlMessage id={"personal.drivingLicense.category"} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Select
                            options={categoryCode}
                            placeholder={<IntlMessage id={"personal.drivingLicense.category"} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="form"
                        label={<IntlMessage id={"staffSchedule.modal.stateSecretAdmissionForm"} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Select
                            options={forms}
                            placeholder={
                                <IntlMessage id={"staffSchedule.modal.stateSecretAdmissionForm"} />
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        name="max_rank_id"
                        label={<IntlMessage id={"max_rank_id"} />}
                        required
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            style={{ width: "100%" }}
                            options={rank}
                            filterOption={(inputValue, option) =>
                                option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            placeholder={<IntlMessage id={"max_rank_id"} />}
                        />
                    </Form.Item>
                </>
            );

        if (choose === "Медали")
            return (
                <>
                    <Form.Item
                        name="badge_order"
                        label={<IntlMessage id={"awards.order"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"awards.choose.placeholder"} />,
                            },
                        ]}
                    >
                        <Select
                            options={badgesOrdersOptions}
                            placeholder={<IntlMessage id={"awards.order"} />}
                        />
                    </Form.Item>
                    {generateDocumentUploader("url")}
                </>
            );

        if (["Модели вооружения", "Модели одежды", "Модели иного", "Область"].includes(choose)) {
            const keys = {
                "Модели вооружения": { id: "type_of_army_equipment_id", options: weaponTypes },
                "Модели одежды": { id: "type_of_clothing_equipment_id", options: clothingTypes },
                "Модели иного": { id: "type_of_other_equipment_id", options: otherTypes },
                "Область": { id: "country_id", options: countryOptions },
            };
            const id = keys[choose].id;
            const options = keys[choose].options;

            return (
                <>
                    <Form.Item
                        name={id}
                        label={<IntlMessage id={"weapon.models.add"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"weapon.models.add"} />,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            filterOption={(inputValue, option) =>
                                option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            options={options}
                            placeholder={<IntlMessage id={"weapon.models.add"} />}
                        />
                    </Form.Item>
                </>
            );
        }

        if (choose === "Город") {
            return (
                <>
                    <Form.Item
                        name={"region_id"}
                        label={<IntlMessage id={"choose.region"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"choose.region"} />,
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            filterOption={(inputValue, option) =>
                                option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                            }
                            options={regionOptions}
                            placeholder={<IntlMessage id={"choose.region"} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name={"is_village"}
                        label={<IntlMessage id={"choose.region.type"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"choose.region.type"} />,
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={"city"}>Город</Radio>
                            <Radio value={"village"}>Село</Radio>
                        </Radio.Group>
                    </Form.Item>
                </>
            );
        }
    };

    return (
        <Modal
            title={<IntlMessage id={"admin.page.modal.title.add"} />}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
        >
            <Form form={form} layout={"vertical"}>
                <Form.Item
                    name="nameKZ"
                    label={<IntlMessage id={"admin.page.table.column.first"} />}
                    required
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"candidates.title.must"} />,
                        },
                    ]}
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "admin.page.table.column.first",
                        })}
                    />
                </Form.Item>
                <Form.Item
                    name="name"
                    label={<IntlMessage id={"admin.page.table.column.second"} />}
                    required
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={"candidates.title.must"} />,
                        },
                    ]}
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "admin.page.table.column.second",
                        })}
                    />
                </Form.Item>

                {generateElements(choose)}
            </Form>
        </Modal>
    );
};

export default ModalAdd;

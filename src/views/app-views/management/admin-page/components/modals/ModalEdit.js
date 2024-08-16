import { useAppSelector } from "hooks/useStore";
import React, { useEffect, useState } from "react";

import { InboxOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal, Select, Spin, notification, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import Dragger from "antd/lib/upload/Dragger";

import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

import FileUploaderService from "services/myInfo/FileUploaderService";
import HandleFileUpload from "../utils/HandleFileUpload";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

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
} from "./utils/AddModalFunctions";

const namesBadgeOrders = {
    defaultMedal: { name: "Медали", nameKZ: "Медальдар" },
    stateMedal: { name: "Государственная награда", nameKZ: "Мемлекеттік награда" },
    otherMedal: { name: "Другие награды", nameKZ: "Басқа марапаттар" },
};

const badgeOrderMap = {
    "otherMedal": 0,
    "defaultMedal": 1,
    "stateMedal": 2,
};
const badgesOrdersOptions = [
    { value: badgeOrderMap.defaultMedal, label: LocalText.getName(namesBadgeOrders.defaultMedal) },
    { value: badgeOrderMap.stateMedal, label: LocalText.getName(namesBadgeOrders.stateMedal) },
    { value: badgeOrderMap.otherMedal, label: LocalText.getName(namesBadgeOrders.otherMedal) },
];

const ModalEdit = ({ onClose, isOpen, choose, record, setRecord }) => {
    const [form] = useForm();
    const { selectedBadge, modalLoading } = useAppSelector((state) => state.adminBadge);
    const [categoryCodeOptions, setCategoryCodeOptions] = useState([]);
    const [positionFormOptions, setPositionFormOptions] = useState([]);
    const [weaponTypes, setWeaponTypes] = useState([]);
    const [clothingTypes, setClothingTypes] = useState([]);
    const [otherTypes, setOtherTypes] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [regionOptions, setRegionOptions] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

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

    const setModelsOptions = async (which, type, setState) => {
        setState(await generateModelsOption(which, type));
    };

    const setAdditionalOptions = async (api, setState) => {
        setState(await generateAdditionalOptions(api));
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

    const handleCancel = () => {
        form.resetFields();
        setRecord("");
        onClose();
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
                body.badge_order = values.badge_order;
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

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: "file",
        multiple: true,
        accept: ".pdf,.jpg,.jpeg, .png",
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

    useEffect(() => {
        const start = async () => {
            if (choose === "Звание") {
                let military_url;
                if (record.military_url !== null) {
                    military_url = await FileUploaderService.getFileByLink(record.military_url);
                }
                let employee_url;
                if (record.employee_url !== null) {
                    employee_url = await FileUploaderService.getFileByLink(record.employee_url);
                }

                const employee_if = {
                    ...(record.employee_url !== null && {
                        employee_url: [employee_url],
                    }),
                };
                const military_if = {
                    ...(record.military_url !== null && {
                        military_url: [military_url],
                    }),
                };

                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                    rank_order: record.rank_order,
                    ...employee_if,
                    ...military_if,
                };

                form.setFieldsValue(data);
            } else if (choose === "Медали") {
                if (!selectedBadge) return;
                form.setFieldsValue(selectedBadge);
            } else if (choose === "Должность") {
                try {
                    const categoryCodeOptions = await generateCategoryOption();
                    const positionFormOptions = await generateFormOption();
                    setCategoryCodeOptions(categoryCodeOptions);
                    setPositionFormOptions(positionFormOptions);
                } catch (error) {
                    console.log(error);
                }
                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                    category_code: record.category_code,
                    form: record.form,
                };
                form.setFieldsValue(data);
            } else if (["Модели вооружения", "Модели одежды", "Модели иного"].includes(choose)) {
                const which = {
                    "Модели иного": "other",
                    "Модели одежды": "clothing",
                    "Модели вооружения": "army",
                };

                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                    [`type_of_${which[choose]}_equipment_id`]:
                        record[`type_of_${which[choose]}_equipment_id`],
                };

                form.setFieldsValue(data);
            } else if (choose === "Область") {
                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                    country_id: record.country_id,
                };
                form.setFieldsValue(data);
            } else if (choose === "Город") {
                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                    region_id: record.region_id,
                    is_village: record.is_village ? "village" : "city",
                };
                form.setFieldsValue(data);
            } else {
                const data = {
                    name: record.name,
                    nameKZ: record.nameKZ,
                };
                form.setFieldsValue(data);
            }
        };
        start();
    }, [record, form, isOpen, selectedBadge, modalLoading]);

    const generateUploader = (name) => {
        return (
            <Form.Item
                name={name}
                valuePropName="fileList"
                getValueFromEvent={normFile}
                label={<IntlMessage id="admin.page.modal.add.title.upload" />}
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
                        />
                    </Form.Item>
                    {generateUploader("military_url")}
                    {generateUploader("employee_url")}
                </>
            );

        if (choose === "Должность")
            return (
                <>
                    <Form.Item
                        name="category_code"
                        label={<IntlMessage id={"personal.drivingLicense.category"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Select
                            options={categoryCodeOptions}
                            placeholder={<IntlMessage id={"personal.drivingLicense.category"} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="form"
                        label={<IntlMessage id={"staffSchedule.modal.stateSecretAdmissionForm"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Select
                            options={positionFormOptions}
                            placeholder={
                                <IntlMessage id={"staffSchedule.modal.stateSecretAdmissionForm"} />
                            }
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
                        <Select options={badgesOrdersOptions} />
                    </Form.Item>

                    {generateUploader("url")}
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
            title={<IntlMessage id={"admin.page.modal.title.edit"} />}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
        >
            <Spin spinning={modalLoading}>
                <Form form={form} layout={"vertical"}>
                    <Form.Item
                        name="nameKZ"
                        label={<IntlMessage id={"admin.page.table.column.first"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label={<IntlMessage id={"admin.page.table.column.second"} />}
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"candidates.title.must"} />,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {generateElements(choose)}
                </Form>
            </Spin>
        </Modal>
    );
};

export default ModalEdit;

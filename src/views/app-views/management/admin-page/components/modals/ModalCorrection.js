import { InboxOutlined } from "@ant-design/icons";
import { AutoComplete, Form, Input, Modal, Radio, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Dragger from "antd/lib/upload/Dragger";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import AvatarStatus from "components/shared-components/AvatarStatus";
import IntlMessage from "components/util-components/IntlMessage";
import LocalizationText, {
    LocalText,
} from "components/util-components/LocalizationText/LocalizationText";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import FileUploaderService from "services/myInfo/FileUploaderService";
import {
    clearItemValue,
    fetchUsers,
    getInitials,
    getUser,
    resetUsers,
} from "store/slices/newInitializationsSlices/initializationNewSlice";
import { LOADING_OPTION } from "../../../initialization_new/UserForm";
import {
    generateAdditionalOptions,
    generateCategoryOption,
    generateFormOption,
    generateModelsOption,
} from "./utils/AddModalFunctions";
import {
    correctionAcademicDegree,
    correctionAcademicTitle,
    correctionBadge,
    correctionBirthPlaces,
    correctionCitizenship,
    correctionCity,
    correctionClothingModel,
    correctionClothingType,
    correctionCountry,
    correctionCourse,
    correctionIllness,
    correctionInstitution,
    correctionInstitutionDegree,
    correctionLanguage,
    correctionLiberation,
    correctionMilitaryInstitution,
    correctionNationalities,
    correctionOtherModel,
    correctionOtherType,
    correctionPenalty,
    correctionPosition,
    correctionProperty,
    correctionRank,
    correctionRegion,
    correctionScience,
    correctionSpecialty,
    correctionSport,
    correctionSportDegreeType,
    correctionStatus,
    correctionViolation,
    correctionWeaponModel,
    correctionWeaponType,
} from "./utils/CorrectionModalFunctions";
import HandleFileUpload from "../utils/HandleFileUpload";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

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

const ModalCorrection = ({ onClose, isOpen, choose, record, setRecord }) => {
    const [form] = useForm();
    const [perType, setPerType] = useState([]);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [inputText, setInputText] = useState("");
    const usersFromStore = useAppSelector((state) => state.initializationNew.users);
    const lastFetchedUsers = useAppSelector((state) => state.initializationNew.lastFetchedUsers);
    const userFromStore = useAppSelector((state) => state.initializationNew.selectUser);
    const PAGE_SIZE = 20;
    const { selectedBadge } = useAppSelector((state) => state.adminBadge);
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

            if (choose === "Область") {
                body.country_id = values.country_id;
            }

            if (choose === "Город") {
                body.region_id = values.region_id;
                body.is_village = values.is_village === "village";
            }

            const correctionFunctions = {
                "Звание": correctionRank,
                "Должность": correctionPosition,
                "Медали": correctionBadge,
                "Взыскание": correctionPenalty,
                "Вид имущество": correctionProperty,
                "Вид спорта": correctionSport,
                "Статус": correctionStatus,
                "Специальность": correctionSpecialty,
                "Академическая степень": correctionAcademicDegree,
                "Ученое звание степени": correctionAcademicTitle,
                "Страна": correctionCountry,
                "Поставщики курсов": correctionCourse,
                "Степень": correctionInstitutionDegree,
                "Учебные заведения": correctionInstitution,
                "Языки": correctionLanguage,
                "Наука": correctionScience,
                "Национальность": correctionNationalities,
                "Mесто рождения": correctionBirthPlaces,
                "Гражданство": correctionCitizenship,
                "Наименование болезни": correctionIllness,
                "Освобождение": correctionLiberation,
                "Правонарушение": correctionViolation,
                "Область": correctionRegion,
                "Город": correctionCity,
                "Военные учебные заведения": correctionMilitaryInstitution,
                "Наименование спортивного навыка": correctionSportDegreeType,
                "Тип вооружения": correctionWeaponType,
                "Модели вооружения": correctionWeaponModel,
                "Тип одежды`": correctionClothingType,
                "Модели одежды": correctionClothingModel,
                "Тип иного": correctionOtherType,
                "Модели иного": correctionOtherModel,
            };

            const selectedFunction = correctionFunctions[choose];

            if (selectedFunction) {
                selectedFunction(body, record.id);
            }

            handleCancel();
        } catch (error) {
            console.log(error);
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
    const fetchMoreUsers = async () => {
        setLoading(true);
        const actionResult = await dispatch(
            fetchUsers({
                text: searchText,
                limit: PAGE_SIZE,
                skip: page * PAGE_SIZE,
            }),
        );

        if (!actionResult.payload) {
            console.log("Error: user didnt come");
        }
        setLoading(false);
    };

    useEffect(() => {
        setHasMore(lastFetchedUsers.length === PAGE_SIZE);
    }, [lastFetchedUsers.length, usersFromStore]);

    useEffect(() => {
        if (page === 0) return;
        fetchMoreUsers();
    }, [page]);

    const debouncedSearch = useCallback(debounce(fetchMoreUsers, 300), [searchText]);
    const handleScroll = (e) => {
        if (!hasMore || loading) return;
        const { target } = e;
        if (Math.round(target.scrollTop + target.clientHeight) === target.scrollHeight) {
            setPage((page) => page + 1);
        }
    };

    useEffect(() => {
        debouncedSearch();
        return debouncedSearch.cancel;
    }, [searchText, debouncedSearch]);

    useEffect(() => {
        setInputText("");
        if (!userFromStore) return;
        if (Object.keys(userFromStore).length === 0) return;
        const initials = `${userFromStore.first_name} ${userFromStore.last_name}`;
        dispatch(getInitials(initials));
        setInputText(initials);
    }, [userFromStore]);

    const onSelect = (userId, option) => {
        dispatch(clearItemValue());
        dispatch(getUser(usersFromStore.filter((user) => user.id === userId)));
        const initials = `${option?.label?.props?.name} ${option?.label?.props?.surname}`;
        dispatch(getInitials(initials));
        const data = {
            user: {
                value: initials,
                label: initials,
            },
        };
        form.setFieldsValue(data);
        setInputText(initials);
        setPage(0);
    };
    const onClear = () => {
        dispatch(resetUsers());
        setSearchText("");
        setInputText("");
        setPage(0);
        setHasMore(true);
    };
    const handleSearch = (value) => {
        dispatch(clearItemValue());
        dispatch(resetUsers());
        setSearchText(value);
        setInputText(value);
        setPage(0);
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
    }, [record, form, isOpen, selectedBadge, choose]);

    const generateElements = () => {
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
            title={<IntlMessage id={"admin.panel.modal.correction.title"} />}
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
            cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
        >
            <Form form={form} layout={"vertical"}>
                {choose === "Доступ" ? (
                    <>
                        <Form.Item
                            name="type"
                            label={<IntlMessage id={"admin.page.table.permissions.column"} />}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={"candidates.title.must"} />,
                                },
                            ]}
                        >
                            <Select
                                options={perType.map((item) => ({
                                    value: item.id,
                                    label: <LocalizationText text={item} />,
                                }))}
                            />
                        </Form.Item>
                        <Form.Item
                            name="user"
                            label={<IntlMessage id={"personal.breadcrumbs.employee"} />}
                            rules={[
                                {
                                    required: true,
                                    message: <IntlMessage id={"candidates.title.must"} />,
                                },
                            ]}
                        >
                            <AutoComplete
                                className="chooseUser"
                                onPopupScroll={handleScroll}
                                options={[
                                    ...usersFromStore.map((item) => ({
                                        value: item.id,
                                        label: (
                                            <AvatarStatus
                                                name={item.first_name}
                                                surname={item.last_name}
                                                src={item.icon}
                                            />
                                        ),
                                    })),
                                    ...(hasMore || loading ? [LOADING_OPTION] : []),
                                ]}
                                onSelect={onSelect}
                                onSearch={handleSearch}
                                onClear={onClear}
                                allowClear
                                notFoundContent={<IntlMessage id="initiate.notFoundUsers" />}
                                value={inputText}
                            />
                        </Form.Item>
                    </>
                ) : (
                    <>
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

                        {choose === "Звание" && (
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
                                <Form.Item
                                    label={<IntlMessage id="admin.page.modal.add.title.upload" />}
                                >
                                    <Form.Item
                                        name="military_url"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        noStyle
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
                                <Form.Item
                                    label={<IntlMessage id="admin.page.modal.add.title.upload" />}
                                >
                                    <Form.Item
                                        name="employee_url"
                                        valuePropName="fileList"
                                        getValueFromEvent={normFile}
                                        noStyle
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
                            </>
                        )}

                        {choose === "Должность" && (
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
                                        placeholder={
                                            <IntlMessage id={"personal.drivingLicense.category"} />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="form"
                                    label={
                                        <IntlMessage
                                            id={"staffSchedule.modal.stateSecretAdmissionForm"}
                                        />
                                    }
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
                                            <IntlMessage
                                                id={"staffSchedule.modal.stateSecretAdmissionForm"}
                                            />
                                        }
                                    />
                                </Form.Item>
                            </>
                        )}

                        {choose === "Медали" && (
                            <>
                                <Form.Item
                                    name="badge_order"
                                    label={<IntlMessage id={"awards.order"} />}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id={"awards.choose.placeholder"} />
                                            ),
                                        },
                                    ]}
                                >
                                    <Select options={badgesOrdersOptions} />
                                </Form.Item>
                                <Form.Item
                                    label={<IntlMessage id="admin.page.modal.add.title.upload" />}
                                    required
                                    name="url"
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
                            </>
                        )}

                        {generateElements()}
                    </>
                )}
            </Form>
        </Modal>
    );
};
export default ModalCorrection;

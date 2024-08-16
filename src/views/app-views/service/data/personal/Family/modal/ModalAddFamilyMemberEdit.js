import { Col, DatePicker, Form, Input, Modal, Radio, Row, Select } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useCityOptions } from "hooks/useCityOptions/useCityOptions";
import { useCountryOptions } from "hooks/useCountryOptions/useCountryOptions";
import { useRegionOptions } from "hooks/useRegionOptions/useRegionOptions";
import { useVillageOptions } from "hooks/useVillageOptions/useVillageOptions";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { deleteByPath } from "store/slices/myInfo/familyProfileSlice";
import { replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { disabledDate } from "utils/helpers/futureDateHelper";
import { SelectPickerMenu } from "../../PersonalData/BiographicInfo/SelectPickerMenu";
import { setCorrectDate } from "utils/format/datesFormat";

const defaultOption = {
    value: "",
    label: "",
};
const ModalAddFamilyMemberEdit = ({ isOpen, onClose, familyMemberObject, source = "get" }) => {
    const [countryOption, setCountryOption] = useState(defaultOption);
    const [regionOption, setRegionOption] = useState(defaultOption);
    const [cityOption, setCityOption] = useState(defaultOption);
    const [villageOption, setVillageOption] = useState(defaultOption);

    const [relationOptions, setRelationOptions] = useState([]);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const family_members = useSelector((state) => state.myInfo.edited.family.members);
    const { relations } = useSelector((state) => state.familyProfile);

    const [isVillage, setIsVillage] = useState(false);

    const { t, i18n } = useTranslation();
    const currentLocale = i18n.language;
    const {
        countryOptions,
        countryOptionsLoading,
        error: countryError,
        getCountryOptions,
        createNew: createNewCountry,
    } = useCountryOptions(currentLocale);

    const {
        cityOptions,
        cityOptionsLoading,
        error: cityError,
        getCityOptions,
        createNew: createNewCity,
    } = useCityOptions(currentLocale, [regionOption], regionOption.value);

    const {
        villageOptions,
        villageOptionsLoading,
        error: villageError,
        getVillageOptions,
        createNew: createNewVillage,
    } = useVillageOptions(currentLocale, [regionOption], regionOption.value);

    const {
        regionOptions,
        regionOptionsLoading,
        error: regionError,
        getRegionOptions,
        createNew: createNewRegion,
    } = useRegionOptions(currentLocale, [countryOption], countryOption.value);

    const validateCountry = (rule) => {
        return new Promise((resolve, reject) => {
            if (!countryOption.label.trim() && !familyMemberObject?.birthplace?.country_id) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    const validateRegion = (rule) => {
        return new Promise((resolve, reject) => {
            if (!regionOption.label.trim() && !familyMemberObject?.birthplace?.region_id) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    const validateCity = (rule) => {
        return new Promise((resolve, reject) => {
            if (isVillage) {
                resolve();
            }
            if (!cityOption.label.trim() && !familyMemberObject?.birthplace?.city_id) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    const validateVillage = (rule) => {
        return new Promise((resolve, reject) => {
            if (!isVillage) {
                resolve();
            }
            if (!villageOption.label.trim() && !familyMemberObject?.birthplace?.city_id) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    useEffect(() => {
        if (relations.objects) {
            setRelationOptions(
                relations.objects.map((item) => ({
                    value: item.id,
                    label: LocalText.getName(item),
                })),
            );
        }
    }, [relations]);

    const onOk = async () => {
        try {
            const values = await form.validateFields();

            const currentRelations = relations.objects.find(
                (item) => item.id === values.degree_kinship,
            );

            const familyInfo = {
                first_name: values.name_family_member,
                last_name: values.surname_family_member,
                father_name: values.fatherName_family_member,
                IIN: values.iin_family_member,
                address: values.address,
                relation: currentRelations,
                birthday: setCorrectDate(values.date_birthday),
                death_day: setCorrectDate(values.date_dead),
                country_id: values.country_family_member,
                country_name: countryOption.label,
                region_id: values.region_family_member,
                region_name: regionOption.label,
                is_village: isVillage,
                city_id: isVillage ? values.village_family_member : values.city_family_member,
                city_name: isVillage ? villageOption.label : cityOption.label,
                relation_id: values.degree_kinship,
                workplace: values.work_place_family_member,
                id: familyMemberObject.id,
            };

            if (source === "get") {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: "familyProfile.family", //+
                        id: familyMemberObject.id, // +
                    }),
                );
                // Add to Edited slice
                dispatch(
                    setFieldValue({
                        fieldPath: "edited.family.members", //+
                        value: [...family_members, familyInfo],
                    }),
                );
            }
            if (source === "edited") {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: "edited.family.members", //+
                        id: familyMemberObject.id, //+
                        newObj: familyInfo,
                    }),
                );
            }
            if (source === "added") {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: "allTabs.family.members",
                        id: familyMemberObject.id,
                        newObj: familyInfo,
                    }),
                );
            }
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        form.resetFields();

        const isVillage = !!(
            familyMemberObject?.birthplace?.city?.is_village || familyMemberObject?.is_village
        );
        setIsVillage(isVillage);

        const values = {
            degree_kinship: familyMemberObject.relation_id,
            iin_family_member: familyMemberObject.IIN,
            surname_family_member: familyMemberObject.last_name,
            name_family_member: familyMemberObject.first_name,
            fatherName_family_member: familyMemberObject.father_name,
            date_birthday: moment(familyMemberObject.birthday),
            date_dead: familyMemberObject.death_day ? moment(familyMemberObject.death_day) : null,
            country_family_member: familyMemberObject?.birthplace?.country_id,
            region_family_member: familyMemberObject?.birthplace?.region_id,
            work_place_family_member: familyMemberObject.workplace,
            address: familyMemberObject.address,
        };

        const key = isVillage ? "village_family_member" : "city_family_member";
        values[key] = familyMemberObject?.birthplace?.city_id;

        form.setFieldsValue(values);
    }, [familyMemberObject, form, isOpen]);

    useEffect(() => {
        if (!countryOptions) {
            return;
        }
        const foundCountry = countryOptions.find(
            (c) => c.value === familyMemberObject?.birthplace?.country_id,
        );
        if (!foundCountry) {
            return;
        }
        setCountryOption(foundCountry);
    }, [countryOptions, familyMemberObject?.birthplace?.country_id]);

    useEffect(() => {
        if (!regionOptions) {
            return;
        }
        const foundRegion = regionOptions.find(
            (c) => c.value === familyMemberObject?.birthplace?.region_id,
        );
        if (!foundRegion) {
            return;
        }
        setRegionOption(foundRegion);
    }, [regionOptions, familyMemberObject?.birthplace?.region_id]);

    useEffect(() => {
        if (!cityOptions) {
            return;
        }
        const foundCity = cityOptions.find(
            (c) => c.value === familyMemberObject?.birthplace?.city_id,
        );
        if (!foundCity) {
            return;
        }
        setCityOption(foundCity);
    }, [cityOptions, familyMemberObject?.birthplace?.city_id]);

    useEffect(() => {
        if (!villageOptions) {
            return;
        }
        const foundVillage = villageOptions.find(
            (c) => c.value === familyMemberObject?.birthplace?.village_id,
        );
        if (!foundVillage) {
            return;
        }
        setVillageOption(foundVillage);
    }, [villageOptions, familyMemberObject?.birthplace?.village_id]);

    const handleCountryChange = (_, option) => {
        setCountryOption(option);

        setRegionOption(defaultOption);
        setCityOption(defaultOption);
        setVillageOption(defaultOption);

        form.setFieldValue("region_family_member", null);
        form.setFieldValue("city_family_member", null);
        form.setFieldValue("village_family_member", null);
    };

    const handleNewCountryAdd = ({ kz, ru }) => {
        createNewCountry({ name: ru, nameKZ: kz }).then(() => {
            getCountryOptions();
        });
    };

    const handleRegionChange = (_, option) => {
        setRegionOption(option);

        setCityOption(defaultOption);
        setVillageOption(defaultOption);

        form.setFieldValue("city_family_member", null);
        form.setFieldValue("village_family_member", null);
    };

    const handleNewRegionAdd = ({ kz, ru }) => {
        createNewRegion({ name: ru, nameKZ: kz }).then(() => {
            getRegionOptions();
        });
    };

    const handleCityChange = (_, option) => {
        setCityOption(option);
    };

    const handleNewCityAdd = ({ kz, ru }) => {
        createNewCity({ name: ru, nameKZ: kz }).then(() => {
            getCityOptions();
        });
    };

    const handleVillageChange = (_, option) => {
        setVillageOption(option);
    };

    const handleNewVillageAdd = ({ kz, ru }) => {
        createNewVillage({ name: ru, nameKZ: kz }).then(() => {
            getVillageOptions();
        });
    };

    const handleRadioChange = (event) => {
        setIsVillage(event.target.value === "village");
    };

    return (
        <Modal
            title={
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginRight: "20px",
                        alignItems: "center",
                    }}
                >
                    <IntlMessage id="personalInfo.add.family.modal.title" />
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            onOk={onOk}
            onClick={(e) => e.stopPropagation()}
            okText={<IntlMessage id="personalInfo.add.family.modal.title" />}
            cancelText={<IntlMessage id="candidates.warning.cancel" />}
            style={{ height: "500px", width: "400px" }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={<IntlMessage id="personalInfo.add.family.modal.degree.relation" />}
                    name="degree_kinship"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.family.modal.degree.relation",
                            }),
                        },
                    ]}
                    required
                >
                    <Select
                        options={relationOptions}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option.label.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.id.family.member" />
                    }
                    name="iin_family_member"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.id.family.member.message",
                            }),
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({ id: "personal.family.IIN" })}
                        type="tel"
                        min={0}
                        maxLength={12}
                        onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                                event.preventDefault();
                            }
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.surnameFamMember" />
                    }
                    name="surname_family_member"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.surnameFamMember.message",
                            }),
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "personalInfo.add.familyMember.modal.surnameFamMember",
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="personalInfo.add.familyMember.modal.nameFamMember" />}
                    name="name_family_member"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.nameFamMember.message",
                            }),
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "personalInfo.add.familyMember.modal.nameFamMember",
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.fatherNameFamMember" />
                    }
                    name="fatherName_family_member"
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "personalInfo.add.familyMember.modal.fatherNameFamMember",
                        })}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.dateOfBirthFamMember" />
                    }
                    name="date_birthday"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.dateOfBirthFamMember.message",
                            }),
                        },
                    ]}
                    required
                >
                    <DatePicker
                        placeholder={IntlMessageText.getText({
                            id: "personal.family.birthDate",
                        })}
                        style={{ width: "250px" }}
                        format="DD-MM-YYYY"
                        name="date_birthday"
                        disabledDate={disabledDate}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.dateOfDeathFamMember" />
                    }
                    name="date_dead"
                >
                    <DatePicker
                        placeholder={IntlMessageText.getText({
                            id: "personal.family.deathDate",
                        })}
                        style={{ width: "250px" }}
                        format="DD-MM-YYYY"
                        name="date_dead"
                        disabledDate={disabledDate}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.countryFamMember" />
                    }
                    name="country_family_member"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.placeOfBirthFamMember.message",
                            }),
                            validator: validateCountry,
                        },
                    ]}
                    required
                >
                    <SelectPickerMenu
                        options={countryOptions}
                        value={countryOption}
                        defaultValue={null}
                        onChange={handleCountryChange}
                        optionsLoading={countryOptionsLoading}
                        handleAddNewOption={handleNewCountryAdd}
                    />
                </Form.Item>

                <Form.Item
                    label={<IntlMessage id="personalInfo.add.familyMember.modal.regionFamMember" />}
                    name="region_family_member"
                    rules={[
                        {
                            required: true,
                            message: IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.placeOfBirthFamMember.message",
                            }),
                            validator: validateRegion,
                        },
                    ]}
                    required
                >
                    <SelectPickerMenu
                        disabled={!countryOption.value}
                        options={regionOptions}
                        value={regionOption}
                        defaultValue={null}
                        onChange={handleRegionChange}
                        optionsLoading={regionOptionsLoading}
                        handleAddNewOption={handleNewRegionAdd}
                    />
                </Form.Item>

                <Form.Item>
                    <Radio.Group
                        value={!isVillage ? "city" : "village"}
                        onChange={handleRadioChange}
                    >
                        <Radio value={"city"}>{t("personal.biographicInfo.city")}</Radio>
                        <Radio value={"village"}>{t("personal.biographicInfo.village")}</Radio>
                    </Radio.Group>
                </Form.Item>

                {!isVillage ? (
                    <Form.Item
                        label={
                            <IntlMessage id="personalInfo.add.familyMember.modal.cityFamMember" />
                        }
                        name="city_family_member"
                        rules={[
                            {
                                required: true,
                                message: IntlMessageText.getText({
                                    id: "personalInfo.add.familyMember.modal.placeOfBirthFamMember.message",
                                }),
                                validator: validateCity,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            disabled={!countryOption.value || !regionOption.value}
                            options={cityOptions}
                            value={cityOption}
                            defaultValue={null}
                            onChange={handleCityChange}
                            optionsLoading={cityOptionsLoading}
                            handleAddNewOption={handleNewCityAdd}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        label={
                            <IntlMessage id="personalInfo.add.familyMember.modal.villageFamMember" />
                        }
                        name="village_family_member"
                        rules={[
                            {
                                required: true,
                                message: IntlMessageText.getText({
                                    id: "personalInfo.add.familyMember.modal.placeOfBirthFamMember.message",
                                }),
                                validator: validateVillage,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            disabled={!countryOption.value || !regionOption.value}
                            options={villageOptions}
                            value={villageOption}
                            defaultValue={null}
                            onChange={handleVillageChange}
                            optionsLoading={villageOptionsLoading}
                            handleAddNewOption={handleNewVillageAdd}
                        />
                    </Form.Item>
                )}

                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.addressFamMember" />
                    }
                    name="address"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: IntlMessageText.getText({
                    //             id: "personalInfo.add.familyMember.modal.addressFamMember.message",
                    //         }),
                    //     },
                    // ]}
                    // required
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "personalInfo.add.familyMember.modal.addressFamMember",
                        })}
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <IntlMessage id="personalInfo.add.familyMember.modal.placeOfWorkFamMember" />
                    }
                    name="work_place_family_member"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: IntlMessageText.getText({
                    //             id: "personalInfo.add.familyMember.modal.placeOfWorkFamMember.message",
                    //         }),
                    //     },
                    // ]}
                    // required
                >
                    <Input
                        placeholder={IntlMessageText.getText({
                            id: "personalInfo.add.familyMember.modal.placeOfWorkFamMember",
                        })}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAddFamilyMemberEdit;

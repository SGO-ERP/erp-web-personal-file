import { DatePicker, Form, Input, Modal, Select, Radio } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { disabledDate } from "utils/helpers/futureDateHelper";
import uuidv4 from "utils/helpers/uuid";
import { setFieldValue } from "../../../../../../../store/slices/myInfo/myInfoSlice";
// import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import { useCityOptions } from "hooks/useCityOptions/useCityOptions";
import { useCountryOptions } from "hooks/useCountryOptions/useCountryOptions";
import { useRegionOptions } from "hooks/useRegionOptions/useRegionOptions";
import { useVillageOptions } from "hooks/useVillageOptions/useVillageOptions";
import { useTranslation } from "react-i18next";
import { SelectPickerMenu } from "../../PersonalData/BiographicInfo/SelectPickerMenu";
import { setCorrectDate } from "utils/format/datesFormat";

const defaultOption = {
    value: "",
    label: "",
};
const ModalAddFamilyMember = ({ isOpen, onClose }) => {
    const [countryOption, setCountryOption] = useState(defaultOption);
    const [regionOption, setRegionOption] = useState(defaultOption);
    const [cityOption, setCityOption] = useState(defaultOption);
    const [villageOption, setVillageOption] = useState(defaultOption);

    const [updateOptions, setUpdateOptions] = useState(false);
    const [relationOptions, setRelationOptions] = useState([]);

    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const family_members = useSelector((state) => state.myInfo.allTabs.family.members);
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

    const validateCountry = (rule) => {
        return new Promise((resolve, reject) => {
            if (!countryOption.label.trim()) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    const validateRegion = (rule) => {
        return new Promise((resolve, reject) => {
            if (!regionOption.label.trim()) {
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
            if (!cityOption.label.trim()) {
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
            if (!villageOption.label.trim()) {
                reject(<IntlMessage id="education.select.empty" />);
                return;
            }
            resolve();
        });
    };

    const handelOk = async () => {
        try {
            const values = await form.validateFields();

            const currentRelations = relations.objects.find(
                (item) => item.id === values.degree_kinship,
            );

            const familyInfo = {
                relation_id: values.degree_kinship,
                first_name: values.name_family_member,
                last_name: values.surname_family_member,
                father_name: values.fatherName_family_member,
                IIN: values.iin_family_member,
                address: values.place_address_family_member,
                birthday: setCorrectDate(values.date_birthday),
                death_day: setCorrectDate(values.date_dead),
                relation: currentRelations,
                country_id: countryOption.value,
                country_name: countryOption.label,
                region_id: regionOption.value,
                region_name: regionOption.label,
                is_village: isVillage,
                city_id: isVillage ? villageOption.value : cityOption.value,
                city_name: isVillage ? villageOption.label : cityOption.label,
                workplace: values.work_place_family_member,
                id: uuidv4(),
            };

            if (updateOptions) {
                console.log("updated");
            }

            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.family.members",
                    value: [...family_members, familyInfo],
                }),
            );

            onCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setCountryOption(defaultOption);
        setRegionOption(defaultOption);
        setCityOption(defaultOption);
        setVillageOption(defaultOption);
        setUpdateOptions(false);
        onClose();
    };

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

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={<IntlMessage id="personalInfo.add.family.modal.title" />}
                open={isOpen}
                onCancel={onCancel}
                onOk={handelOk}
                okText={<IntlMessage id="personalInfo.add.family.modal.title" />}
                cancelText={<IntlMessage id="candidates.warning.cancel" />}
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
                            placeholder={IntlMessageText.getText({
                                id: "personalInfo.add.family.modal.degree.relation",
                            })}
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
                        label={
                            <IntlMessage id="personalInfo.add.familyMember.modal.nameFamMember" />
                        }
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
                            style={{ width: "100%" }}
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
                            style={{ width: "100%" }}
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
                        label={
                            <IntlMessage id="personalInfo.add.familyMember.modal.regionFamMember" />
                        }
                        name="region_family_member"
                        rules={[
                            {
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
                        <Radio.Group value={!isVillage ? "city" : "village"}>
                            <Radio value={"city"} onChange={() => setIsVillage(false)}>
                                {t("personal.biographicInfo.city")}
                            </Radio>
                            <Radio value={"village"} onChange={() => setIsVillage(true)}>
                                {t("personal.biographicInfo.village")}
                            </Radio>
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
                        label={<IntlMessage id={"personal.biographicInfo.addressOfResidence"} />}
                        name="place_address_family_member"
                    >
                        <Input
                            placeholder={IntlMessageText.getText({
                                id: "personal.biographicInfo.addressOfResidence",
                            })}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <IntlMessage id="personalInfo.add.familyMember.modal.placeOfWorkFamMember" />
                        }
                        name="work_place_family_member"
                    >
                        <Input
                            placeholder={IntlMessageText.getText({
                                id: "personalInfo.add.familyMember.modal.placeOfWorkFamMember",
                            })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAddFamilyMember;

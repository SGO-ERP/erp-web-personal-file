import { InboxOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, message, Modal, Select, Upload } from "antd";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { fileExtensions } from "constants/FileExtensionConstants";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import FileUploaderService from "services/myInfo/FileUploaderService";
import uuidv4 from "utils/helpers/uuid";
import { setFieldValue } from "store/slices/myInfo/myInfoSlice";
import { useAppSelector } from "hooks/useStore";
import { PrivateServices } from "API";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import SelectPickerMenu from "../../Education/modals/SelectPickerMenu";
import AdditionalService from "../../../../../../../services/myInfo/AdditionalService";
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";
import { PERMISSION } from "constants/permission";

const ModelAddAbroadTravel = ({ isOpen, onClose }) => {
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10_000 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [optionValue, setOptionValue] = useState({});

    const [fileList, setFileList] = useState();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const abroad_travels = useSelector((state) => state.myInfo.allTabs.additional.abroad_travels);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [countries, setCountries] = useState([]);
    const [aim, setAim] = useState({ name: "", nameKZ: "" });
    const [currentLanguage, setCurrentLanguage] = useState("rus");

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

    const fetchOptions = async () => {
        const vehicleOptions = await fetchOptionsData("/additional/vehicle_type", "vehicle_type");
        const countryOptions = await fetchOptionsData(
            "/additional/country",
            "destination_country_id",
        );

        setVehicleTypeOptions(vehicleOptions);
        setCountries(countryOptions);
    };

    const validateValues = (rule) => {
        return new Promise((resolve, reject) => {
            if (!optionValue[rule.field]) {
                reject(<IntlMessage id="education.select.empty" />);
            } else {
                resolve();
            }
        });
    };

    const handleInputAim = (event) => {
        setAim({
            ...aim,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const validateLocalizationAim = () => {
        const isRusEmpty = aim.name.trim() === "";
        const isKZEmpty = aim.nameKZ.trim() === "";

        return new Promise((resolve, reject) => {
            if (isRusEmpty && isKZEmpty) {
                reject(<IntlMessage id="field.required" />);
            } else if (isKZEmpty) {
                reject(<IntlMessage id="field.required.kazakh" />);
            } else if (isRusEmpty) {
                reject(<IntlMessage id="field.required.russian" />);
            } else {
                resolve();
            }
        });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const disabledDate = (current) => {
        // Disable dates before today
        return current && current > moment().startOf("day");
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
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={"service.data.modalAddPsycho.cannotLoadFile"} />);
        }
    };

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                resolve();
                // reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
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
        accept: fileExtensions, // разрешенные расширения
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
    // ss
    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);

             const vehicle_type = await AdditionalService.get_vehicle_type_id(optionValue.vehicle_type);
             const country = await AdditionalService.get_country_id(optionValue.destination_country_id);

            const newObject = {
                vehicle_type_id: optionValue.vehicle_type,
                vehicle_type: vehicle_type,
                destination_country_id: optionValue.destination_country_id,
                destination_country: country,
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                reason: aim.name,
                reasonKZ: aim.nameKZ,
                document_link: response,
                id: uuidv4(),
            };
            dispatch(
                setFieldValue({
                    fieldPath: "allTabs.additional.abroad_travels",
                    value: [...abroad_travels, newObject],
                }),
            );
            form.resetFields();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setAim({ name: "", nameKZ: "" });
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить сведения о курсе'}
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
                            <IntlMessage id={"service.data.modalAbroadTravel.title"} />
                        </span>
                        <LanguageSwitcher
                            size="small"
                            fontSize="12px"
                            height="1.4rem"
                            current={currentLanguage}
                            setLanguage={setCurrentLanguage}
                        />
                    </div>
                }
                open={isOpen && isHR}
                onCancel={onCancel}
                onOk={onOk}
                okText={<IntlMessage id={"service.data.modalAddPsycho.save"} />}
                cancelText={<IntlMessage id={"service.data.modalAddPsycho.cancel"} />}
                style={{ height: "500px", width: "400px" }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAbroadTravel.vehicleType"} />}
                        name="vehicle_type"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={vehicleTypeOptions}
                            type="vehicle_type"
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setVehicleTypeOptions}
                            searchText={searchText}
                            placeholder={"service.data.modalAbroadTravel.vehicleTypeError"}
                            values={optionValue}
                            setValue={setOptionValue}
                        />
                    </Form.Item>
                    <Form.Item
                        label={
                            <IntlMessage id={"service.data.modalAbroadTravel.destinationCountry"} />
                        }
                        name="destination_country_id"
                        rules={[
                            {
                                validator: validateValues,
                            },
                        ]}
                        required
                    >
                        <SelectPickerMenu
                            options={countries}
                            type="destination_country_id"
                            setScrollingLength={setScrollingLength}
                            scrollingLength={scrollingLength}
                            maxCount={maxCount}
                            setSearchText={setSearchText}
                            currentOptions={setCountries}
                            searchText={searchText}
                            placeholder={"service.data.modalAbroadTravel.destinationCountry"}
                            values={optionValue}
                            setValue={setOptionValue}
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAbroadTravel.reason"} />}
                        name="reason"
                        rules={[
                            {
                                validator: validateLocalizationAim,
                            },
                        ]}
                        required
                    >
                        <Input
                            value={currentLanguage === "rus" ? aim.name : aim.nameKZ}
                            onChange={handleInputAim}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === "rus" ? aim.name : aim.nameKZ}
                        </p>
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"personal.additional.offenceList.date"} />}
                        name="date"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id={"oath.date.placeholder"} />,
                            },
                        ]}
                        required
                    >
                        <DatePicker.RangePicker
                            style={{
                                width: "100%",
                            }}
                            placeholder={[
                                IntlMessageText.getText({
                                    id: "service.data.modalAbroadTravel.dateStart",
                                }),
                                IntlMessageText.getText({
                                    id: "service.data.modalAbroadTravel.dateEnd",
                                }),
                            ]}
                            format="DD-MM-YYYY"
                            name="date"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<IntlMessage id={"service.data.modalAcademicDegree.docAccept"} />}
                        // required
                    >
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                        >
                            <Upload.Dragger fileList={fileList} {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    <IntlMessage id="dragger.text" />
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModelAddAbroadTravel;

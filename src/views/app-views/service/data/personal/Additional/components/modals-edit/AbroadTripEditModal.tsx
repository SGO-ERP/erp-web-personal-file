import { InboxOutlined } from "@ant-design/icons";
import { PrivateServices } from "API";
import { components } from "API/types";
import { Button, DatePicker, Input, Modal, Row, Select, Upload, Form, message } from "antd";
import LanguageSwitcher from "components/shared-components/LanguageSwitcher";
import IntlMessage, { IntlMessageText } from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { fileExtensions } from "constants/FileExtensionConstants";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import FileUploaderService, { headers } from "services/myInfo/FileUploaderService";
import SelectPickerMenuService from "services/myInfo/SelectPickerMenuService";
import { deleteByPath } from "store/slices/myInfo/additionalSlice";
import { addFieldValue, replaceByPath, setFieldValue } from "store/slices/myInfo/myInfoSlice";
import EducationService from "../../../../../../../../services/myInfo/EducationService";
import AdditionalService from "../../../../../../../../services/myInfo/AdditionalService";
import UserService from "../../../../../../../../services/UserService";
import { S3_BASE_URL } from "configs/AppConfig";
import { PERMISSION } from "constants/permission";

type AbroadTrip = components["schemas"]["AbroadTravelRead"];

type TAbroadTripEditModal = {
    isOpen: boolean;
    currentAbroadTrip: AbroadTrip;
    onClose: () => void;
    source?: "get" | "edited" | "added";
};

const AbroadTripEditModal: FC<TAbroadTripEditModal> = ({
    isOpen,
    onClose,
    currentAbroadTrip,
    source,
}) => {
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const [currentLanguage, setCurrentLanguage] = useState("rus");
    const [form] = Form.useForm();
    const [countries, setCountries] = useState([]);
    const [fileList, setFileList] = useState();
    const dispatch = useAppDispatch();
    const [aim, setAim] = useState({ name: "", nameKZ: "" });
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState([]);
    const [scrollingLength, setScrollingLength] = useState({ skip: 0, limit: 10 });
    const [searchText, setSearchText] = useState({});
    const [maxCount, setMaxCount] = useState(0);
    const [reformattedLanguage, setReformattedLanguage] = useState([]);
    const [filesChanged, setFilesChanged] = useState(false);

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

    const loadMoreOptions = (type) => {
        const newLimit = scrollingLength.limit + 10;
        const limitedLimit = newLimit > maxCount[type] ? maxCount[type] : newLimit;

        setScrollingLength({ skip: scrollingLength.skip, limit: limitedLimit });
    };

    const handlePopupScroll = (e, type) => {
        const { target } = e;
        if (target.scrollTop + target.clientHeight === target.scrollHeight) {
            loadMoreOptions(type);
        }
    };

    const handleSearch = (value, type) => {
        setSearchText((prevData) => ({ ...prevData, [type]: value }));
    };


    const validateFileList = (rule, value) => {
        return new Promise<void>((resolve, reject) => {
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

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        onRemove: handleFileRemove,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true);
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.success" />)}`,
                );
            } else if (status === 'error') {
                void message.error(
                    `${info.file.name} ${(<IntlMessage id="medical.file.upload.error" />)}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        if (!fileList || fileList.length === 0) {
            return null;
        }
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFileList(response.link);
            // Return the response link so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };
    useEffect(() => {
        const getCountries = async () => {
            const response = await PrivateServices.get("/api/v1/additional/country", {
                params: {
                    skip: 0,
                    limit: 100,
                },
            });
            // reformat for select
            const countries = response?.data?.objects?.map((country: any) => ({
                label: country.name,
                value: country.id,
            }));
            setCountries(countries);
        };
        getCountries();
    }, []);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleInputAim = (event) => {
        setAim({
            ...aim,
            [currentLanguage === "rus" ? "name" : "nameKZ"]: event.target.value,
        });
    };

    const validateLocalizationAim = () => {
        const isRusEmpty = aim.name === null || aim.name.trim() === "";
        const isKZEmpty = aim.nameKZ === null || aim.nameKZ.trim() === "";

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

    const findSelectOption = async (id:string, type:string, setOptions) => {
        let response: components['schemas']['CountryRead'] | components['schemas']['VehicleTypeRead'];

        if(type==='country') {
            response = await AdditionalService.get_country_id(id)
        } else {
            response = await AdditionalService.get_vehicle_type_id(id);
        }

        // components['schemas']['CountryRead'] | components['schemas']['VehicleTypeRead']
            setOptions((prevData) => [
                ...new Set(prevData),
                { value: response.id, label: LocalText.getName(response), object: response },
            ]);
    };


    useEffect(() => {
        form.resetFields();
        let vehicle_typeKZ;
        // if (currentAbroadTrip.vehicle_type === "Самолет") {
        //     vehicle_typeKZ = "Ұшақ";
        // } else if (currentAbroadTrip.vehicle_type === "Машина") {
        //     vehicle_typeKZ = "Көлік";
        // } else if (currentAbroadTrip.vehicle_type === "Поезд") {
        //     vehicle_typeKZ = "Пойыз";
        // }

        findSelectOption(currentAbroadTrip.destination_country_id, 'country', setCountries);
        findSelectOption(currentAbroadTrip.vehicle_type_id, 'vehicle_type', setVehicleTypeOptions);

        console.log(currentAbroadTrip,'currentAbroadTrip')
        const values = {
            vehicle_type: currentAbroadTrip.vehicle_type_id,
            destination_country_id: currentAbroadTrip.destination_country_id,
            date: [
                moment(currentAbroadTrip?.date_from),
                moment(currentAbroadTrip?.date_to),
            ] as moment.Moment[],
            id: currentAbroadTrip.id,
        };
        form.setFieldsValue(values);
        setAim({ name: currentAbroadTrip.reason, nameKZ: currentAbroadTrip.reasonKZ });

        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(currentAbroadTrip.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [currentAbroadTrip, form, isOpen]);

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await handleFileUpload(values.dragger);
            const vehicle_type = await AdditionalService.get_vehicle_type_id(values.vehicle_type);
            const country = await AdditionalService.get_country_id(values.destination_country_id);


            const newObject = {
                vehicle_type: vehicle_type,
                vehicle_type_id: values.vehicle_type,
                destination_country_id: values.destination_country_id,
                destination_country: country,
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                reason: aim.name,
                reasonKZ: aim.nameKZ,
                document_link: response,
                id: currentAbroadTrip.id,
            };

            if (source === "get") {
                // Delete from GET slice
                dispatch(
                    deleteByPath({
                        path: "additional.data.abroad_travels", //+
                        id: currentAbroadTrip.id, // +
                    }),
                );
                // Add to Edited slice
                dispatch(
                    addFieldValue({
                        fieldPath: "edited.additional.abroad_travels", //+
                        value: newObject,
                    }),
                );
            }
            if (source === "edited") {
                // Edit current item in Edited slice (item already exists)
                dispatch(
                    replaceByPath({
                        path: "edited.additional.abroad_travels", //+
                        id: currentAbroadTrip.id, //+
                        newObj: newObject,
                    }),
                );
            }
            if (source === "added") {
                // Edit item in myInfo.allTabs
                dispatch(
                    replaceByPath({
                        path: "allTabs.additional.abroad_travels",
                        id: currentAbroadTrip.id,
                        newObj: newObject,
                    }),
                );
            }
            closeAndClear();
        } catch (error) {
            console.log(error);
        }
    };
    const closeAndClear = () => {
        form.resetFields();
        setAim({ name: "", nameKZ: "" });
        setFilesChanged(false);
        onClose();
    };



    const changeDispatchValues = (obj: any) => {
        if (source === "get") {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: "additional.data.abroad_travels",
                    id: currentAbroadTrip.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: "edited.additional.abroad_travels",
                    value: obj,
                }),
            );
        }
        if (source === "edited") {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: "edited.additional.abroad_travels",
                    id: currentAbroadTrip.id,
                    newObj: obj,
                }),
            );
        }
        if (source === "added") {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: "allTabs.additional.abroad_travels",
                    id: currentAbroadTrip.id,
                    newObj: obj,
                }),
            );
        }
    };

    const onDelete = () => {
        changeDispatchValues({ id: currentAbroadTrip.id, delete: true });
        closeAndClear();
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
                    <span>
                        <IntlMessage id={"edited.abroad_travel"} />
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
            onCancel={onClose}
            onOk={onOk}
            footer={
                <Row justify="end">
                    <Button danger onClick={onDelete}>
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                    <Button onClick={closeAndClear}>
                        <IntlMessage id={"candidates.warning.cancel"} />
                    </Button>
                    <Button type="primary" onClick={onOk}>
                        <IntlMessage id={"initiate.save"} />
                    </Button>
                </Row>
            }
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
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"service.data.modalAbroadTravel.vehicleTypeError"}
                                />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={vehicleTypeOptions}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                        placeholder={<IntlMessage id={"rank.give"} />}
                        onSearch={(e) => handleSearch(e, "vehicle_type")}
                        onPopupScroll={(e) => handlePopupScroll(e, "vehicle_type")}
                    />
                </Form.Item>
                <Form.Item
                    label={<IntlMessage id={"service.data.modalAbroadTravel.destinationCountry"} />}
                    name="destination_country_id"
                    rules={[
                        {
                            required: true,
                            message: (
                                <IntlMessage
                                    id={"service.data.modalAbroadTravel.destinationCountryError"}
                                />
                            ),
                        },
                    ]}
                    required
                >
                    <Select
                        options={countries}
                        showSearch
                        filterOption={(inputValue, option) =>
                            option?.label?.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
                        }
                        placeholder={<IntlMessage id={"rank.give"} />}
                        onSearch={(e) => handleSearch(e, "destination_country_id")}
                        onPopupScroll={(e) => handlePopupScroll(e, "destination_country_id")}
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
    );
};

export default AbroadTripEditModal;

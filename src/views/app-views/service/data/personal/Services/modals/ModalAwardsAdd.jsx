import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PrivateServices } from 'API';
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Upload,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import LanguageSwitcher from 'components/shared-components/LanguageSwitcher';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { S3_BASE_URL } from 'configs/AppConfig';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { headers } from 'services/myInfo/FileUploaderService';
import { addFieldValue } from 'store/slices/myInfo/myInfoSlice';
import { setAwardsList } from 'store/slices/servicesAwardsSlice';
import uuidv4 from 'utils/helpers/uuid';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const defaultMedal = 'https://10.15.3.180/s3/static/award-placeholder.png';

const namesBadgeOrders = {
    defaultMedal: { rus: 'Медали', kaz: 'Медальдар' },
    stateMedal: { rus: 'Государственная награда', kaz: 'Мемлекеттік награда' },
    otherMedal: { rus: 'Другие награды', kaz: 'Басқа марапаттар' },
};

const ModalAwardsAdd = ({ isOpen, onClose }) => {
    const [selectValues, setSelectValues] = useState({ name: '', nameKZ: '' });
    const [awardsOptions, setAwardsOptions] = useState({});
    const [fileError, setFileError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [disableImg, setDisableImg] = useState(true);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [reason, setReason] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [badgeOrder, setBadgeOrder] = useState(null);

    const [form] = useForm();
    const dispatch = useDispatch();

    const stateAwards = useSelector((state) => state.servicesAwards.stateAwards);
    const otherAwards = useSelector((state) => state.servicesAwards.otherAwards);
    const defaultAwards = useSelector((state) => state.servicesAwards.defaultAwards);

    const badgeOrderOptions = [
        {
            value: 0,
            label: namesBadgeOrders.otherMedal[currentLanguage],
        },
        {
            value: 1,
            label: namesBadgeOrders.defaultMedal[currentLanguage],
        },
        {
            value: 2,
            label: namesBadgeOrders.stateMedal[currentLanguage],
        },
    ];

    useEffect(() => {
        const formattingOptions = (data) => {
            return data.map((e) => {
                return {
                    value: e.id,
                    label: currentLanguage === 'rus' ? e.name : e.nameKZ,
                    object: e,
                };
            });
        };

        setAwardsOptions({
            0: formattingOptions(otherAwards),
            1: formattingOptions(defaultAwards),
            2: formattingOptions(stateAwards),
        });
    }, [stateAwards, otherAwards, defaultAwards, currentLanguage]);

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name.trim() === '';
        const isKZEmpty = reason.nameKZ.trim() === '';

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

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        if (info.file.status === 'done') {
            getBase64(
                info.file.originFileObj,
                (imageUrl) => setImageUrl(imageUrl),
                setLoading(false),
            );
            setAvatar(info.file.response.link);
            setFileError(false);
        }
    };

    const selectBadge = (event) => {
        const image = awardsOptions[badgeOrder].find((item) => item.value === event);

        if (image.object.url) {
            setImageUrl(image.object.url);
            setDisableImg(true);
        } else {
            setDisableImg(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">
                <IntlMessage id="candidates.button.download" />
            </div>
        </div>
    );

    const disabledDate = (current) => {
        return current && current > moment().startOf('day');
    };

    const valuesChange = (event, lang) => {
        setSelectValues({
            ...selectValues,
            [lang === 'ru' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleAddNewOption = async () => {
        const types = { 0: 'otherAwards', 1: 'defaultAwards', 2: 'stateAwards' };

        dispatch(
            setAwardsList({
                type: types[badgeOrder],
                object: {
                    id: selectValues.name,
                    label: LocalText.getName(selectValues),
                    url: null,
                    names: { name: selectValues.name, nameKZ: selectValues.nameKZ },
                    badge_order: badgeOrder,
                    name: selectValues.name,
                    nameKZ: selectValues.nameKZ,
                },
            }),
        );

        setSelectValues({ name: '', nameKZ: '' });
    };

    const createNewBadge = async (body) => {
        const newItem = await PrivateServices.post('/api/v1/badge_types', {
            body,
        });

        return {
            value: newItem.data.id,
            label: LocalText.getName(newItem.data),
            url: newItem.data.url,
            badge_order: newItem.data.badge_order,
        };
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newItemsPromises = awardsOptions[badgeOrder]
                .filter((item) => item.object.names)
                .map((item) =>
                    createNewBadge({
                        name: item.object.name,
                        nameKZ: item.object.nameKZ,
                        url: avatar ? avatar : defaultMedal,
                        badge_order: values.badge_order,
                    }),
                );

            const newItems = await Promise.all(newItemsPromises);

            const newOptions = [
                ...awardsOptions[badgeOrder].filter((item) => !item.object.names),
                ...newItems,
            ];

            const currentBadge = newOptions.find(
                (medal) =>
                    values.badge_type_id === medal.value || values.badge_type_id === medal.label,
            );

            const newAwards = {
                id: uuidv4(),
                badge_type_id: currentBadge.value,
                document_number: values.document_number,
                date_from: values.date_from.toDate(),
                url: currentBadge?.url ? currentBadge?.url : avatar ? avatar : defaultMedal,
                name: currentBadge.label,
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                badge_order: values.badge_order,
            };

            dispatch(
                addFieldValue({
                    fieldPath: 'allTabs.services.awards',
                    value: newAwards,
                }),
            );

            handleCLose();
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const handleCLose = () => {
        form.resetFields();
        setReason({ name: '', nameKZ: '' });
        setBadgeOrder(null);
        setAvatar(null);
        setImageUrl(null);
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>
                            <IntlMessage id="awards.add" />
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
                open={isOpen}
                onCancel={handleCLose}
                onOk={handleOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            >
                <Form form={form} layout="vertical">
                    <Row style={{ height: 80 }}>
                        <Col xs={5}>
                            <Form.Item name="avatar">
                                <Upload
                                    disabled={disableImg}
                                    listType="picture-card"
                                    className={`avatar-uploader ${fileError && 'hasError '}`}
                                    showUploadList={false}
                                    action={`${S3_BASE_URL}/upload`}
                                    onChange={handleChange}
                                    headers={headers}
                                    data={{ file: 'file' }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="candidates.warning.downloadfile" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} className="avatar-image" alt="" />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col xs={19}>
                            <Form.Item
                                name="badge_order"
                                label={<IntlMessage id="awards.name" />}
                                rules={[
                                    { required: true, message: <IntlMessage id="awards.select" /> },
                                ]}
                                required
                            >
                                <Select
                                    placeholder={IntlMessageText.getText({
                                        id: 'awards.choose.placeholder',
                                    })}
                                    options={badgeOrderOptions}
                                    onChange={(e) => {
                                        setBadgeOrder(e);
                                        setAvatar(null);
                                        setImageUrl(null);
                                        form.setFieldsValue({
                                            badge_type_id: null,
                                        });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={5} />
                        <Col xs={19}>
                            <Form.Item
                                name="badge_type_id"
                                label={<IntlMessage id="awards.name" />}
                                rules={[
                                    { required: true, message: <IntlMessage id="awards.select" /> },
                                ]}
                                required
                            >
                                <Select
                                    disabled={badgeOrder == null}
                                    placeholder={<IntlMessage id={'awards.add.placeholder'} />}
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px', height: 150 }}>
                                                <Row>
                                                    {['ru', 'kz'].map((lang, idx) => (
                                                        <Input
                                                            key={lang}
                                                            value={
                                                                lang === 'ru'
                                                                    ? selectValues.name
                                                                    : selectValues.nameKZ
                                                            }
                                                            onChange={(e) => valuesChange(e, lang)}
                                                            placeholder={IntlMessageText.getText({
                                                                id: `userData.modals.add.type.${lang}`,
                                                            })}
                                                            style={{
                                                                ...(idx !== 0
                                                                    ? { marginTop: 10 }
                                                                    : {}),
                                                            }}
                                                        />
                                                    ))}
                                                </Row>
                                                <Row align="top" className="fam_select_add_button">
                                                    <Button
                                                        type="text"
                                                        icon={<PlusOutlined />}
                                                        onClick={handleAddNewOption}
                                                        disabled={
                                                            selectValues.name.trim() === '' ||
                                                            selectValues.nameKZ.trim() === ''
                                                        }
                                                    >
                                                        <IntlMessage id="Button.add" />
                                                    </Button>
                                                </Row>
                                            </Space>
                                        </>
                                    )}
                                    onChange={selectBadge}
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            ?.toLowerCase()
                                            ?.indexOf(inputValue.toLowerCase()) >= 0
                                    }
                                    options={badgeOrder == null ? [] : awardsOptions[badgeOrder]}
                                    showSearch
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item
                        name="reason"
                        label={<IntlMessage id={'awards.reason'} />}
                        rules={[
                            {
                                validator: validateLocalizationReason,
                            },
                        ]}
                        required
                    >
                        <TextArea
                            autoSize={{ minRows: 2, maxRows: 6 }}
                            value={currentLanguage === 'rus' ? reason.name : reason.nameKZ}
                            onChange={handleInputReason}
                            onPressEnter={(e) => e.stopPropagation()}
                            onKeyPress={(e) => e.stopPropagation()}
                            placeholder={IntlMessageText.getText({
                                id: 'awards.reason.placeholder',
                            })}
                        />
                        <p className="fam_invisible_text">
                            {currentLanguage === 'rus' ? reason.name : reason.nameKZ}
                        </p>
                    </Form.Item>
                    <Row>
                        <p className="fam_form_title_symbol">*</p>
                        <p className="fam_form_title_text">
                            <IntlMessage id={'service.data.modalAddPsycho.docInfo'} />
                        </p>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col xs={12}>
                            <Form.Item
                                name="document_number"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="service.data.modalAddPsycho.chooseDoc" />
                                        ),
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <Input
                                    placeholder={IntlMessageText.getText({
                                        id: 'service.data.modalAddPsycho.docNum',
                                    })}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12}>
                            <Form.Item
                                name="date_from"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="awards.select.date.provide" />,
                                    },
                                ]}
                                required
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker
                                    placeholder={IntlMessageText.getText({
                                        id: 'service.data.modalAcademicDegree.dateGiveTxt',
                                    })}
                                    style={{ width: '100%' }}
                                    disabledDate={disabledDate}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAwardsAdd;

import { Col, Modal, Row, Select, Input, DatePicker, Form, Button, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { addFieldValue, replaceByPath } from 'store/slices/myInfo/myInfoSlice';
import { deleteByPath } from 'store/slices/myInfo/servicesSlice';
import { S3_BASE_URL } from 'configs/AppConfig';
import { headers } from 'services/myInfo/FileUploaderService';
import TextArea from 'antd/es/input/TextArea';
import LanguageSwitcher from 'components/shared-components/LanguageSwitcher';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import ServicesService from 'services/myInfo/ServicesService';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const namesBadgeOrders = {
    defaultMedal: { rus: 'Медали', kaz: 'Медальдар' },
    stateMedal: { rus: 'Государственная награда', kaz: 'Мемлекеттік награда' },
    otherMedal: { rus: 'Другие награды', kaz: 'Басқа марапаттар' },
};

const ModalAwardsEdit = ({ isOpen, onClose, award, source = 'get' }) => {
    const [awardsOptions, setAwardsOptions] = useState({});
    const [badgeOrder, setBadgeOrder] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [badgeId, setBadgeId] = useState(null);
    const [reason, setReason] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');

    const [form] = useForm();
    const dispatch = useDispatch();

    const badge_types = useSelector((state) => state.services.badge_types.objects);
    const user = useSelector((state) => state.users.user);

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

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(
                info.file.originFileObj,
                (imageUrl) => setImageUrl(imageUrl),
                setLoading(false),
            );
            setAvatar(info.file.response.link);
            setFileError(false);
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

    useEffect(() => {
        form.resetFields();
        if (!Array.isArray(badge_types)) {
            return;
        }
        const currentBadge = badge_types.find((item) => item.name === award.name);
        const badge_type_id = award?.badge_type_id ? award.badge_type_id : currentBadge?.id;
        setBadgeOrder(award.badge_order);

        const values = {
            id: award.id,
            badge_type_id: badge_type_id,
            document_number: award.document_number,
            date_from: moment(award.date_from),
            badge_order: award.badge_order,
        };

        setImageUrl(award.url);
        setReason({
            name: award.reason,
            nameKZ: award.reasonKZ,
        });

        form.setFieldsValue(values);
    }, [form, isOpen, award]);

    const disabledDate = (current) => {
        return current && current > moment().startOf('day');
    };

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'serviceData.badges',
                    id: obj.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.services.awards',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.services.awards',
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.services.awards',
                    id: obj.id,
                    newObj: obj,
                }),
            );
        }
        handleClose();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            const newAwards = {
                id: award.id,
                badge_type_id: values.badge_type_id,
                document_number: values.document_number,
                date_from: values.date_from.toDate(),
                url: badge_types.find((item) => item.id === values.badge_type_id).url,
                name: badge_types.find((item) => item.id === values.badge_type_id).name,
                nameKZ: badge_types.find((item) => item.id === values.badge_type_id).nameKZ,
                reason: reason.name,
                reasonKZ: reason.nameKZ,
                badge_order: values.badge_order,
            };

            const badgeTypeId = form.getFieldValue('badge_type_id')
            const data = {
                user_id: user.id,
                badge_type_id: badgeTypeId,
                url: awardsOptions[badgeOrder].find((item) => item.value === badgeTypeId)?.url || '',
            };

            await ServicesService.updateBadges(data, award.id);
            changeDispatchValues(newAwards);
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    const handleDelete = () => {
        changeDispatchValues({ id: award.id, delete: true });
    };

    const handleClose = () => {
        onClose();
    };

    const validateLocalizationReason = () => {
        const isRusEmpty = reason.name === '' || reason.name === null;
        const isKZEmpty = reason.nameKZ === '' || reason.nameKZ === null;

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

    const handleInputReason = (event) => {
        setReason({
            ...reason,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const selectBadge = (event) => {
        const image = awardsOptions[badgeOrder].find((item) => item.value === event);

        if (image.object.url) {
            setImageUrl(image.object.url);
        }
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
                onCancel={handleClose}
                footer={
                    <Row justify="end">
                        <Button danger onClick={handleDelete}>
                            <IntlMessage id={'initiate.deleteAll'} />
                        </Button>
                        <Button onClick={handleClose}>
                            <IntlMessage id={'service.data.modalAddPsycho.cancel'} />
                        </Button>
                        <Button type="primary" onClick={handleOk}>
                            <IntlMessage id={'service.data.modalAddPsycho.save'} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row style={{ height: 80 }}>
                        <Col xs={5}>
                            <Form.Item name="avatar">
                                <Upload
                                    disabled={true}
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
                                    onChange={(value) => {
                                        setBadgeOrder(value);
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
                                    onChange={selectBadge}
                                    filterOption={(inputValue, option) =>
                                        option.label
                                            .toLowerCase()
                                            .indexOf(inputValue.toLowerCase()) >= 0
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
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                        required
                        style={{ marginBottom: 0 }}
                    >
                        <Row gutter={7}>
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
                                            message: (
                                                <IntlMessage id="awards.select.date.provide" />
                                            ),
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
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalAwardsEdit;

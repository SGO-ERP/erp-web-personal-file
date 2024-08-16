import { InboxOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Row, Upload } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import { addFieldValue, replaceByPath } from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { deleteByPath } from '../../../../../../../store/slices/myInfo/servicesSlice';
import IntlMessage from 'components/util-components/IntlMessage';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

export default function ModalEditWorkExperience({ isOpen, onClose, experience }) {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);
    const [nameOrganization, setNameOrganization] = useState({ name: '', nameKZ: '' });
    const [namePosition, setNamePosition] = useState({ name: '', nameKZ: '' });
    const [currentLanguage, setCurrentLanguage] = useState('rus');
    const [source, setSource] = useState('');

    const handleFileRemove = () => {
        form.setFieldsValue({ dragger: [] });
        setFilesChanged(true);
    };

    const handleInputNameOfOrganization = (event) => {
        setNameOrganization({
            ...nameOrganization,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };
    const validateLocalizationOrganization = () => {
        const isRusEmpty = nameOrganization.name === '' || nameOrganization.name === null;
        const isKZEmpty = nameOrganization.nameKZ === '' || nameOrganization.nameKZ === null;

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

    const validateLocalizationPosition = () => {
        const isRusEmpty = namePosition.name === '' || namePosition.name === null;
        const isKZEmpty = namePosition.nameKZ === '' || namePosition.nameKZ === null;

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

    const handleInputNamePosition = (event) => {
        setNamePosition({
            ...namePosition,
            [currentLanguage === 'rus' ? 'name' : 'nameKZ']: event.target.value,
        });
    };

    const validateFileList = (rule, value) => {
        setFilesChanged(true);
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                resolve();
            } else if (value.length > 1) {
                reject('Пожалуйста, загрузите только один файл'); //+
            } else {
                resolve();
            }
        });
    };

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

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
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error('Не удалось загрузить файл.');
        }
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        onRemove: handleFileRemove,
        name: 'file',
        multiple: true,
        accept: '.pdf,.jpg,.jpeg, .png', // разрешенные расширения
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                void message.success(`${info.file.name} файл успешно загружен.`);
            } else if (status === 'error') {
                void message.error(`${info.file.name} не удалось загрузить файл.`);
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const changeDispatchValues = (obj) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'serviceData.experience',
                    id: experience.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.services.workExperience',
                    value: obj,
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.services.workExperience',
                    id: experience.id,
                    newObj: obj,
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.services.workExperience',
                    id: experience.id,
                    newObj: obj,
                }),
            );
        }
        handleClose();
    };

    const onOk = async () => {
        try {
            const values = await form.validateFields();
            const link = filesChanged
                ? await handleFileUpload(values.dragger)
                : experience.document_link;

            const newObject = {
                id: experience.id,
                position_work_experience: namePosition.name,
                position_work_experienceKZ: namePosition.nameKZ,
                name_of_organization: nameOrganization.name,
                name_of_organizationKZ: nameOrganization.nameKZ,
                date_from: values.date[0].toDate(),
                date_to: values.date[1].toDate(),
                is_credited: values.credited,
                document_style: values.document_type,
                document_number: values.document_number,
                document_link: link,
                date_credited: values.registration_date.toDate(),
                source: experience.source ? experience.source : 'edited'
            };
            changeDispatchValues(newObject);
        } catch (error) {
            console.log('Form validation error', error);
        }
    };

    useEffect(() => {
        form.resetFields();

        const date =
            experience.date_from && experience.date_to
                ? [moment(experience.date_from), moment(experience.date_to)]
                : null;
        const values = {
            date,
            credited: experience.is_credited,
            document_type: experience.document_style,
            document_number: experience.document_number,
            registration_date:
                experience.date_credited !== null ? moment(experience.date_credited) : null,
        };
        form.setFieldsValue(values);

        setSource(experience.source ? experience.source : 'get');

        setNameOrganization({
            name: experience.name_of_organization,
            nameKZ: experience.name_of_organizationKZ,
        });
        setNamePosition({
            name: experience.position_work_experience,
            nameKZ: experience.position_work_experienceKZ,
        });
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(experience.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [experience, form, isOpen]);

    const onDelete = () => {
        changeDispatchValues({ id: experience.id, delete: true });
    };

    const handleClose = () => {
        form.resetFields();
        setFilesChanged(false);
        setNamePosition({ name: '', nameKZ: '' });
        setNameOrganization({ name: '', nameKZ: '' });
        setSource('');
        onClose();
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title="Добавить/редактировать опыт работы"
                title={
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginRight: '20px',
                            alignItems: 'center',
                        }}
                    >
                        <span>Добавить/редактировать опыт работы</span>

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
                onOk={onOk}
                okText={'Отправить'}
                cancelText={'Отменить'}
                onCancel={handleClose}
                footer={
                    <Row justify="end">
                        <Button danger onClick={onDelete}>
                            <IntlMessage id={'initiate.deleteAll'} />
                        </Button>
                        <Button onClick={handleClose}>
                            <IntlMessage id={'service.data.modalAddPsycho.cancel'} />
                        </Button>
                        <Button type="primary" onClick={onOk}>
                            <IntlMessage id={'service.data.modalAddPsycho.save'} />
                        </Button>
                    </Row>
                }
            >
                <Form form={form} layout="vertical">
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        Наименование организации
                                    </span>
                                }
                                name="organization"
                                rules={[
                                    {
                                        validator: validateLocalizationOrganization,
                                    },
                                ]}
                                required
                            >
                                <Input
                                    value={
                                        currentLanguage === 'rus'
                                            ? nameOrganization.name
                                            : nameOrganization.nameKZ
                                    }
                                    onChange={handleInputNameOfOrganization}
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === 'rus'
                                        ? nameOrganization.name
                                        : nameOrganization.nameKZ}
                                </p>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={24}>
                            <Form.Item
                                label={
                                    <span style={{ fontSize: '14px' }}>Занимаемая должность</span>
                                }
                                name="position"
                                rules={[
                                    {
                                        validator: validateLocalizationPosition,
                                    },
                                ]}
                                required
                            >
                                <Input
                                    value={
                                        currentLanguage === 'rus'
                                            ? namePosition.name
                                            : namePosition.nameKZ
                                    }
                                    onChange={handleInputNamePosition}
                                />
                                <p className="fam_invisible_text">
                                    {currentLanguage === 'rus'
                                        ? namePosition.name
                                        : namePosition.nameKZ}
                                </p>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col xs={24}>
                            <Form.Item
                                label={<span style={{ fontSize: '14px' }}>Период работы</span>}
                                name="date"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Введите период работы',
                                    },
                                ]}
                                required
                            >
                                <DatePicker.RangePicker
                                    // defaultValue={'Дата регистрации'}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={12} style={{ marginTop: '-10px', height: 40 }}>
                            <Form.Item name="credited" valuePropName="checked">
                                <Checkbox>Засчитано приказом</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label={<span> Сведения о документе</span>}>
                        <Row gutter={5}>
                            <Col xs={12}>
                                <Form.Item name="document_number">
                                    <Input placeholder="Номер документа" />
                                </Form.Item>
                            </Col>
                            <Col xs={12}>
                                <Form.Item
                                    initialValue={moment(experience.date_credited)}
                                    name="registration_date"
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        label={<span style={{ fontSize: '14px' }}>Документ рекомендации</span>}
                    >
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                        >
                            <Upload.Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Нажмите или наведите файл для загрузки
                                </p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

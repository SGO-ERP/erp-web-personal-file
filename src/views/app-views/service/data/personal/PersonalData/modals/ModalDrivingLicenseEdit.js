import { InboxOutlined } from '@ant-design/icons';
import { Form, message, Modal, Upload } from 'antd';
import { fileExtensions } from 'constants/FileExtensionConstants';
import 'moment/locale/ru';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteByPath } from 'store/slices/myInfo/personalInfoSlice';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
import {
    addFieldValue,
    deleteByPathMyInfo,
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import IntlMessage from 'components/util-components/IntlMessage';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const { Dragger } = Upload;

const ModalDrivingLicenseEdit = ({ isOpen, onClose, license, source = 'get' }) => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const [filesChanged, setFilesChanged] = useState(false);
    const driving_license = useSelector(
        (state) => state.myInfo.edited.personal_data.driving_license,
    );
    // const personal_data_remote = useSelector((state) => state.personalInfo.personalInfoData);
    const handleFileUpload = async (fileList) => {
        setFilesChanged(true);
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFile(response.link);
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id="medical.file.upload.error" />);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const [form] = Form.useForm();

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id="candidates.warning.file" />);
            } else if (value.length > 1) {
                reject('Пожалуйста, загрузите один файл');
            } else {
                resolve();
            }
        });
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения

        onChange(info) {
            setFilesChanged(true);
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

    const onOk = async () => {
        const values = await form.validateFields();
        const response = filesChanged
            ? await handleFileUpload(values.dragger)
            : license.document_link;
        if (response) {
            const newObject = {
                document_link: response,
                profile_id: license.profile_id,
                id: license.id,
            };

            if (source === 'get' && !driving_license?.length) {
                // Delete from GET slice

                dispatch(
                    deleteByPath({
                        path: 'personalInfoData.driving_license',
                        id: license.id,
                    }),
                );
                // Add to Edited slice'

                dispatch(
                    setFieldValue({
                        fieldPath: 'edited.personal_data.driving_license',
                        value: [...driving_license, newObject],
                        id: license.id,
                    }),
                );
            } else {
                dispatch(
                    deleteByPathMyInfo({
                        path: 'edited.personal_data.driving_license',
                        id: license.id,
                    }),
                );
                dispatch(
                    addFieldValue({
                        fieldPath: 'edited.personal_data.driving_license',
                        value: newObject,
                        id: license.id,
                    }),
                );
            }

            // if (source === 'edited') {
            //     // Edit current item in Edited slice (item already exists)
            //     dispatch(
            //         replaceByPath({
            //             path: 'edited.personal_data.driving_license',
            //             id: license.id,
            //             newObj: newObject,
            //         }),
            //     );
            // }
            // if (source === 'added') {
            //     // Edit item in myInfo.allTabs
            //     dispatch(
            //         replaceByPath({
            //             path: 'allTabs.personal_data.driving_license',
            //             id: license.id,
            //             newObj: newObject,
            //         }),
            //     );
            // }
        }
        form.resetFields();
        setFilesChanged(false);
        onClose();
    };

    useEffect(() => {
        form.resetFields();
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(license.document_link);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [license, form, isOpen]);

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавить достижение в спорте'}
                title={<IntlMessage id={'skill.driving.license.edit'} />}
                onClick={(e) => e.stopPropagation()}
                open={isOpen}
                onCancel={onClose}
                onOk={onOk}
                okText="Сохранить"
                cancelText="Отменить"
                style={{ height: '500px', width: '400px' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Подтверждающий документ">
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                        >
                            <Dragger fileList={file} {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Нажмите или наведите файл для загрузки
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ModalDrivingLicenseEdit;

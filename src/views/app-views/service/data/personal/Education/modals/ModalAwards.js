import { InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Cascader, Col, DatePicker, Form, Input, Modal, Row, Upload, message } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { fileExtensions } from 'constants/FileExtensionConstants';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAwards } from 'store/slices/myInfo/servicesSlice';
import { disabledDate } from 'utils/helpers/futureDateHelper';
import uuidv4 from 'utils/helpers/uuid';
import LanguageSwitcher from '../../../../../../../components/shared-components/LanguageSwitcher';
import { S3_BASE_URL } from '../../../../../../../configs/AppConfig';
import FileUploaderService, {
    headers,
} from '../../../../../../../services/myInfo/FileUploaderService';
import {
    setFieldValue,
} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import IntlMessage, { IntlMessageText } from 'components/util-components/IntlMessage';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

const ModalAwards = ({ isOpen, onClose, award, source = 'get' }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [fileError, setFileError] = useState(null);
    const dispatch = useDispatch();
    const award_edited = useSelector((state) => state.myInfo.edited.services.awards);
    const [filesChanged, setFilesChanged] = useState(false);

    const awardOptions =
        award &&
        award.map((item) => ({
            value: item.id,
            label: item.name,
        }));

    useEffect(() => {
        if (award.length === 0) {
            dispatch(getAwards());
        }
    }, [dispatch, award]);

    function normFile(e) {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const handleChange = (info) => {
        setFilesChanged(true); //+
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

    const validateFileList = (rule, value) => {
        return new Promise((resolve, reject) => {
            if (!value || value.length === 0) {
                reject(<IntlMessage id={'service.data.modalAddPsycho.pleaseLoadFile'} />);
            } else {
                resolve();
            }
        });
    };

    const handleFileUpload = async (fileList) => {
        const formData = new FormData();
        setFilesChanged(true); //+
        fileList.forEach((file) => {
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await FileUploaderService.upload(formData);
            setFile(response.link);
            // Return the response link, so it can be used in the onOk function
            return response.link;
        } catch (error) {
            void message.error(<IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile'} />);
        }
    };

    const props = {
        action: `${S3_BASE_URL}/upload`,
        headers,
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
            setFilesChanged(true); //+
            const { status } = info.file;
            if (status === 'done') {
                void message.success(
                    `${info.file.name} ${(
                        <IntlMessage id={'service.data.modalAddPsycho.successLoadFile'} />
                    )}`,
                );
            } else if (status === 'error') {
                void message.error(
                    `${info.file.name} ${(
                        <IntlMessage id={'service.data.modalAddPsycho.cannotLoadFile2'} />
                    )}`,
                );
            }
        },
        beforeUpload: () => {
            return false;
        },
        rules: [{ validator: validateFileList }],
    };

    const { id } = useParams();

    const onOk = async () => {
        void form.validateFields();
        if (!avatar) {
            setFileError(true);
            return;
        }

        try {
            const values = await form.validateFields();
            const response = filesChanged
                ? await handleFileUpload(values.dragger)
                : award.document_link;

            if (response) {
                const newObject = {
                    type: 'badge_history',
                    type_id: values.type[0],
                    user_id: id,
                    date_from: values.date_from.toDate(),
                    document_link: response,
                    document_number: values.document_number,
                    name: values.name,
                    url: avatar,
                    id: uuidv4(),
                };


                dispatch(
                    setFieldValue({
                        fieldPath: 'allTabs.services.awards',
                        value: [...award_edited, newObject],
                    }),
                );
                form.resetFields();
                onClose();
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    useEffect(() => {
        form.resetFields();
        const values = {
            name: award.name,
            document_number: award.document_number,
            date_from: moment(award.date_from),
        };
        form.setFieldsValue(values);
        const getFile = async () => {
            const file = await FileUploaderService.getFileByLink(award.document_link, award.url);
            form.setFieldsValue({
                dragger: [file],
            });
        };
        getFile();
    }, [award, form,isOpen]);

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className="ant-upload-text">
                <IntlMessage id="candidates.button.download" />
            </div>
        </div>
    );

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal
                // title={'Добавление наград и поощрений'}
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
                        <LanguageSwitcher size="small" fontSize="12px" height="1.4rem" />
                    </div>
                }
                open={isOpen}
                onCancel={onClose}
                onOk={onOk}
                okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
                cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
            >
                <Form form={form} layout="vertical">
                    <Row>
                        <Col xs={5}>
                            <Form.Item name="avatar">
                                <Upload
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
                                name="type"
                                label={
                                    <span style={{ fontSize: '14px' }}>
                                        <IntlMessage id="awards.name" />
                                    </span>
                                }
                                rules={[
                                    { required: true, message: <IntlMessage id="awards.select" /> },
                                ]}
                                required
                            >
                                <Cascader options={awardOptions} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* <p style={{ fontSize: '14px' }}>Сведения о документе</p> */}
                    <Form.Item
                        label={
                            <span style={{ fontSize: '14px' }}>
                                <IntlMessage id="service.data.modalAddPsycho.docInfo" />
                            </span>
                        }
                    >
                        <Row gutter={7}>
                            <Col xs={8}>
                                <Form.Item
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="service.data.modalEducation.chooseDocType" />
                                            ),
                                        },
                                    ]}
                                    required
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: 'service.data.modalEducation.DocType',
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={8}>
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
                                >
                                    <Input
                                        placeholder={IntlMessageText.getText({
                                            id: 'service.data.modalAddPsycho.docNum',
                                        })}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={8}>
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
                                >
                                    <DatePicker
                                        placeholder={IntlMessageText.getText({
                                            id: 'service.data.modalAcademicDegree.dateGiveTxt',
                                        })}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item required>
                        <Form.Item
                            name="dragger"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            noStyle
                            rules={[{ validator: validateFileList }]}
                            required
                        >
                            <Dragger fileList={file} {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    <IntlMessage id="service.data.modalLanguage.chooseFileLoad" />
                                </p>
                            </Dragger>
                        </Form.Item>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
export default ModalAwards;

import React from 'react';
import { Button, message, Modal, Upload, UploadProps } from 'antd';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { fileExtensions } from '../../../../../../../constants/FileExtensionConstants';
import { DownloadOutlined } from '@ant-design/icons';

interface Props {
    onClose: () => void;
    isOpen: boolean;
}
const ModalBackAnswer = ({ isOpen, onClose }: Props) => {
    const onOk = () => {
        onClose();
    };

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        accept: fileExtensions, // разрешенные расширения
        onChange(info) {
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
    };

    return (
        <Modal
            title={<IntlMessage id={'modal.upload.file'} />}
            open={isOpen}
            onCancel={onClose}
            okText={<IntlMessage id={'service.data.modalAddPsycho.save'} />}
            onOk={onOk}
            cancelText={<IntlMessage id={'service.data.modalAddPsycho.cancel'} />}
        >
            <div className={'style-upload'}>
                <Upload {...props}>
                    <Button
                        style={{
                            margin: '24px',
                            color: '#366EF6',
                            backgroundColor: '#3E79F71A',
                            border: '1px dashed',
                            borderColor: '#91D5FF',
                            borderRadius: '10px',
                        }}
                        icon={<DownloadOutlined />}
                    >
                        {' '}
                        <IntlMessage id={'title.upload.integration.json'} />
                    </Button>
                </Upload>
            </div>
        </Modal>
    );
};

export default ModalBackAnswer;

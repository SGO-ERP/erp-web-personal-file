import React, { useState } from 'react';
import { Modal, Upload } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
import mammoth from 'mammoth/mammoth.browser.js';
import IntlMessage from 'components/util-components/IntlMessage';
import {
    saveTextKZ,
    saveTextRU,
    showAddDoc,
} from 'store/slices/newConstructorSlices/constructorNewSlice';
import { S3_BASE_URL } from "configs/AppConfig";
import { headers } from "services/myInfo/FileUploaderService";

const AddDocModal = () => {
    const { page, docModal } = useSelector((state) => state.constructorNew);
    const [fileList, setFileList] = useState([]);

    const [uploadedFile, setUploadedFile] = useState(null);

    const { Dragger } = Upload;
    const dispatch = useDispatch();

    let text;

    function getExtension(fileName) {
        let re = /(?:\.([^.]+))?$/;
        return re.exec(fileName)[1];
    }

    const handleFileUpload = async (file) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            try {
                const result = await mammoth.convertToHtml({ arrayBuffer });
                text = result.value;
                if (page === 1) {
                    dispatch(saveTextRU(text));
                } else if (page === 0) {
                    dispatch(saveTextKZ(text));
                }
            } catch (error) {
                console.error('Error reading .docx file:', error);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleCancel = () => {
        dispatch(showAddDoc(false));
        setFileList([]);
        setUploadedFile(null);
    };

    const handleOk = async () => {
        if (uploadedFile !== null) {
            await handleFileUpload(uploadedFile);
            dispatch(showAddDoc(false));
            setFileList([]);
            setUploadedFile(null);
        }
    };

    return (
        <div>
            <Modal
                title={localStorage.getItem('lan') === 'kk' ? 'Үлгіні жүктеу' : 'Загрузить шаблон'}
                open={docModal}
                okText={localStorage.getItem('lan') === 'kk' ? 'Сақтау' : 'Сохранить'}
                cancelText={localStorage.getItem('lan') === 'kk' ? 'Жабу' : 'Закрыть'}
                onCancel={handleCancel}
                onOk={handleOk}
            >
                <Dragger
                    action={`${S3_BASE_URL}/upload`}
                    headers={headers}
                    accept=".docx"
                    onChange={(info) => {
                        if (info.file.status === 'removed') {
                            setFileList([]);
                            setUploadedFile(null);
                        } else {
                            if (getExtension(info.file.name) === 'docx') {
                                setUploadedFile(info.file);
                                setFileList([info.file]);
                            } else {
                                setFileList([]);
                                setUploadedFile(null);
                            }
                        }
                    }}
                    style={{
                        minHeight: '0px',
                        backgroundColor: 'rgba(62, 121, 247, 0.1)',
                        border: '1px dashed #91D5FF',
                    }}
                    beforeUpload={() => false}
                    fileList={fileList}
                >
                    <p className="docAddBtn">
                        <DownloadOutlined /> <IntlMessage id="constructor.dragAndDropHere.select" />
                    </p>
                </Dragger>
            </Modal>
        </div>
    );
};

export default AddDocModal;

import { Button, Col, Modal, notification, Row } from 'antd';
import { useEffect, useRef } from 'react';
import FileUploaderService from 'services/myInfo/FileUploaderService';
import IntlMessage from '../../../../../components/util-components/IntlMessage';

const isDocument = (link) => {
    return link.includes('generate');
};

const ModalForDoc = ({ setModalState, modalState }) => {
    const handleOk = () => {
        setModalState({
            open: false,
            link: '',
        });
    };

    const linkRef = useRef(null);

    function handleCancel() {
        setModalState({
            open: false,
            link: '',
        });
    }

    const downloadDocxFile = async (link) => {
        try {
            const { blob, filename } = await FileUploaderService.getBlobByLink(link);

            const url = URL.createObjectURL(blob);

            linkRef.current.href = url;
            linkRef.current.download = filename;
            linkRef.current?.click();

            URL.revokeObjectURL(url);
        } catch (e) {
            notification.error({ message: <IntlMessage id="service.data.modelForDocError" /> });
        }
    };
    useEffect(() => {
        if (!modalState.open && modalState.link === '') return;

        if (modalState.link !== '' && !modalState.open) {
            setModalState((prevState) => ({ ...prevState, open: true }));
        }

        // if

        // if (!modalState.open && modalState.link === '') return;

        // if (modalState.open && modalState.link.length > 0) {
        //     console.log('OPEN TRUE');
        //     setModalState((prevState) => ({ ...prevState, open: true }));
        //     return;
        // }
        // if (modalState.link !== '' && modalState.open) {
        //     notification.error({ message: 'Ошибка при загрузке файла' });
        //     console.log('OPEN FAlSE');
        //     return;
        // }
    }, [modalState, setModalState]);

    return (
        <div>
            <Modal
                title={<IntlMessage id={'service.data.doc'} />}
                open={modalState.open}
                onCancel={handleCancel}
                onOk={handleOk}
                footer={null}
                style={{ height: '500px', width: '400px' }}
            >
                <a download="file" ref={linkRef} />

                <Button type={'primary'} onClick={() => downloadDocxFile(modalState.link)}>
                    <IntlMessage id={'service.data.downloadDoc'} />
                </Button>
                <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    {isDocument(modalState.link) ? null : (
                        <>
                            <Col>
                                <Button type={'primary'} onClick={handleOk}>
                                    Ок
                                </Button>
                            </Col>
                        </>
                    )}
                </Row>
            </Modal>
        </div>
    );
};

export default ModalForDoc;

import { Button, Col, Modal, Row, Table, Badge, notification } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getBlackBeretHistory } from 'store/slices/myInfo/servicesSlice';
import { FileTextTwoTone } from '@ant-design/icons';
import FileUploaderService from '../../../../../../../services/myInfo/FileUploaderService';
interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ModalBlackBeretHistory = ({ isOpen, onClose }: Props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!id) return;
        // @ts-expect-error FIXME: Expected 0 arguments, but got 1.ts(2554)
        dispatch(getBlackBeretHistory(id));
    }, []);

    const { t } = useTranslation();
    // @ts-expect-error FIXME: Property 'coolnessHistory' does not exist on type '{}'.
    const blackBeretHistory = useSelector((state) => state.services.blackBeretHistory);
    const linkRef = useRef<HTMLAnchorElement | null>(null);


    const downloadDocxFile = async (link: string) => {
        try {
            const { blob, filename } = await FileUploaderService.getBlobByLink(link);

            const url = URL.createObjectURL(blob);

            linkRef.current?.setAttribute('href', url);
            linkRef.current?.setAttribute('download', filename);
            linkRef.current?.click();

            URL.revokeObjectURL(url);
        } catch (e) {
            notification.error({ message: 'Ошибка при загрузке файла' });
        }
    };

    const columns = [
        {
            title: t('personal.services.classification.modal.status'),
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: t('personal.services.classification.modal.orderData'),
            dataIndex: 'orderData',
            key: 'orderData',
        },
    ];

    const formedData = blackBeretHistory.filter((beret: any) => beret?.badge!==null).map((item: Record<string, any>, index: number) => {
        if (item?.badge?.status === 'Присвоен') {
            return {
                key: index,
                orderData: (
                    <>
                        Акт {item?.document_number} от {moment(item?.date_from).format('DD.MM.YYYY')}
                        {'  '}
                        {
                            item?.document_link!==null
                            &&
                            <Link to={item?.document_link} download>
                                <FileTextTwoTone style={{ marginLeft: '10px' }} download="file" />
                            </Link>
                        }
                    </>
                ),
                status: <Badge status="success" text={item?.badge?.status} />,
                // status: item.badge.status ?? '',
            };
        } else if (item?.badge?.status === 'Лишен') {
            return {
                key: index,
                orderData: `Акт ${item?.document_number} от ${moment(item?.date_from).format(
                    'DD.MM.YYYY',
                )}`,
                status: <Badge status="error" text={item?.badge?.status} />,
                // status: item.badge.status ?? '',
            };
        }
    });

    return (
        <Modal
            title={t('personal.services.blackBeret.modal.title')}
            open={isOpen}
            onCancel={onClose}
            width={500}
            footer={null}
        >
            <Table columns={columns} dataSource={formedData} pagination={false} />
            <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <Col>
                    <Button type={'primary'} onClick={onClose}>
                        Ок
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalBlackBeretHistory;

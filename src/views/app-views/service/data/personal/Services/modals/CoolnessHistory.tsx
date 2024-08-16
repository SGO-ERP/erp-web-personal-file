import { FileTextOutlined } from '@ant-design/icons';
import {Badge, Button, Col, Modal, Row, Table} from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getCoolnessHistory } from 'store/slices/myInfo/servicesSlice';
import LocalizationText from "../../../../../../../components/util-components/LocalizationText/LocalizationText";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ModalCoolnessHistory = ({ isOpen, onClose }: Props) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        if (!id) return;
        // @ts-expect-error FIXME: Property 'dispatch' does not exist on type '{}'.
        dispatch(getCoolnessHistory(id));
    }, []);

    const { t } = useTranslation();
    // @ts-expect-error FIXME: Property 'coolnessHistory' does not exist on type '{}'.
    const coolnessHistory = useSelector((state) => state.services.coolnessHistory);

    const columns = [
        {
            title: t('personal.services.classification.modal.classification'),
            dataIndex: 'classification',
            key: 'classification',
        },
        {
            title: t('personal.services.classification.modal.status'),
            dataIndex: 'status',
            key: 'status',
        },
        // {
        //     title: t('personal.services.classification.modal.orderData'),
        //     dataIndex: 'orderData',
        //     key: 'orderData',
        // },
    ];


    const file = (url: string) => {
        return (
            <Link to={url} download>
                <FileTextOutlined size={1.4} />
            </Link>
        );
    };

    const formedData = coolnessHistory.filter((his: any) => his?.coolness!==null).map((item: any, index: number) => {
        return {
            key: index,
            // orderData: (
            //     <>
            //         Акт {item?.document_number} от {moment(item?.date_from).format('DD.MM.YYYY')}{' '}
            //         &nbsp;
            //         {item?.document_link!== null
            //         &&
            //         file(item?.document_link)
            //         }
            //     </>
            // ),
            status: <Badge status={
                item?.coolness?.coolness_status.name === 'Подтвержден'
                ? 'success' : 'error'
            } text={<LocalizationText text={item?.coolness?.coolness_status} />} /> ?? '',
            classification: item?.coolness?.type?.name,
        };
    });

    return (
        <Modal
            title={t('personal.services.classification.modal.title')}
            open={isOpen}
            onCancel={onClose}
            width={800}
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

export default ModalCoolnessHistory;

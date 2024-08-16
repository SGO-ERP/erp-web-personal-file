import { Button, Col, Form, Modal, notification, Row, Spin, Tag } from 'antd';
import { PrivateServices } from 'API';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { components } from '../../../../../../API/types';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    staff_unit: components['schemas']['ArchiveStaffUnitRead'];
}

const ModalQualReqWatch = ({ isOpen, onClose, staff_unit }: Props) => {
    const [staffUnit, setStaffUnit] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [form] = Form.useForm();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language;

    const ClearForm = () => {
        onClose();
        form.resetFields();
    };

    useEffect(() => {
        const getStaffUnit = async () => {
            if (!staff_unit || !staff_unit?.id) {
                return
            }
            try {
                setIsLoading(true)

                const id = staff_unit.id
                const url =`/api/v1/staff_unit/${id}`
                const response = await PrivateServices.get(url)
                const staffUnit = response.data
                setStaffUnit(staffUnit)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        getStaffUnit()
    }, [staff_unit])

    if (staffUnit?.requirements == null && isOpen) {
        notification.error({
            message: <IntlMessage id={'qual.req.null'} />,
        });
        onClose();
        return;
    }

    if (isLoading) {
        return <Spin />
    }
    return (
        <Modal
            title={
                <Row>
                    <Col xs={20}>
                        <IntlMessage id={'staffSchedule.addQualificationRequirements'} />
                    </Col>
                </Row>
            }
            open={isOpen}
            onOk={onClose}
            onCancel={ClearForm}
            width={'50%'}
            footer={[
                <Button key="submit" type="primary" onClick={onClose}>
                    OK
                </Button>,
            ]}
        >
            {staffUnit?.requirements !== undefined && staffUnit?.requirements?.length > 0 ? (
                <Form form={form} layout="vertical">
                    <Form.Item label={<IntlMessage id={'modal.quali.req.education'} />}>
                        {staffUnit?.requirements[0]?.keys !== undefined &&
                            staffUnit?.requirements[0]?.keys.map((item: any) => {
                                if (currentLocale === 'ru' && item.lang === 'ru') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                } else if (currentLocale === 'kk' && item.lang === 'kz') {
                                    return item?.text?.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                }
                            })}
                    </Form.Item>
                    <Form.Item label={<IntlMessage id={'modal.quali.req.experience'} />}>
                        {staffUnit?.requirements[1]?.keys !== undefined &&
                            staffUnit?.requirements[1]?.keys.map((item: any) => {
                                if (currentLocale === 'ru' && item.lang === 'ru') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                } else if (currentLocale === 'kk' && item.lang === 'kz') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                }
                            })}
                    </Form.Item>
                    <Form.Item label={<IntlMessage id={'modal.quali.req.practicalExp'} />}>
                        {staffUnit?.requirements[2]?.keys !== undefined &&
                            staffUnit?.requirements[2]?.keys.map((item: any) => {
                                if (currentLocale === 'ru' && item.lang === 'ru') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                } else if (currentLocale === 'kk' && item.lang === 'kz') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                }
                            })}
                    </Form.Item>
                    <Form.Item label={<IntlMessage id={'modal.quali.req.health'} />}>
                        {staffUnit?.requirements[3]?.keys !== undefined &&
                            staffUnit?.requirements[3]?.keys.map((item: any) => {
                                if (currentLocale === 'ru' && item.lang === 'ru') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                } else if (currentLocale === 'kk' && item.lang === 'kz') {
                                    return item.text.map((text: string, index: number) => (
                                        <React.Fragment key={index}>
                                            <Tag style={{ borderRadius: '15px', marginTop: '5px' }}>
                                                {text}
                                            </Tag>
                                        </React.Fragment>
                                    ));
                                }
                            })}
                    </Form.Item>
                </Form>
            ) : null}
        </Modal>
    );
};

export default ModalQualReqWatch;

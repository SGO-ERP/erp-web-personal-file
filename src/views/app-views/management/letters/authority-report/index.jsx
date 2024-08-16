import React, { useEffect } from 'react';
import { Breadcrumb, Button, Card, Col, Divider, notification, Row, Space, Typography } from 'antd';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { Link, useParams } from 'react-router-dom';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';
import './styles.css';
import QrCard from './QrCard';
import { PrivateServices } from '../../../../../API';
import Spinner from '../../../service/data/personal/common/Spinner';
import moment from 'moment';

const AuthorityReportPage = () => {
    const [steps, setSteps] = React.useState([]);
    const [document, setDocument] = React.useState();
    const { id } = useParams();

    const getAuthorityReport = async () => {
        const response = await PrivateServices.get('/api/v1/hr-documents/qrs/{id}/', {
            params: {
                path: {
                    id,
                },
            },
        });
        if (response?.data) {
            setSteps(response.data);
            return;
        }
        notification.error({
            message: 'Ошибка при загрузке отчета',
        });
    };

    const getDocument = async () => {
        const response = await PrivateServices.get('/api/v1/hr-documents/{id}/', {
            params: {
                path: {
                    id,
                },
            },
        });
        if (response?.data) {
            setDocument(response.data);
            return;
        }
        notification.error({
            message: 'Ошибка при загрузке отчета',
        });
    };

    useEffect(() => {
        void getDocument();
        void getAuthorityReport();
    }, []);

    return (
        <div className="document-report-page">
            <Row>
                <Col xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                    <h4 style={{ margin: '0' }}>
                        <b>
                            <IntlMessage id={'seeOrder.see.order'} />
                        </b>
                    </h4>
                </Col>
                <Col xs={16} style={{ display: 'flex', alignItems: 'center' }}>
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/management/letters">
                                <IntlMessage id={'sidenav.management.lettersAndOrders'} />
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/management/letters">
                                <IntlMessage id={'seeOrder.look.order'} />
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Отчет о подлинности документа</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col xs={4}>
                    <Space align="center">
                        <Button>
                            <VerticalAlignBottomOutlined />
                            <IntlMessage id={'personal.button.download'} />
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Space direction="vertical" className="cards-container">
                {document && (
                    <Row style={{ marginTop: 30 }}>
                        <Card title="Отчет о подлинности электронного документа">
                            <Divider className="divider" />
                            <Row gutter={[18, 16]}>
                                <Col xs={10}>
                                    <Typography.Text strong>Регистратор</Typography.Text>
                                </Col>
                                <Col xs={14}>Кадровый учет ИС “Талдау”</Col>
                                <Col xs={10}>
                                    <Typography.Text strong>Тип документа</Typography.Text>
                                </Col>
                                <Col xs={14}>{document?.document_template?.name || ''}</Col>
                                <Col xs={10}>
                                    <Typography.Text strong>Регистрационный номер</Typography.Text>
                                </Col>
                                <Col xs={14}>{document?.reg_number || ''}</Col>
                                <Col xs={10}>
                                    <Typography.Text strong>Дата регистрации</Typography.Text>
                                </Col>
                                <Col xs={14}>
                                    {moment(document?.created_at).format('DD.MM.YYYY')}
                                </Col>
                            </Row>
                        </Card>
                    </Row>
                )}
                <Row>
                    {steps.length === 0 && (
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <Spinner />
                        </div>
                    )}
                    {steps.length > 0 &&
                        steps.map((step) => <QrCard step={step} key={step.signed_at} />)}
                </Row>
            </Space>
        </div>
    );
};

export default AuthorityReportPage;

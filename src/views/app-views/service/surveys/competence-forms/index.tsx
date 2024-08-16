import moment from 'moment';
import React from 'react';

import { Button, Card, Col, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PrivateServices } from 'API';
import { components } from 'API/types';

import { TableWithPagination } from '../components/TableWithPagination';
import AvatarStatus from '../../../../../components/shared-components/AvatarStatus';
import DataText from '../../../../../components/shared-components/DataText';

const { Fragment, useEffect, useState } = React;
const { Title, Text } = Typography;

const Index = () => {
    const [dataSource, setDataSource] = useState<Array<components['schemas']['SurveyRead']>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [total, setTotal] = useState<number>();
    const { t } = useTranslation();

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
            title: 'Название',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Typography.Text>{record.name}</Typography.Text>
            ),
        },
        {
            dataIndex: 'is_anonymous',
            key: 'is_anonymous',
            title: 'Тип',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Typography.Text>{record.is_anonymous ? 'Анонимный' : 'Открытый'}</Typography.Text>
            ),
        },
        {
            dataIndex: 'comp_form_for',
            key: 'comp_form_for',
            title: 'Оцениваемый сотрудник',
            render: (_: string, record: any) =>
                record.comp_form_for && (
                    <div className={'d-flex'}>
                        <AvatarStatus size={40} src={record.comp_form_for.icon || ''} />
                        <div className="mt-2">
                            <DataText
                                style={{ color: '#1A3353' }}
                                name={`${record.comp_form_for.first_name} ${
                                    record.comp_form_for.last_name
                                } ${record.comp_form_for.father_name || ''}`}
                            />
                        </div>
                    </div>
                ),
        },
        {
            dataIndex: 'end_date',
            key: 'end_date',
            title: 'Крайний срок',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Typography.Text>{moment(record.end_date).format('DD MMM YYYY')}</Typography.Text>
            ),
        },
        {
            dataIndex: 'actions',
            key: 'actions',
            title: 'Действия',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Button
                    type="text"
                    style={{
                        color: '#3e79f7',
                    }}
                >
                    <Link to={`/duty/my-surveys-and-tests/${record.id}` || ''} state={record}>
                        {record.comp_form_for ? 'Оценить сотрудника' : 'Пройти тестирование'}
                    </Link>
                </Button>
            ),
        },
    ];

    useEffect(() => {
        setIsLoading(true);

        PrivateServices.get('/api/v1/surveys/my/competence-forms', {
            params: {
                query: {},
            },
        })
            .then((res) => {
                setDataSource(res.data?.objects);
                setTotal(res.data?.total);
            })
            .catch((err) => {
                setDataSource([]);
                setTotal(0);

                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        moment.locale('kz');
    }, []);

    return (
        <Fragment>
            <Card>
                <Row
                    justify={'space-between'}
                    align={'middle'}
                    style={{
                        marginBottom: '12px',
                    }}
                >
                    <Col>
                        <Title level={3}>Бланки компетенций</Title>
                    </Col>
                    <Col>
                        <Input.Search
                            placeholder={t('surveys.toolbar.search.placeholder')}
                            value={search}
                            onChange={(evt) => {
                                setSearch(evt.target.value);
                            }}
                            style={{
                                width: '300px',
                                marginRight: '20px',
                                marginTop: '10px',
                                marginBottom: '10px',
                            }}
                        />
                    </Col>
                </Row>
                <TableWithPagination
                    columns={columns}
                    dataSource={dataSource || []}
                    isLoading={isLoading || false}
                    total={total || 0}
                />
            </Card>
        </Fragment>
    );
};

export default Index;

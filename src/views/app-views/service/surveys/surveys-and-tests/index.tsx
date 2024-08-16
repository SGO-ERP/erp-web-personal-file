import moment from 'moment';
import React from 'react';

import { Button, Card, Col, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { PrivateServices } from 'API';
import { components } from 'API/types';

import { TableWithPagination } from '../components/TableWithPagination';

const { Fragment } = React;
const { useEffect, useState } = React;

export default function SurveysAndTests() {
    const [dataSource, setDataSource] = useState<Array<components['schemas']['SurveyRead']>>();
    const [isLoading, setIsLoading] = useState<boolean>();
    const [search, setSearch] = useState<string>();
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
            dataIndex: ['is_anonymous', 'type'],
            key: 'is_anonymous',
            title: 'Тип',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Typography.Text>
                    {record.type === 'Опрос'
                        ? `${record.is_anonymous ? 'Анонимный опрос' : 'Открытый опрос'}`
                        : 'Тест'}
                </Typography.Text>
            ),
        },
        {
            dataIndex: 'end_date',
            key: 'end_date',
            title: 'Крайний срок',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Typography.Text>{moment(record.end_date).format('DD MMMM YYYY')}</Typography.Text>
            ),
        },
        {
            dataIndex: [],
            key: 'actions',
            title: 'Действия',
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Button
                    type="text"
                    style={{
                        color: '#3e79f7',
                    }}
                >
                    <Link to={record?.id || ''} state={record}>
                        Начать опрос
                    </Link>
                </Button>
            ),
        },
    ];

    useEffect(() => {
        setIsLoading(true);

        PrivateServices.get('/api/v1/surveys/my', {
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
                        <Typography.Title level={3}>Опросы и тесты</Typography.Title>
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
}

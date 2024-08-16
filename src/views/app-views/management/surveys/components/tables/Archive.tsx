import React from 'react';
import moment from 'moment';

import { Button, Divider, Space, Typography, notification } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import IntlMessage from 'components/util-components/IntlMessage';

import { PrivateServices } from 'API';
import { components } from 'API/types';

import { TableWithPagination } from './TableWithPagination';
import { deleteSurvey, duplicateSurvey, unarchiveSurvey } from '../../businessLogic/surveysLogic';

const { Fragment } = React;
const { useEffect, useState } = React;
const { Text } = Typography;

const Archive = () => {
    const [dataSource, setDataSource] = useState<Array<components['schemas']['SurveyRead']>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const filterDataSource = (id: string) => {
        setIsLoading(true);

        setDataSource(dataSource?.filter((item) => item.id !== id));
        setTotal(total - 1);

        setIsLoading(false);
    };

    const updateDataSource = (record: components['schemas']['SurveyRead']) => {
        setIsLoading(true);

        if (Array.isArray(dataSource)) {
            setDataSource([...dataSource, record]);
        }

        setTotal(total + 1);

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);

        PrivateServices.get('/api/v1/surveys/archives', {
            params: {
                query: {},
            },
        })
            .then((res) => {
                setDataSource(res.data?.objects);
                setTotal(res.data?.total || 0);
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

    const columns = [
        {
            dataIndex: 'name',
            key: 'name',
            title: t('surveys.table.header.column.name'),
        },
        {
            dataIndex: 'type',
            filters: [
                {
                    text: 'Опрос',
                    value: 'Опрос',
                },
                {
                    text: 'Тест',
                    value: 'Тест',
                },
            ],
            key: 'type',
            title: t('surveys.table.header.column.type'),
        },
        {
            dataIndex: 'jurisdiction_type',
            key: 'jurisdiction_type',
            title: t('surveys.table.header.column.jurisdiction'),
        },
        {
            dataIndex: 'end_date',
            key: 'end_date',
            title: t('surveys.table.header.column.calendar'),
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Text>{moment(record?.end_date).format('DD MMMM YYYY')}</Text>
            ),
        },
        {
            dataIndex: 'more',
            key: 'more',
            title: t('surveys.table.header.column.actions'),
            render: (_: string, record: components['schemas']['SurveyRead']) => (
                <Space align="center">
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                        onClick={() => {
                            navigate(`/management/surveys/edit/${record.id}`);
                        }}
                    >
                        <IntlMessage id="surveys.archive.table.body.row.actions.edit" />
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                        onClick={() => {
                            unarchiveSurvey(record)
                                .then((data) => {
                                    filterDataSource(record.id || '');
                                })
                                .then(() => {
                                    notification.success({
                                        message: 'Архивирование',
                                        description: 'Опрос успешно убран с архива',
                                    });
                                })
                                .catch(() => {
                                    notification.error({
                                        message: 'Ошибка',
                                        description: 'Не удалось убрать опрос с архива',
                                    });
                                });
                        }}
                    >
                        <IntlMessage id="surveys.surveys.table.body.row.actions.unarchive" />
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        style={{
                            color: '#3e79f7',
                        }}
                        onClick={() => {
                            duplicateSurvey(record.id || '')
                                .then((data) => {
                                    if (data) updateDataSource(data);
                                })
                                .then(() => {
                                    notification.success({
                                        message: 'Дублирование',
                                        description: 'Опрос успешно дублирован',
                                    });
                                })
                                .catch(() => {
                                    notification.error({
                                        message: 'Ошибка',
                                        description: 'Не удалось дублировать опрос',
                                    });
                                });
                        }}
                    >
                        <IntlMessage id="surveys.archive.table.body.row.actions.duplicate" />
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="text"
                        danger
                        onClick={() => {
                            deleteSurvey(record)
                                .then(() => filterDataSource(record.id || ''))
                                .then(() => {
                                    notification.success({
                                        message: 'Удаление',
                                        description: 'Опрос успешно удален',
                                    });
                                })
                                .catch(() => {
                                    notification.error({
                                        message: 'Удаление',
                                        description: 'Ошибка при удалении опроса',
                                    });
                                });
                        }}
                    >
                        <IntlMessage id="surveys.surveys.table.body.row.actions.delete" />
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Fragment>
            <TableWithPagination
                columns={columns}
                dataSource={dataSource || []}
                isLoading={isLoading}
                total={total || 0}
            />
        </Fragment>
    );
};

export default Archive;

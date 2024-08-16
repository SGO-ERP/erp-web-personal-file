import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Col, Modal, Row, Table, Tag } from 'antd';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { components } from '../../../../../../../API/types';
import { LocalText } from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { PrivateServices } from '../../../../../../../API';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    data: components['schemas']['BspPlanRead']['schedule_years'];
    year: number;
}

const columns = [
    {
        title: <IntlMessage id={'csp.create.year.plan.setting.table.column.first'} />,
        dataIndex: 'staff_divisions',
        key: 'staff_divisions',
        render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
            <div>{record?.staff_divisions && LocalText.getName(record?.staff_divisions[0])}</div>
        ),
        sorter: (
            a: components['schemas']['ScheduleYearRead'],
            b: components['schemas']['ScheduleYearRead'],
        ) => {
            const currentLocale = localStorage.getItem('lan');

            const nameARu = `${a?.staff_divisions?.[0].name}`;
            const nameBRu = `${b?.staff_divisions?.[0].name}`;

            const nameAKz = `${a?.staff_divisions?.[0].nameKZ}`;
            const nameBKz = `${b?.staff_divisions?.[0].nameKZ}`;

            if (currentLocale === 'kk') {
                return nameAKz.localeCompare(nameBKz);
            } else {
                return nameARu.localeCompare(nameBRu);
            }
        },
    },
    {
        title: <IntlMessage id={'csp.create.year.plan.modal.view.spec.preparation'} />,
        dataIndex: 'activity',
        key: 'activity',
        render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
            <>{LocalText.getName(record?.activity)}</>
        ),
        sorter: (
            a: components['schemas']['ScheduleYearRead'],
            b: components['schemas']['ScheduleYearRead'],
        ) => {
            const currentLocale = localStorage.getItem('lan');

            const nameARu = `${a?.activity?.name}`;
            const nameBRu = `${b?.activity?.name}`;

            const nameAKz = `${a?.activity?.nameKZ}`;
            const nameBKz = `${b?.activity?.nameKZ}`;

            if (currentLocale === 'kk') {
                return nameAKz.localeCompare(nameBKz);
            } else {
                return nameARu.localeCompare(nameBRu);
            }
        },
    },
    {
        title: <IntlMessage id={'csp.create.year.plan.setting.table.column.second'} />,
        dataIndex: 'lessons',
        key: 'lessons',
        render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
            <>
                {record?.activity_months?.map((item) => {
                    return (
                        <>
                            <Tag
                                style={{
                                    marginRight: '5px',
                                    marginTop: '5px',
                                    color:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#366EF6'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#A0D911'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#52C41A'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FAAD14'
                                            : 'white',
                                    borderColor:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#91D5FF'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#EAFF8F'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#B7EB8F'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FFD591'
                                            : 'white',
                                    backgroundColor:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#3E79F71A'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#FCFFE6'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#F6FFED'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FFF7E6'
                                            : 'white',
                                    borderRadius: '10px',
                                }}
                            >
                                {LocalText.getName(item)}
                            </Tag>
                        </>
                    );
                })}
            </>
        ),
        width: '30%',
    },
    {
        title: <IntlMessage id={'csp.create.year.plan.modal.credits'} />,
        dataIndex: 'classes',
        key: 'classes',
        render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
            <>
                {record?.exam_months?.map((item) => {
                    return (
                        <>
                            <Tag
                                style={{
                                    marginRight: '5px',
                                    marginTop: '5px',
                                    color:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#366EF6'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#A0D911'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#52C41A'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FAAD14'
                                            : 'white',
                                    borderColor:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#91D5FF'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#EAFF8F'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#B7EB8F'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FFD591'
                                            : 'white',
                                    backgroundColor:
                                        item.name === 'Январь' ||
                                        item.name === 'Февраль' ||
                                        item.name === 'Декабрь'
                                            ? '#3E79F71A'
                                            : item.name === 'Март' ||
                                              item.name === 'Май' ||
                                              item.name === 'Апрель'
                                            ? '#FCFFE6'
                                            : item.name === 'Июнь' ||
                                              item.name === 'Июль' ||
                                              item.name === 'Август'
                                            ? '#F6FFED'
                                            : item.name === 'Сентябрь' ||
                                              item.name === 'Октябрь' ||
                                              item.name === 'Ноябрь'
                                            ? '#FFF7E6'
                                            : 'white',
                                    borderRadius: '10px',
                                }}
                            >
                                {LocalText.getName(item)}
                            </Tag>
                        </>
                    );
                })}
            </>
        ),
        width: '30%',
    },
    {
        title: <IntlMessage id={'csp.create.year.plan.modal.number.attempts'} />,
        dataIndex: 'retry_count',
        key: 'retry_count',
        sorter: (
            a: components['schemas']['ScheduleYearRead'],
            b: components['schemas']['ScheduleYearRead'],
        ) => {
            if (a?.retry_count !== undefined && b?.retry_count !== undefined) {
                return a.retry_count - b.retry_count;
            }
            return 0;
        },
    },
];

const ModalShowYearPlan = ({ isOpen, onClose, data, year }: Props) => {
    const navigate = useNavigate();
    const [dataSource, setDataSource] = useState<components['schemas']['ScheduleYearRead'][]>([]);
    useEffect(() => {
        if (data) {
            const transformedData: components['schemas']['ScheduleYearRead'][] = [];

            data?.forEach((item) => {
                item.staff_divisions?.forEach((staffDivision) => {
                    transformedData.push({
                        ...item,
                        staff_divisions: [staffDivision],
                    });
                });
            });
            const compareByName = (
                a: components['schemas']['ScheduleYearRead'],
                b: components['schemas']['ScheduleYearRead'],
            ): number => {
                if (a?.staff_divisions?.[0].name && b?.staff_divisions?.[0].name) {
                    if (a.staff_divisions[0].name < b.staff_divisions[0].name) {
                        return -1;
                    }
                    if (a.staff_divisions[0].name > b.staff_divisions[0].name) {
                        return 1;
                    }
                    // Если имена равны, учитываем порядок следования элементов
                    return 0;
                }
                return 0;
            };

            const sortedArray: components['schemas']['ScheduleYearRead'][] =
                transformedData.sort(compareByName);
            // Create a Set to keep track of unique id and name combinations
            const uniqueSet = new Set<string>();

            // Filter the data array to include only unique id and name combinations
            const filteredData = sortedArray.filter((item) => {
                const key = `${item.id}-${item?.staff_divisions?.[0]?.name}`;
                if (!uniqueSet.has(key)) {
                    uniqueSet.add(key);
                    return true;
                }
                return false;
            });
            setDataSource(filteredData);
        } else {
            setDataSource([]);
        }
    }, [data]);

    const onDublicate = () => {
        if (data?.[0].plan_id) {
            PrivateServices.get('/api/v1/plan/duplicate/{id}/', {
                params: {
                    path: {
                        id: data?.[0].plan_id,
                    },
                },
            }).then((res) => {
                if (res?.data) {
                    navigate(
                        `${APP_PREFIX_PATH}/management/combat-starting-position/year-plan/create/?bsp-plan-id=${res?.data?.id}&year=${res?.data?.year}`,
                    );
                }
            });
        }
        onClose();
    };

    return (
        <Modal
            title={
                <>
                    <IntlMessage id={'csp.create.year.plan.setting.modal.title'} /> ({year})
                </>
            }
            open={isOpen}
            width={'1184px'}
            onCancel={onClose}
            footer={null} // Устанавливаем footer в null, чтобы не отображалась кнопка "Ok"
            cancelText={<IntlMessage id="activeTable.duplicate" />}
        >
            <Table dataSource={dataSource} columns={columns} />
            <Row
                gutter={16}
                style={{ marginTop: '15px', display: 'flex', justifyContent: 'flex-end' }}
            >
                <Col>
                    <Button onClick={() => onDublicate()} disabled={data?.length === 0}>
                        <IntlMessage id="activeTable.duplicate" />
                    </Button>
                </Col>
                <Col>
                    <Button onClick={() => onClose()} type={'primary'}>
                        Ок
                    </Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default ModalShowYearPlan;

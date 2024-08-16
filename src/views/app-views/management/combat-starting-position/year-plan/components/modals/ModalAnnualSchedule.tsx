import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, Form, Modal, notification, Select, Table, Tag } from 'antd';
import { components } from '../../../../../../../API/types';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { PrivateServices } from '../../../../../../../API';
import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import {
    clearLocalScheduleYear,
    clearRemoteScheduleYear,
    removeLocalScheduleYear,
    removeRemoteScheduleYear,
} from '../../../../../../../store/slices/bsp/create/scheduleYear';
import { LocalText } from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { getSignedBsp } from '../../../../../../../store/slices/bsp/year-plan/tableSlice';
import { SCHEDULE_YEAR } from '../../../../../../../constants/AuthConstant';

const { Option } = Select;

interface Props {
    onClose: () => void;
    isOpen: boolean;
    data: components['schemas']['BspPlanRead']['schedule_years'];
}

const ModalAnnualSchedule = ({ isOpen, onClose, data }: Props) => {
    const [searchParams] = useSearchParams();
    const bsp_plan_id = searchParams.get('bsp-plan-id');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [dataSource, setDataSource] = useState<components['schemas']['ScheduleYearRead'][]>([]);
    const [plan, setPlan] = useState<components['schemas']['ScheduleYearRead'][]>([]);
    const [loading,setLoading] = useState<boolean>(false);
    const [current, setCurrent] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);

    const localScheduelYear = useAppSelector((state) => state.scheduleYear.local);
    const remoteScheduelYear = useAppSelector((state) => state.scheduleYear.remote);
    const removeScheduelYear = useAppSelector((state) => state.scheduleYear.remove);

    const columns = [
        {
            title: <IntlMessage id={'csp.create.year.plan.setting.table.column.first'} />,
            dataIndex: 'staff_divisions',
            key: 'staff_divisions',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <div>
                    {record?.staff_divisions && LocalText.getName(record?.staff_divisions[0])}
                </div>
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
                    {record?.is_exam_required === true
                        ? record?.exam_months?.map((item) => {
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
                          })
                        : '-'}
                </>
            ),
            width: '30%',
        },
        {
            title: <IntlMessage id={'csp.create.year.plan.modal.number.attempts'} />,
            dataIndex: 'retry_count',
            key: 'retry_count',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <>{record?.exam_months ? record?.retry_count : '-'}</>
            ),
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
        {
            title: <IntlMessage id={'letters.historytable.actions'} />,
            dataIndex: 'actions',
            key: 'actions',
            render: (_: string, record: components['schemas']['ScheduleYearRead']) => (
                <Button
                    type={'text'}
                    onClick={() => deleteYearPlan(record)}
                    style={{ color: '#366EF6' }}
                >
                    <IntlMessage id={'initiate.deleteAll'} />
                </Button>
            ),
        },
    ];

    const deleteYearPlan = (record: components['schemas']['ScheduleYearRead']) => {
        if (record?.id !== undefined && record?.staff_divisions?.[0]?.id) {
            dispatch(
                removeRemoteScheduleYear({
                    id: record?.id,
                    division_id: record?.staff_divisions?.[0]?.id,
                }),
            );
            dispatch(
                removeLocalScheduleYear({
                    id: record?.id,
                }),
            );
        }
    };

    const onOk = () => {
        if (bsp_plan_id !== null) {
            removeScheduelYear.map((item) => {
                PrivateServices.del('/api/v1/schedule_year/division/{schedule_id}/{division_id}/', {
                    params: {
                        path: {
                            schedule_id: item?.id,
                            division_id: item?.division_id,
                        },
                    },
                });
            });

            dispatch(clearLocalScheduleYear());
            dispatch(clearRemoteScheduleYear());

            PrivateServices.post('/api/v1/plan/sign/{id}/', {
                params: {
                    path: {
                        id: bsp_plan_id,
                    },
                },
            }).then(() => {
                dispatch(
                    getSignedBsp({
                        query: {
                            skip: (current - 1) * pageSize,
                            limit: pageSize,
                        },
                    }),
                );
                localStorage.removeItem(SCHEDULE_YEAR);
                navigate(`${APP_PREFIX_PATH}/management/combat-starting-position/year-plan`);
                notification.success({
                    message: <IntlMessage id={'bsp.success.create'} />,
                });
            });
        }
        onClose();
    };

    useEffect(() => {
        if (bsp_plan_id) {
            PrivateServices.get('/api/v1/plan/{id}/', {
                params: { path: { id: bsp_plan_id } },
            }).then((responce) => {
                if (responce.data) {
                    setLoading(true);
                    if (responce.data.schedule_years) {
                        setPlan(responce?.data?.schedule_years);
                    }
                }
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (plan) {
            const transformedData: components['schemas']['ScheduleYearRead'][] = [];

            plan?.forEach((item) => {
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
            setLoading(false);
        } else {
            setLoading(false);
            setDataSource([]);
        }
    }, [plan]);

    return (
        <Modal
            title={<IntlMessage id={'csp.create.year.plan.setting.modal.title'} />}
            open={isOpen}
            onOk={onOk}
            onCancel={onClose}
            width={'1144px'}
            okText={<IntlMessage id="accept" />}
            cancelText={<IntlMessage id="csp.create.year.plan.setting.modal.back" />}
            okButtonProps={{
                disabled:
                    dataSource.filter(
                        (item) =>
                            item?.staff_divisions &&
                            !item.staff_divisions.some((el) =>
                                removeScheduelYear.some(
                                    (removeEl) =>
                                        removeEl.division_id === el.id && removeEl.id === item.id,
                                ),
                            ),
                    ).length === 0,
            }}
        >
            <Table
                dataSource={
                    removeScheduelYear
                        ? dataSource.filter(
                              (item) =>
                                  item?.staff_divisions &&
                                  !item.staff_divisions.some((el) =>
                                      removeScheduelYear.some(
                                          (removeEl) =>
                                              removeEl.division_id === el.id &&
                                              removeEl.id === item.id,
                                      ),
                                  ),
                          )
                        : dataSource
                }
                columns={columns}
                loading={loading}
                bordered
            />
        </Modal>
    );
};

export default ModalAnnualSchedule;

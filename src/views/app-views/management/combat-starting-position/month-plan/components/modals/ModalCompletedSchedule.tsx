import React, { useEffect, useState } from 'react';

import { Button, Modal, Table } from 'antd';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { components } from '../../../../../../../API/types';
import LocalizationText, {
    LocalText,
} from '../../../../../../../components/util-components/LocalizationText/LocalizationText';

interface Props {
    onClose: () => void;
    isOpen: boolean;
    staffDivInfo: components['schemas']['ScheduleYearRead'] | undefined;
    eachStaffDivInfo: components['schemas']['StaffDivisionRead'] | undefined;
    month: string | null;
}

const ModalCompletedSchedule = ({
    isOpen,
    onClose,
    staffDivInfo,
    eachStaffDivInfo,
    month,
}: Props) => {
    const [filteredArray, setFilteredArray] = useState<
        components['schemas']['ScheduleMonthRead'][]
    >([]);

    const columns = [
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.first'} />,
            dataIndex: 'activity',
            key: 'activity',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
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
            title: <IntlMessage id={'csp.create.month.plan.modal.column.monday'} />,
            dataIndex: 'monday',
            key: 'monday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'понедельник')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.tuesday'} />,
            dataIndex: 'tuesday',
            key: 'tuesday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'вторник')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.wednesday'} />,
            dataIndex: 'wednesday',
            key: 'wednesday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'среда')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.thursday'} />,
            dataIndex: 'thursday',
            key: 'thursday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'четверг')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.friday'} />,
            dataIndex: 'friday',
            key: 'friday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'пятница')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
        {
            title: <IntlMessage id={'csp.create.month.plan.modal.column.saturday'} />,
            dataIndex: 'saturday',
            key: 'saturday',
            render: (_: string, record: components['schemas']['ScheduleMonthRead']) => (
                <>
                    {record?.days &&
                        (() => {
                            const mondayTimeRanges = record.days
                                .filter((item) => item?.day?.name?.toLowerCase() === 'суббота')
                                .map(
                                    (item) =>
                                        item?.start_time?.slice(0, 5) +
                                        '-' +
                                        item?.end_time?.slice(0, 5),
                                );

                            return mondayTimeRanges.length > 0 ? (
                                mondayTimeRanges
                            ) : (
                                <>
                                    <IntlMessage id={'csp.month.plan.modal.free'} />
                                </>
                            );
                        })()}
                </>
            ),
        },
    ];

    useEffect(() => {
        if (staffDivInfo) {
            const filteredMonths = staffDivInfo.months?.map((monthInfo) => {
                const filteredDays =
                    monthInfo &&
                    monthInfo?.days?.filter((day) => {
                        return day?.activity_month?.name === month;
                    });

                return {
                    ...monthInfo,
                    days: filteredDays,
                };
            });
            if (filteredMonths) {
                setFilteredArray(filteredMonths);
            }
        }
    }, [staffDivInfo, isOpen]);

    return (
        <Modal
            title={
                <div>
                    <LocalizationText text={eachStaffDivInfo} />
                    {'.'}
                    &nbsp;
                    <IntlMessage id={'csp.create.month.plan.modal.title'} />
                    {'.'}
                </div>
            }
            open={isOpen}
            onOk={onClose}
            onCancel={onClose}
            width={'846px'}
            footer={
                <div>
                    <Button type="primary" style={{ width: '87px' }} onClick={onClose}>
                        Ok
                    </Button>
                </div>
            }
        >
            <Table
                bordered
                dataSource={filteredArray.filter((m) => m?.days && m?.days?.length > 0)}
                columns={columns}
            />
        </Modal>
    );
};

export default ModalCompletedSchedule;

import { PrivateServices } from 'API';
import { components } from 'API/types';
import { Button, message, Modal, notification, Row, Space, Progress, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import { format } from 'date-fns';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { concatBySpace } from 'utils/format/format';
import TableWithPagination from '../../../../../components/shared-components/TableWithPagination';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { APP_PREFIX_PATH } from '../../../../../configs/AppConfig';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useStore';
import {
    changeCurrentPage,
    getStaffListDrafts,
} from '../../../../../store/slices/schedule/staffListSlice';
import utils from '../../../../../utils';
import { useTranslation } from 'react-i18next';
import { delay } from 'utils/helpers/common';

interface TablePaginationParams {
    page: number;
    limit: number;
}

const ListDraftsTable = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { list, currentPage, pageSize, hasNextPage, isLoading, searchValue } = useAppSelector(
        (state) => state.staffList,
    );

    const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        saveCurrentPageSettings(1, 5);
        dispatch(getStaffListDrafts({ skip: 1, limit: 5 }));
    }, [searchValue]);

    const fetchData = async ({ page, limit }: TablePaginationParams) => {
        return dispatch(getStaffListDrafts({ skip: page, limit }));
    };

    const saveCurrentPageSettings = (page: number, pageSize: number) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    async function handleDuplicate(id: string | undefined, name: string) {
        if (id == null) {
            message.error({ content: 'Server error', duration: 2 });
            return;
        }

        setDuplicateModalVisible(true);
        try {
            const response = await PrivateServices.post('/api/v1/staff_list/duplicate/{id}/', {
                params: {
                    path: {
                        id,
                    },
                },
                body: {
                    name: name + ' (копия)',
                },
            });

            if (
                typeof response.data !== 'object' ||
                response.data == null ||
                !('task_id' in response.data) ||
                typeof response.data.task_id !== 'string'
            ) {
                throw new Error('Invalid data');
            }

            const taskId = response.data.task_id;
            checkStatus(taskId);
        } catch (error) {
            message.error({ content: '', duration: 2 });
        }
    }

    const checkStatus = (taskId: string) => {
        new Promise((resolve, reject) => {
            const intervalId = setInterval(async () => {
                try {
                    if (percent < 99) {
                        setPercent((prev) => prev + 1);
                    }

                    const url = `/api/v1/staff_list/task-status/${taskId}`;
                    const response = await PrivateServices.get(url);

                    if (
                        typeof response.data === 'object' &&
                        response.data != null &&
                        'status' in response.data
                    ) {
                        return;
                    }
                    if (typeof response.data !== 'boolean') {
                        reject(new Error('Unexpected data type'));
                        return;
                    }
                    if (!response.data) {
                        reject(response.error);
                        return;
                    }
                    clearInterval(intervalId);
                    resolve(response.data);
                } catch (error) {
                    setPercent(100);
                    await delay(1000);
                    console.log(error);
                    clearInterval(intervalId);
                    setDuplicateModalVisible(false);
                    setPercent(0);
                }
            }, 2000);
        })
            .then(async () => {
                setPercent(100);
                await delay(1000);
                setDuplicateModalVisible(false);
                setPercent(0);

                let newPage = currentPage;
                if (list.length === 5) {
                    newPage = currentPage + 1;
                }
                saveCurrentPageSettings(newPage, pageSize);
                fetchData({ page: newPage, limit: pageSize });
                notification.success({
                    message: localStorage.getItem('lan') === 'kk' ? 'Дубляждалған!' : 'Дублирован!',
                });
            })
            .catch((error) => {
                throw error;
            });
    };

    async function continueEditDraft(id: string | undefined) {
        if (id !== undefined) {
            navigate(`${APP_PREFIX_PATH}/management/schedule/edit?staffListId=${id}&mode=edit`);
        } else {
            message.error({ content: 'Server error', duration: 2 });
        }
    }

    const DocumentTableList: ColumnsType<components['schemas']['StaffListStatusRead']> = [
        {
            title: <IntlMessage id="staffSchedule.list.date" />,
            dataIndex: 'updated_at',
            render: (_, record) => (
                <div className={'d-inline'} style={{ justifyContent: 'flex-start' }}>
                    <p className={'text'}>
                        {' '}
                        {record.updated_at
                            ? format(new Date(record.updated_at), 'dd.MM.yyyy')
                            : 'N/A'}
                    </p>
                    <p style={{ color: '#366EF6', fontSize: '0.8rem' }}>
                        {moment(record.updated_at).fromNow()}
                    </p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'updated_at'),
            width: '10%',
            defaultSortOrder: 'ascend',
        },
        {
            title: <IntlMessage id="staffSchedule.list.numChanges" />,
            dataIndex: 'changes_size',
            render: (_, record) => (
                <div className="d-flex" style={{ justifyContent: 'center' }}>
                    {record.changes_size ?? '-'}
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'changes_size'),
            width: '5%',
        },
        {
            title: <IntlMessage id="staffSchedule.list.scheduleName" />,
            dataIndex: 'name',
            render: (_, record) => (
                <div className="d-flex">
                    <div className="mt-2">
                        <p style={{ color: 'black', display: 'block' }}>{record.name}</p>
                    </div>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name'),
            width: '30%',
        },
        {
            title: <IntlMessage id="staffSchedule.list.redactor" />,
            dataIndex: 'redactor',
            render: (_, record) => {
                return (
                    <div className={'d-flex'}>
                        <AvatarStatus size={40} src={record.user?.icon} />
                        <div className="mt-2">
                            <p style={{ color: 'black', display: 'block' }}>
                                {concatBySpace([
                                    record.user?.last_name,
                                    record.user?.first_name,
                                    record.user?.father_name,
                                ])}
                            </p>
                        </div>
                    </div>
                );
            },
            sorter: (
                a: components['schemas']['StaffListStatusRead'],
                b: components['schemas']['StaffListStatusRead'],
            ) => {
                const firstNameA = a.user?.first_name || '';
                const firstNameB = b.user?.first_name || '';
                return firstNameA.localeCompare(firstNameB);
            },
            width: '30%',
        },
        {
            title: <IntlMessage id="staffSchedule.list.action" />,
            dataIndex: 'more',
            render: (_, record) => (
                <div className="d-flex">
                    <Button type="link" onClick={() => handleDuplicate(record.id, record.name)}>
                        <IntlMessage id="staffSchedule.history.duplicate" />
                    </Button>
                    <Button type="link" onClick={() => continueEditDraft(record.id)}>
                        <IntlMessage id="staffSchedule.history.continueEdit" />
                    </Button>
                </div>
            ),
            width: '25%',
        },
    ];

    return (
        <>
            <Modal
                title={t('schedule.modal.duplicateDraft')}
                open={duplicateModalVisible}
                footer={null}
                keyboard={true}
            >
                <Row align="middle" justify="center">
                    <Space
                        direction="vertical"
                        align="center"
                        size="large"
                        style={{ margin: '0 auto' }}
                    >
                        <Progress type="circle" percent={percent} />
                        <Typography>{t('schedule.modal.duplicateInProcess')}</Typography>
                    </Space>
                </Row>
            </Modal>
            <TableWithPagination
                initialPageSize={pageSize}
                isLoading={isLoading}
                dataSource={list}
                initialPage={currentPage}
                columns={DocumentTableList}
                fetchData={fetchData}
                saveCurrentPage={saveCurrentPageSettings}
                hasMore={hasNextPage}
            />
        </>
    );
};

export default ListDraftsTable;

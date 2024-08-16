import { Badge, Button, message, notification } from 'antd';
import React, { useEffect } from 'react';
import AvatarStatus from '../../../../../components/shared-components/AvatarStatus';
import TableWithPagination from '../../../../../components/shared-components/TableWithPagination';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/useStore';
import {
    changeCurrentPage,
    getStaffListSigned,
} from '../../../../../store/slices/schedule/staffListSlice';
import utils from '../../../../../utils';
import { concatBySpace } from '../../../../../utils/format/format';
import { format } from 'date-fns';
import { ColumnsType } from 'antd/es/table';
import { components } from '../../../../../API/types';
import { PrivateServices } from 'API';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { objectToQueryString } from 'utils/helpers/common';

interface TablePaginationParams {
    page: number;
    limit: number;
}

const statusBadgeMap: { [key: string]: string } = {
    'Иницилизирован': 'default',
    'В процессе': 'processing',
    'Завершен': 'success',
    'Отменен': 'error',
    'На доработке': 'processing',
};

const ListSignedTable = () => {
    const dispatch = useAppDispatch();
    const { list, currentPage, pageSize, hasNextPage, isLoading, error, searchValue } =
        useAppSelector((state) => state.staffList);
    const navigate = useNavigate();

    useEffect(() => {
        saveCurrentPageSettings(1, 5);
        dispatch(getStaffListSigned({ skip: 1, limit: 5 }));
    }, [searchValue]);

    const fetchData = async ({ page, limit }: TablePaginationParams) => {
        return dispatch(getStaffListSigned({ skip: page, limit }));
    };

    const saveCurrentPageSettings = (page: number, pageSize: number) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    async function handleDuplicate(id: string | undefined, name: string) {
        if (id !== undefined) {
            await PrivateServices.post('/api/v1/staff_list/duplicate/{id}/', {
                params: {
                    path: {
                        id,
                    },
                },
                body: {
                    name: name + ' (копия)',
                },
            })
                .then((res) => {
                    // let newPage = currentPage;
                    // if (list.length === 5) {
                    //     newPage = currentPage + 1;
                    // }
                    // saveCurrentPageSettings(newPage, pageSize);
                    // fetchData({ page: newPage, limit: pageSize });
                    // notification.success({
                    //     message:
                    //         localStorage.getItem('lan') === 'kk' ? 'Дубляждалған!' : 'Дублирован!',
                    // });
                })
                .catch((error) => {
                    message.error({ content: '', duration: 2 });
                });
        } else {
            message.error({ content: 'Server error', duration: 2 });
        }
    }

    const DocumentTableList: ColumnsType<components['schemas']['StaffListStatusRead']> = [
        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.date" />,
            dataIndex: 'document_signed_at',
            render: (_, record) => (
                <div className={'d-inline'} style={{ justifyContent: 'flex-start' }}>
                    <p className={'text'}>
                        {' '}
                        {record.document_signed_at
                            ? format(new Date(record.document_signed_at), 'dd.MM.yyyy')
                            : 'N/A'}
                    </p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'document_signed_at'),
            width: '10%',
        },
        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.numChanges" />,
            dataIndex: 'changes_size',
            render: (_, record) => (
                <div className="d-flex" style={{ justifyContent: 'center' }}>
                    <p>{record.changes_size ?? '-'}</p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'changes_size'),
            width: '5%',
        },
        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.scheduleName" />,
            dataIndex: 'name',
            render: (_, record) => (
                <div className="d-flex">
                    <div className="mt-2">
                        <p style={{ color: 'black', display: 'block' }}>{record.name}</p>
                    </div>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'name'),
            width: '20%',
        },

        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.redactor" />,
            dataIndex: 'redactor',
            filters: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' },
            ],
            render: (_, record) => (
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
            ),
            sorter: (
                a: components['schemas']['StaffListStatusRead'],
                b: components['schemas']['StaffListStatusRead'],
            ) => {
                const firstNameA = a.user?.first_name || '';
                const firstNameB = b.user?.first_name || '';
                return firstNameA.localeCompare(firstNameB);
            },
            width: '17.5%',
        },
        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.status" />,
            dataIndex: 'status',
            render: (_, record) => (
                <div className="d-flex">
                    <div className="mt-2">
                        <Badge
                            status="success"
                            size="small"
                            text={<IntlMessage id={'schedule.accept.who'} />}
                        />{' '}
                        {record.document_signed_by}
                    </div>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'priority'),
            width: '30%',
        },
        {
            title: <IntlMessage fallback={'ru'} id="staffSchedule.list.action" />,
            dataIndex: 'more',
            render: (_, record) => (
                <Button
                    type="link"
                    onClick={() =>
                        navigate(
                            `${APP_PREFIX_PATH}/management/schedule/edit?staffListId=${record.id}&mode=edit`,
                        )
                    }
                >
                    <IntlMessage id={'schedule.copy.project'} />
                </Button>
            ),
            width: '17.5%',
        },
    ];
    return (
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
    );
    // <Table columns={DocumentTableList} dataSource={array} />;
};

export default ListSignedTable;

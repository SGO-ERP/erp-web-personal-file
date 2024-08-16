import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { Button, PageHeader, Progress } from 'antd';
import '../../style.css';
import { useDispatch, useSelector } from 'react-redux';
import { candidatesAll } from '../../../../../../store/slices/candidates/candidatesSlice';
import moment from 'moment';
import AvatarStatus from '../../../../../../components/shared-components/AvatarStatus';
import { changeCurrentPage } from '../../../../../../store/slices/candidates/candidatesTableControllerSlice';
import TableWithPagination from '../../../../../../components/shared-components/TableWithPagination';
import DataText from '../../../../../../components/shared-components/DataText';
import IntlMessage from 'components/util-components/IntlMessage';
import LocalizationTextForCurrentStage from '../../../../../../components/util-components/LocalizationText/LocalizationTextForCurrentStage';

export default function ActiveTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const get_all_candidates = useSelector((state) => state.candidates.allCandidateList.data);
    const search = useSelector((state) => state.candidates.allCandidateList.search);
    const isLoading = useSelector((state) => state.candidates.allCandidateList.isLoading);
    const currentPage = useSelector((state) => state.candidatesTableController.currentPage);
    const pageSize = useSelector((state) => state.candidatesTableController.pageSize);
    const hasNextPage = useSelector((state) => state.candidates.allCandidateList.hasMore);
    const [sortedInfo, setSortedInfo] = useState(null);

    const handleChange = (pagination, filters, sorter) => {
        setSortedInfo(sorter);
    };

    useEffect(() => {
        dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        dispatch(candidatesAll({ page: 1, limit: 5 }));
    }, [search]);

    const discoverStage = (record) => {
        // dispatch(candidatesStageInfo(record));
        navigate(`${APP_PREFIX_PATH}/management/candidates/list/discover/${record.id}`);
    };

    const candidatePage = (record) => {
        navigate(`${APP_PREFIX_PATH}/management/candidates/${record.staff_unit.users[0].id}`);
    };

    const fetchData = async (params) => {
        return dispatch(candidatesAll(params));
    };

    const saveCurrentPageSettings = (page, pageSize) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    if (get_all_candidates === null) {
        return <PageHeader title={''} className="discover-user-name" backIcon={false} />;
    }

    const columns = [
        {
            title: 'Куратор',
            dataIndex: 'curator',
            render: (_, record) => (
                <div className={'d-flex'}>
                    <AvatarStatus size={40} src={record.staff_unit_curator.users[0].icon} />
                    <div className="mt-2">
                        <DataText
                            style={{ color: '#1A3353' }}
                            name={`${record.staff_unit_curator.users[0].first_name} ${
                                record.staff_unit_curator.users[0].last_name
                            } ${record.staff_unit_curator.users[0].father_name || ''}`}
                        />
                    </div>
                </div>
            ),
            sorter: (a, b) => {
                return a.staff_unit_curator.users[0].first_name.localeCompare(
                    b.staff_unit_curator.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <IntlMessage id="candidates.name" />,
            dataIndex: 'fullName',
            render: (_, record) => (
                <div className={'d-flex'}>
                    <AvatarStatus
                        size={40}
                        src={
                            (record?.staff_unit?.users?.length > 0 &&
                                record.staff_unit.users[0].icon) ||
                            ''
                        }
                    />
                    <div className="mt-2">
                        <DataText
                            style={{ color: '#1A3353' }}
                            name={`${
                                record.staff_unit.users.length > 0 &&
                                record.staff_unit.users[0].first_name
                            } ${
                                record.staff_unit.users.length > 0 &&
                                record.staff_unit.users[0].last_name
                            } ${
                                (record.staff_unit.users.length > 0 &&
                                    record.staff_unit.users[0].father_name) ||
                                ''
                            }`}
                        />
                    </div>
                </div>
            ),
            sorter: (a, b) => {
                return a.staff_unit.users[0].first_name.localeCompare(
                    b.staff_unit.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: 'Прогресс',
            dataIndex: 'progress',
            render: (progress) => (
                <>
                    {progress === null ? (
                        <Progress percent={0} style={{ width: '180px', color: '#F4F6F7' }} />
                    ) : (
                        <Progress
                            percent={progress === 94 || progress === 88 ? 100 : progress}
                            style={{ width: '180px', color: '#F4F6F7' }}
                        />
                    )}
                </>
            ),
            sorter: {
                compare: (a, b) => a.progress - b.progress,
                multiple: 3,
            },
        },
        {
            title: <IntlMessage id="candidates.currentTable.stage" />,
            dataIndex: 'current_stage',
            render: (_, record) => (
                <span style={{ textAlign: 'center' }}>
                    {record.current_stage === null ? (
                        '-'
                    ) : (
                        <LocalizationTextForCurrentStage text={record} />
                    )}
                </span>
            ),
            sorter: (a, b) => {
                return a.current_stage?.localeCompare(b.current_stage);
            },
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: <IntlMessage id="candidates.currentTable.lastChanges" />,
            dataIndex: 'last_edit_date',
            render: (_, record) => (
                <>
                    {record.last_edit_date === null ? (
                        '-'
                    ) : (
                        <span>{moment(record.last_edit_date).format('DD.MM.YY')}</span>
                    )}
                </>
            ),
            sorter: {
                compare: (a, b) => a.type - b.type,
                multiple: 2,
            },
        },
        {
            title: <IntlMessage id="candidates.currentTable.more" />,
            dataIndex: 'operation',
            key: 'operation',
            render: (_, record) => (
                <div className="d-flex">
                    <div className="mt-2">
                        <Button
                            type="link"
                            onClick={() => {
                                discoverStage(record);
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.discover" />
                        </Button>
                        <Button
                            type="link"
                            onClick={() => {
                                candidatePage(record);
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.personalFile" />
                        </Button>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <TableWithPagination
                initialPageSize={pageSize}
                isLoading={isLoading}
                dataSource={get_all_candidates}
                initialPage={currentPage}
                columns={columns}
                fetchData={fetchData}
                saveCurrentPage={saveCurrentPageSettings}
                hasMore={hasNextPage}
            />
        </div>
    );
}

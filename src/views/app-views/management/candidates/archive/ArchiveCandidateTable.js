import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { Button, Progress, PageHeader } from 'antd';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
import { changeCurrentPage } from '../../../../../store/slices/candidates/candidatesTableControllerSlice';
import TableWithPagination from '../../../../../components/shared-components/TableWithPagination';
import DataText from '../../../../../components/shared-components/DataText';
import { candidatesAllArchive } from '../../../../../store/slices/candidates/candidateArchiveSlice';
import AvatarStatus from '../../../../../components/shared-components/AvatarStatus';
import IntlMessage from 'components/util-components/IntlMessage';

export default function ArchiveCandidateTable() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const get_all_candidates = useSelector(
        (state) => state.сandidateArchive.candidatesAllArchive.data,
    );
    const isLoading = useSelector((state) => state.сandidateArchive.candidatesAllArchive.isLoading);
    const currentPage = useSelector((state) => state.candidateTableArchieveController.currentPage);
    const pageSize = useSelector((state) => state.candidateTableArchieveController.pageSize);
    const hasNextPage = useSelector((state) => state.сandidateArchive.candidatesAllArchive.hasMore);
    const search = useSelector((state) => state.candidates.allCandidateList.search);
    useEffect(() => {
        dispatch(candidatesAllArchive({ page: currentPage, limit: pageSize }));
    }, [search]);

    const discoverStage = (record) => {
        // dispatch(candidatesStageInfo(record));
        navigate(`${APP_PREFIX_PATH}/management/candidates/list/discover/${record.id}`);
    };

    const fetchData = async (params) => {
        return dispatch(candidatesAllArchive(params));
    };

    const saveCurrentPageSettings = (page, pageSize) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    const candidatePage = (record) => {
        navigate(`${APP_PREFIX_PATH}/management/candidates/${record.staff_unit.users[0].id}`);
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
            filters: [
                { text: 'Male', value: 'male' },
                { text: 'Female', value: 'female' },
            ],
        },
        {
            title: <IntlMessage id="candidates.name" />,
            dataIndex: 'fullName',
            render: (_, record) => (
                <div className={'d-flex'}>
                    <AvatarStatus size={40} src={record.staff_unit.users[0].icon} />
                    <div className="mt-2">
                        <DataText
                            style={{ color: '#1A3353' }}
                            name={`${record.staff_unit.users[0].first_name} ${
                                record.staff_unit.users[0].last_name
                            } ${record.staff_unit.users[0].father_name || ''}`}
                        />
                    </div>
                </div>
            ),
        },
        {
            title: 'Прогресс',
            dataIndex: 'progress',
            render: (progress) => (
                <>
                    {progress === null ? (
                        <Progress percent={0} style={{ width: '180px', color: '#F4F6F7' }} />
                    ) : (
                        <Progress percent={progress} style={{ width: '180px', color: '#F4F6F7' }} />
                    )}
                </>
            ),
            sorter: {
                compare: (a, b) => a.progress - b.progress,
                multiple: 3,
            },
        },
        {
            title: <IntlMessage id="candidates.currentTable.reason" />,
            dataIndex: 'debarment_reason',
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
                initialPageSize={5}
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { Button, Progress, PageHeader, Checkbox, Row, Col } from 'antd';
import '../style.css';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import AvatarStatus from '../../../../../components/shared-components/AvatarStatus';
import TableWithPagination from '../../../../../components/shared-components/TableWithPagination';
import DataText from '../../../../../components/shared-components/DataText';
import candidateStageInfoStaffId, {
    candidatesAllListByStaffId,
} from '../../../../../store/slices/candidates/candidateStageInfoSlice';
import { selectedCandidateInfo } from '../../../../../store/slices/candidates/selectedCandidateSlice';
import { candidateStagesInfo } from '../../../../../store/slices/candidates/selectedCandidateStagesSlice';
import { getCandidateCategories } from '../../../../../store/slices/candidates/candidateCategoriesSlice';
import { format } from 'date-fns';
import utils from '../../../../../utils';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { changeCurrentPage } from '../../../../../store/slices/candidates/candidateDocumentTableControllerSlice';
import { CloseOutlined, RightCircleFilled } from '@ant-design/icons';

import './unsigned.css';
import { getUser } from '../../../../../store/slices/users/usersSlice';
import LocalizationText from '../../../../../components/util-components/LocalizationText/LocalizationText';
import { CandidateAfterSignSlice } from '../../../../../store/slices/candidates/candidateAfterSignSlice';

const POLYGRAPH_EXAMINER = 'Полиграфолог';
const PSYCHOLOGIST = 'Психолог';
const INSTRUCTOR = 'Инструктор';

export default function DocumentTable({ selectedIds, setSelectedIds, user }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const search = useSelector((state) => state.candidateStageInfoStaffId.search);
    const isLoading = useSelector((state) => state.candidateStageInfoStaffId.isLoading);
    const currentPage = useSelector((state) => state.candidateAfterSignSlice.currentPage);
    const pageSize = useSelector((state) => state.candidateAfterSignSlice.pageSize);
    const hasNextPage = useSelector((state) => state.candidateStageInfoStaffId.hasMore);

    const get_all_candidates_staff_unit_id = useSelector(
        (state) => state.candidateStageInfoStaffId.allCandidateListByStaffUnitId,
    );
    const candidate = useSelector((state) => state.selectedCandidate.list);

    useEffect(() => {
        dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        dispatch(
            candidatesAllListByStaffId({
                page: 1,
                limit: 5,
            }),
        );
    }, [search]);

    useEffect(() => {
        const arrIds = [];
        get_all_candidates_staff_unit_id?.data?.forEach((item) => {
            arrIds.push({
                id: item.id,
                sign: null,
            });
        });
        setSelectedIds(arrIds);
    }, [get_all_candidates_staff_unit_id]);

    //-------------------------------------------

    const [allTrue, setAllTrue] = useState(false);
    const [allFalse, setAllFalse] = useState(false);

    function addSingId(id, sign) {
        const findItem = selectedIds.find((item) => item.id === id);
        if (findItem) {
            const newSelectedIds = selectedIds.filter((item) => item.id !== id);
            if (findItem.sign === sign) {
                findItem.sign = null;
            } else {
                findItem.sign = sign;
            }
            newSelectedIds.push(findItem);
            setSelectedIds(newSelectedIds);
        }
        setAllTrue(false);
        setAllFalse(false);
    }
    const candidatePage = (record) => {
        navigate(
            `${APP_PREFIX_PATH}/management/candidates/${record.candidate.staff_unit.users[0].id}`,
        );
    };

    function selectAllIds(sign) {
        const newArr = [];
        selectedIds.forEach((item) => {
            newArr.push({
                id: item.id,
                sign: sign,
            });
        });
        setSelectedIds(newArr);
    }

    //----------------

    const discoverStage = (record) => {
        navigate(
            `${APP_PREFIX_PATH}/management/candidates/list/discover/${record.candidate_id}?stageId=${record.candidate_stage_type.id}`,
        );
    };

    const fetchData = async (params) => {
        return dispatch(candidatesAllListByStaffId(params));
    };

    const saveCurrentPageSettings = (page, pageSize) => {
        dispatch(changeCurrentPage({ page: page, pageSize: pageSize }));
    };

    if (get_all_candidates_staff_unit_id === null) {
        return <PageHeader title={''} className="discover-user-name" backIcon={false} />;
    }

    // const areAllAccepted = hrDocumentsNotSigned.every((record) =>
    //     selectedIds.some((idObj) => idObj.id === record.id),
    // );
    // const handleSelectAllChange = (e) => {
    //     setSelectedIds([]);
    // };

    const columns = [
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                gap: '5px',
                                width: '6.25vw'
                            }}
                        >
                            <Checkbox
                                checked={
                                    selectedIds.every((item) => item.sign === true) &&
                                    selectedIds.length > 0
                                }
                                onChange={() => {
                                    if (allTrue) {
                                        selectAllIds(null);
                                        setAllTrue(false);
                                        setAllFalse(false);
                                    } else {
                                        selectAllIds(true);
                                        setAllTrue(true);
                                        setAllFalse(false);
                                    }
                                }}
                            />
                            <IntlMessage id="letters.unsignedTable.accept" />
                        </div>
                    </Row>
                </>
            ),
            dataIndex: 'accept',
            key: 1,
            render: (_, record) => (
                <Row>
                    <Col>
                        <div style={{ paddingRight: '15px' }}>
                            <Checkbox
                                checked={selectedIds.some(
                                    (item) => item.id === record.id && item.sign === true,
                                )}
                                onChange={() => {
                                    addSingId(record.id, true);
                                }}
                                // checked={areAllAccepted}
                                // onChange={handleSelectAllChange}
                            />
                        </div>
                    </Col>
                </Row>
            ),
        },
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw'
                            }}
                        >
                            <Checkbox
                                checked={
                                    selectedIds.every((item) => item.sign === false) &&
                                    selectedIds.length > 0
                                }
                                className="customCheckbox"
                                icon={CloseOutlined}
                                onChange={() => {
                                    if (allFalse) {
                                        selectAllIds(null);
                                        setAllFalse(false);
                                        setAllTrue(false);
                                    } else {
                                        selectAllIds(false);
                                        setAllTrue(false);
                                        setAllFalse(true);
                                    }
                                }}
                            />
                            <IntlMessage id="letters.unsignedTable.refuse" />
                        </div>
                    </Row>
                </>
            ),
            dataIndex: 'reject',
            key: 2,
            render: (_, record) => (
                <Row>
                    <Col>
                        <div style={{ paddingRight: '15px' }}>
                            <Checkbox
                                className="customCheckbox"
                                icon={CloseOutlined}
                                checked={selectedIds.some(
                                    (item) => item.id === record.id && item.sign === false,
                                )}
                                onChange={() => {
                                    addSingId(record.id, false);
                                }}
                                // checked={areAllAccepted}
                                // onChange={handleSelectAllChange}
                            />
                        </div>
                    </Col>
                </Row>
            ),
        },
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw',
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.startDiscoverdate" />
                        </div>
                    </Row>
                </>
            ),

            dataIndex: 'created_at',
            render: (text, record) => (
                <div className={'d-inline'} style={{ justifyContent: 'flex-start' }}>
                    <p className={'text'}> {format(new Date(record.created_at), 'dd.MM.yyyy')}</p>
                    <p style={{ color: '#366EF6' }}>{moment(record.created_at).fromNow()}</p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'created_at'),
            key: 3,
        },
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw',
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.curator" />
                        </div>
                    </Row>
                </>
            ),
            dataIndex: 'curator',
            render: (_, record) => (
                <div className={'d-flex'}>
                    <AvatarStatus
                        size={40}
                        src={record.candidate.staff_unit_curator.users[0]?.icon}
                    />
                    <div className="mt-2">
                        <DataText
                            style={{ color: '#1A3353' }}
                            name={`${record.candidate.staff_unit_curator.users[0].first_name} ${record.candidate.staff_unit_curator.users[0].last_name} `}
                        />
                    </div>
                </div>
            ),
            sorter: (a, b) => {
                return a.candidate.staff_unit_curator.users[0].first_name?.localeCompare(
                    b.candidate.staff_unit_curator.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
            key: 4,
        },
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw',
                            }}
                        >
                            <IntlMessage id="candidates.name" />
                        </div>
                    </Row>
                </>
            ),
            dataIndex: 'candidate_id',
            render: (_, record) => {
                return (
                    <div className={'d-flex'}>
                        <AvatarStatus size={40} src={record.candidate.staff_unit.users[0]?.icon} />
                        <div className="mt-2">
                            <DataText
                                style={{ color: '#1A3353' }}
                                name={`${record.candidate.staff_unit.users[0].first_name} ${record.candidate.staff_unit.users[0].last_name} `}
                            />
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => {
                return a.candidate.staff_unit.users[0].first_name?.localeCompare(
                    b.candidate.staff_unit.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
            key: 5,
        },

        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw',
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.stage" />
                        </div>
                    </Row>
                </>
            ),

            dataIndex: 'candidate_stage_type',
            render: (_, record) => (
                <span style={{ textAlign: 'center' }}>
                    {record.candidate_stage_type.name === null ? (
                        '-'
                    ) : (
                        <LocalizationText text={record.candidate_stage_type} />
                    )}
                </span>
            ),
            sorter: (a, b) => {
                return a.candidate_stage_type.name?.localeCompare(b.candidate_stage_type.name);
            },
            sortDirections: ['ascend', 'descend'],
            key: 6,
        },
        {
            title: (
                <>
                    <Row>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'flex-start',
                                gap: '5px',
                                width: '6.25vw',
                            }}
                        >
                            <IntlMessage id="candidates.currentTable.more" />
                        </div>
                    </Row>
                </>
            ),
            dataIndex: 'operation',
            key: 7,
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

    const columns2 = [
        {
            title: <IntlMessage id="candidates.currentTable.startDiscoverdate" />,
            dataIndex: 'created_at',
            render: (text, record) => (
                <div className={'d-inline'} style={{ justifyContent: 'flex-start' }}>
                    <p className={'text'}> {format(new Date(record.created_at), 'dd.MM.yyyy')}</p>
                    <p style={{ color: '#366EF6' }}>{moment(record.created_at).fromNow()}</p>
                </div>
            ),
            sorter: (a, b) => utils.antdTableSorter(a, b, 'created_at'),
            key: 3,
        },
        {
            title: 'Куратор',
            dataIndex: 'curator',
            render: (_, record) => (
                <div className={'d-flex'}>
                    <AvatarStatus
                        size={40}
                        src={record.candidate.staff_unit_curator.users[0]?.icon}
                    />
                    <div className="mt-2">
                        <DataText
                            style={{ color: '#1A3353' }}
                            name={`${record.candidate.staff_unit_curator.users[0].first_name} ${record.candidate.staff_unit_curator.users[0].last_name} `}
                        />
                    </div>
                </div>
            ),
            sorter: (a, b) => {
                return a.candidate.staff_unit_curator.users[0].first_name?.localeCompare(
                    b.candidate.staff_unit_curator.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
            key: 4,
        },
        {
            title: <IntlMessage id="candidates.name" />,
            dataIndex: 'candidate_id',
            render: (_, record) => {
                return (
                    <div className={'d-flex'}>
                        <AvatarStatus size={40} src={record.candidate.staff_unit.users[0]?.icon} />
                        <div className="mt-2">
                            <DataText
                                style={{ color: '#1A3353' }}
                                name={`${record.candidate.staff_unit.users[0].first_name} ${record.candidate.staff_unit.users[0].last_name} `}
                            />
                        </div>
                    </div>
                );
            },
            sorter: (a, b) => {
                return a.candidate.staff_unit.users[0].first_name?.localeCompare(
                    b.candidate.staff_unit.users[0].first_name,
                );
            },
            sortDirections: ['ascend', 'descend'],
            key: 5,
        },

        {
            title: <IntlMessage id="candidates.currentTable.stage" />,
            dataIndex: 'candidate_stage_type',
            render: (_, record) => (
                <span style={{ textAlign: 'center' }}>
                    {record.candidate_stage_type.name === null ? (
                        '-'
                    ) : (
                        <LocalizationText text={record.candidate_stage_type} />
                    )}
                </span>
            ),
            sorter: (a, b) => {
                return a.candidate_stage_type.name?.localeCompare(b.candidate_stage_type.name);
            },
            sortDirections: ['ascend', 'descend'],
            key: 6,
        },
        {
            title: <IntlMessage id="candidates.currentTable.more" />,
            dataIndex: 'operation',
            key: 7,
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
                className="responsive-table"
                initialPageSize={pageSize}
                isLoading={isLoading}
                dataSource={get_all_candidates_staff_unit_id.data}
                initialPage={currentPage}
                columns={
                    user?.actual_staff_unit.position.name === INSTRUCTOR ||
                    user?.actual_staff_unit.position.name === POLYGRAPH_EXAMINER
                        ? columns2
                        : columns
                }
                fetchData={fetchData}
                saveCurrentPage={saveCurrentPageSettings}
                hasMore={hasNextPage}
                responsive
            />
        </div>
    );
}

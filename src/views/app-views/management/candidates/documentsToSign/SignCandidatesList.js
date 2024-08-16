import { Button, Card, Col, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from 'store/slices/ProfileSlice';
import { getUser } from 'store/slices/users/usersSlice';
import { getUserID } from 'utils/helpers/common';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { changeCurrentPage } from '../../../../../store/slices/candidates/candidateDocumentTableControllerSlice';
import {
    candidate_stage_info_reject,
    candidate_stage_info_sign_ecp,
    candidatesAllListByStaffId,
    setSearchText,
} from '../../../../../store/slices/candidates/candidateStageInfoSlice';
import DocumentTable from './DocumentTable';
import SignEcp from 'components/shared-components/SignEcp';

const { Search } = Input;

const POLYGRAPH_EXAMINER = 'Полиграфолог';
const INSTRUCTOR = 'Инструктор';

const PageHeaderExtra = ({ selectedIds, user, setIsModalOpen }) => {
    const [search, setSearch] = useState('');
    const dispatch = useDispatch();

    const [show, setShow] = useState(null);

    // const searchState = useSelector((state) => state.candidateStageInfoStaffId.search);

    const searchText = (search) => {
        clearTimeout(show);
        setShow(
            setTimeout(() => {
                if (search === undefined) {
                    dispatch(setSearchText(null));
                } else {
                    dispatch(setSearchText(search));
                }
            }, 300),
        );
    };

    return (
        <div>
            <Row gutter={15} justify={'space-between'}>
                <Col>
                    <Search
                        style={{ width: 300 }}
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        onSearch={(e) => {
                            searchText(search);
                        }}
                    />
                </Col>
                <Col>
                    {user?.actual_staff_unit.position.name === INSTRUCTOR ||
                    user?.actual_staff_unit.position.name === POLYGRAPH_EXAMINER ? null : (
                        <Button onClick={setIsModalOpen} type="primary">
                            <IntlMessage id="letters.sign" />
                        </Button>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default function SignCandidatesList() {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useDispatch();

    const user = useSelector((state) => state.users.user);
    const myProfile = useSelector((state) => state.profile.data);

    const currentPage = useSelector((state) => state.candidateDocumentTableController.currentPage);
    const pageSize = useSelector((state) => state.candidateDocumentTableController.pageSize);

    const showModalDigitalSignature = (bool) => {
        setIsModalOpen(bool);
    };

    useEffect(() => {
        if (myProfile && myProfile?.id) {
            dispatch(getUser(myProfile.id));
        }
    }, [myProfile]);

    useEffect(() => {
        const getUser = async () => {
            dispatch(getProfile({ id: await getUserID() }));
        };
        if (myProfile === null) getUser();
    }, [myProfile]);

    function singStageInfo() {
        selectedIds.forEach((item) => {
            const stageInfoId = item.id;
            const sign = item.sign;
            if (sign !== null) {
                if (sign) {
                    dispatch(candidate_stage_info_sign_ecp(stageInfoId));
                } else {
                    dispatch(candidate_stage_info_reject(stageInfoId));
                }
            }
        });
        setTimeout(() => {
            dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
            dispatch(
                candidatesAllListByStaffId({
                    page: currentPage,
                    limit: pageSize,
                }),
            );
        }, 500);
    }

    return (
        <div>
            <Card>
                <PageHeaderExtra
                    selectedIds={selectedIds}
                    user={user}
                    setIsModalOpen={setIsModalOpen}
                />
                <DocumentTable
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                    user={user}
                />
            </Card>
            <SignEcp
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                callback={singStageInfo}
            />
        </div>
    );
}

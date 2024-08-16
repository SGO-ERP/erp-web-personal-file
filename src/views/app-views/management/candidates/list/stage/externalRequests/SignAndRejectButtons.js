import React, { useState } from 'react';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { Button, Col, Row } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    candidate_stage_info_sign,
    candidatesAllListByStaffId,
} from '../../../../../../../store/slices/candidates/candidateStageInfoSlice';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { useNavigate } from 'react-router';
import { changeCurrentPage } from '../../../../../../../store/slices/candidates/candidateDocumentTableControllerSlice';
import SignEcp from '../../../../../../../components/shared-components/SignEcp';

const SignAndRejectButtons = ({ stageInfo, saveAnswer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentPage = useSelector((state) => state.candidateDocumentTableController.currentPage);
    const pageSize = useSelector((state) => state.candidateDocumentTableController.pageSize);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSign = async () => {
        saveAnswer();
        await dispatch(candidate_stage_info_sign(stageInfo?.candidate_stage_info.id));
        await dispatch(changeCurrentPage({ page: 1, pageSize: 5 }));
        await dispatch(
            candidatesAllListByStaffId({
                page: 1,
                limit: 5,
            }),
        );
        await dispatch(
            candidatesAllListByStaffId({
                page: currentPage,
                limit: pageSize,
            }),
        );
        navigate(`${APP_PREFIX_PATH}/management/candidates/documentstosign`);

        setIsModalOpen(false);
    };
    const clickRefuse = () => {
        setIsModalOpen(true);
    };

    const clickSign = () => {
        setIsModalOpen(true);
    };

    return (
        <div>
            <Row gutter={6}>
                <Col xs={18} style={{ textAlign: 'end' }}>
                    <Button danger onClick={clickRefuse}>
                        <IntlMessage id={'letters.unsignedTable.refuse'} />
                    </Button>
                </Col>
                <Col xs={6}>
                    <Button type="primary" onClick={clickSign}>
                        <IntlMessage id={'candidates.button.sign'} />
                    </Button>
                </Col>
            </Row>
            {/*<Ecp*/}
            {/*    modalCase={{ showModalDigitalSignature }}*/}
            {/*    openModal={isModalOpen}*/}
            {/*    handleReject={handleReject}*/}
            {/*    handleSign={handleSign}*/}
            {/*    isAccept={isAccept}*/}
            {/*/>*/}
            <SignEcp
                open={isModalOpen}
                callback={handleSign}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default SignAndRejectButtons;

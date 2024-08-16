import React from 'react';
import { Button, Col, Row } from 'antd';
import Breadcrumbs from '../BreadcrumbItems';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import LocalizationText from '../../../../../../../components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { useNavigate } from 'react-router';

const ExternalForButtonViewInfo = ({ path, main, username, selectedCandidate }) => {
    const navigate = useNavigate();

    const candidatePage = (id) => {
        navigate(`${APP_PREFIX_PATH}/management/candidates/${id}`);
    };
    return (
        <div>
            <Row>
                <Col xs={16}>
                    <Breadcrumbs
                        path={path}
                        main={<LocalizationText text={main} />}
                        userName={username}
                    />
                </Col>
                <Col xs={8} style={{ position: 'absolute', top: '0', right: '0' }}>
                    <Row gutter={16}>
                        <Col>
                            <Button
                                onClick={() => {
                                    navigate(-1);
                                }}
                            >
                                <IntlMessage id={'initiate.back'} />
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                onClick={() =>
                                    candidatePage(selectedCandidate.staff_unit.users[0].id)
                                }
                            >
                                <IntlMessage id="candidates.button.dataCandidate" />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};

export default ExternalForButtonViewInfo;

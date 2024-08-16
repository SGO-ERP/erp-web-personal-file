import { EyeTwoTone } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Row, Tooltip, Typography } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcStaffFunctionsAvg, formatYears, sumYears } from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import LocalizationText, {
    LocalText,
} from '../../../../../../components/util-components/LocalizationText/LocalizationText';
import { APP_PREFIX_PATH } from '../../../../../../configs/AppConfig';
import ServicesService from '../../../../../../services/myInfo/ServicesService';
import ModalQualReqWatch from '../modals/ModalQualReqWatch';
import { PrivateServices } from 'API';
import ModalCandidates from '../modals/ModalCandidates';

export const TreeStaffFirstCol = ({ staff_unit, selectedItem }) => {
    const [openModal, setOpenModal] = useState(false);
    const [emergencyContract, setEmergencyContract] = useState([]);
    const [divisionParents, setDivisionParents] = useState([]);
    const [candidateSee, setCandidateSee] = useState(false);
    const [candidate, setCandidate] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const seeLastChildren = () => {
            if (staff_unit?.users?.length > 0) {
                PrivateServices.get('/api/v1/staff_division/division_parents/{id}/', {
                    params: {
                        path: {
                            id: staff_unit?.staff_division_id,
                        },
                    },
                })
                    .then((r) => {
                        getDivisionParents(r.data, []);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        };
        seeLastChildren();

        const allowance = () => {
            if (staff_unit?.users?.length > 0 || staff_unit?.user !== undefined) {
                ServicesService.get_services(staff_unit?.users[0].id).then((r) => {
                    setEmergencyContract(r?.emergency_contracts);
                });
            }
        };
        allowance();
    }, [staff_unit]);

    useEffect(() => {
        if (staff_unit?.hr_vacancy?.length > 0) {
            const vacancyCandidate = () => {
                PrivateServices.get('/api/v1/hr_vacancies/{id}/candidates', {
                    params: {
                        path: {
                            // @ts-expect-error Anomaly ts
                            id: staff_unit?.hr_vacancy[0]?.id,
                        },
                    },
                }).then((candidates) => {
                    candidates.data && setCandidate(candidates.data);
                });
            };
            vacancyCandidate();
        }
    }, [staff_unit]);

    function getDivisionParents(division, data) {
        const updatedParents = [
            ...data,
            {
                id: division.id,
                name: division.name,
                nameKZ: division.nameKZ,
                type: division.type,
                staff_division_number: division.staff_division_number,
            },
        ];
        if (division.children && division.children.length > 0) {
            getDivisionParents(division.children[0], updatedParents);
        } else {
            setDivisionParents(updatedParents);
        }
    }

    const divisions = () => {
        return (
            <Row justify="end">
                {divisionParents.map((division) => (
                    <Col
                        key={division.id}
                        xs={24}
                        style={{ color: '#366EF6', display: 'flex', justifyContent: 'flex-end' }}
                    >
                        {division.type === null ? (
                            <LocalizationText text={division} />
                        ) : (
                            division?.staff_division_number +
                            ' ' +
                            LocalText.getName(division?.type)
                        )}
                    </Col>
                ))}
            </Row>
        );
    };

    const position =
        staff_unit?.position !== null
            ? staff_unit.position
            : staff_unit?.position === null &&
              staff_unit?.actual_position !== null &&
              staff_unit.actual_position;

    if (
        staff_unit == null ||
        !staff_unit.hasOwnProperty('users') ||
        !Array.isArray(staff_unit.users)
    ) {
        return null
    }
    return (
        <div>
            <ModalQualReqWatch
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                staff_unit={staff_unit}
            />
            <ModalCandidates
                isOpen={candidateSee}
                onClose={() => setCandidateSee(false)}
                candidate={candidate}
                staffUnit={staff_unit}
            />
            <div>
                <Row>
                    <Col xs={16} lg={16} xl={16}>
                        <Col>
                            <Row gutter={16}>
                                <Col xs={24}>
                                    {staff_unit?.actual_position !== null &&
                                    staff_unit?.position !== null ? (
                                        <>
                                            <Typography.Text strong>
                                                {LocalText.getName(staff_unit?.actual_position)}
                                            </Typography.Text>
                                            &nbsp;
                                            <Typography.Text className={'text-muted'}>
                                                ({LocalText.getName(staff_unit?.position)})
                                            </Typography.Text>
                                        </>
                                    ) : staff_unit?.actual_position === null &&
                                      staff_unit?.position !== null ? (
                                        <>
                                            <Typography.Text strong>
                                                {LocalText.getName(staff_unit?.position)}
                                            </Typography.Text>
                                        </>
                                    ) : (
                                        staff_unit?.actual_position !== null &&
                                        staff_unit?.position === null && (
                                            <>
                                                <Typography.Text strong>
                                                    {LocalText.getName(staff_unit?.actual_position)}
                                                </Typography.Text>
                                            </>
                                        )
                                    )}
                                </Col>
                            </Row>
                            <Row justify="space-between">
                                <Typography.Text type="secondary">
                                    {position.category_code}
                                </Typography.Text>
                                <Typography.Text type="secondary">
                                    <IntlMessage id={'scheduel.allowance'} />: {position?.form}
                                </Typography.Text>
                            </Row>
                        </Col>
                    </Col>
                    <Col xs={8} lg={8} xl={8}>
                        {divisions()}
                    </Col>
                </Row>
                <Divider />
                <div>
                    <Row style={{ marginBottom: '10px', marginTop: '-8px' }}>
                        <IntlMessage id={'scheduel.maxRank'} />
                        {':'}&nbsp;
                        <span style={{ color: '#366EF6' }}>
                            {LocalText.getName(position.max_rank)}
                        </span>
                    </Row>
                    {staff_unit.users.length > 0 ? (
                        <>
                            <Row gutter={16} style={{ alignItems: 'center' }}>
                                <Col xs={5}>
                                    <AvatarStatus
                                        src={staff_unit.users[0].icon}
                                        size={60}
                                        onClick={() =>
                                            navigate(
                                                `${APP_PREFIX_PATH}/duty/data/${staff_unit.users[0].id}`,
                                            )
                                        }
                                    />
                                </Col>
                                <Col xs={8}>
                                    <Tooltip
                                        title={<IntlMessage id="schedule.direct.personal.page" />}
                                    >
                                        <Typography.Text
                                            style={{ cursor: 'pointer' }}
                                            strong
                                            onClick={() =>
                                                navigate(
                                                    `${APP_PREFIX_PATH}/duty/data/${staff_unit.users[0].id}`,
                                                )
                                            }
                                        >
                                            {staff_unit.users[0]?.father_name !== null
                                                ? staff_unit.users[0].last_name +
                                                  ' ' +
                                                  staff_unit.users[0].first_name +
                                                  ' ' +
                                                  staff_unit.users[0]?.father_name
                                                : staff_unit.users[0].last_name +
                                                  ' ' +
                                                  staff_unit.users[0].first_name}
                                        </Typography.Text>
                                    </Tooltip>
                                </Col>

                                <Col xs={4}>
                                    <Tooltip
                                        title={
                                            <LocalizationText text={staff_unit?.users[0]?.rank} />
                                        }
                                    >
                                        <Avatar
                                            src={
                                                staff_unit.users[0].is_military === true
                                                    ? staff_unit.users[0]?.rank?.military_url
                                                    : staff_unit.users[0].is_military === false
                                                    ? staff_unit.users[0]?.rank?.employee_url
                                                    : null
                                            }
                                            style={{ color: 'black' }}
                                            size={40}
                                        />
                                    </Tooltip>
                                </Col>
                                <Col xs={4}>
                                    <Avatar size={40} style={{ color: 'black', border: '2px solid #366EF6' }}>
                                        {formatYears(sumYears(emergencyContract))}
                                    </Avatar>
                                </Col>
                            </Row>
                            <div style={{ marginBottom: '-8px', marginTop: '10px' }}>
                                <IntlMessage id={'scheduel.position'} />
                                {':'}&nbsp;
                                <span style={{ color: '#366EF6' }}>
                                    {LocalText.getName(staff_unit.users[0].rank)}
                                </span>
                            </div>
                        </>
                    ) : (
                        staff_unit.hr_vacancy?.length > 0 ? (
                            <>
                                <Row style={{ marginTop: '24px' }}>
                                    <Typography.Text strong>
                                        <IntlMessage id={'staffSchedule.vacant'} />
                                        &nbsp;&nbsp;
                                    </Typography.Text>
                                    <Typography.Text className={'text-muted'}>
                                        {moment(staff_unit.hr_vacancy.created_at).format(
                                            'DD.MM.YYYY',
                                        )}
                                    </Typography.Text>
                                </Row>
                                <Row style={{ marginTop: '24px' }}>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setCandidateSee(true);
                                        }}
                                        disabled={candidate?.length === 0}
                                        style={{ borderRadius: '10px' }}
                                    >
                                        <IntlMessage id={'scheduel.watch.candidate'} /> &nbsp; (
                                        {candidate?.length})
                                    </Button>
                                </Row>
                            </>
                        ) : null
                    )}
                </div>
            </div>
            <Divider />
            <Row style={{ marginTop: '34.5px' }}>
                <Col xs={2}>
                    <Tooltip title={<IntlMessage id="schedule.view.clav.req" />}>
                        <EyeTwoTone
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        />
                    </Tooltip>
                </Col>
                <Col xs={22}>
                    <IntlMessage id={'scheduel.quality'} />
                </Col>
            </Row>
            {staff_unit?.staff_functions?.length > 0 && (
                <Row style={{ marginTop: '12px' }}>
                    <div style={{ color: '#29CC6A' }}>
                        {Array.isArray(staff_unit.staff_functions) &&
                            calcStaffFunctionsAvg(staff_unit.staff_functions)}
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        <IntlMessage id={'scheduel.functional'} />
                    </div>
                </Row>
            )}
        </div>
    );
};

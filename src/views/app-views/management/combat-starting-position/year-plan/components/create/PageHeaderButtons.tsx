import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Button, Col, Modal, notification, Row } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import { components } from '../../../../../../../API/types';
import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';

import ModalAnnualSchedule from '../modals/ModalAnnualSchedule';
import {
    clearLocalScheduleYear,
    clearRemoteScheduleYear,
} from '../../../../../../../store/slices/bsp/create/scheduleYear';
import { APP_PREFIX_PATH } from '../../../../../../../configs/AppConfig';
import { PrivateServices } from '../../../../../../../API';
import { SCHEDULE_YEAR } from '../../../../../../../constants/AuthConstant';
import { DataNode } from 'antd/lib/tree';

interface Props {
    setCheck: (value: boolean) => void;
    setInfo: (value: DataNode[]) => void;
    setNode: (value: any) => void;
    setCheckedKeys: (value: string[]) => void;
}
const PageHeaderButtons = ({ setCheck, setInfo, setNode, setCheckedKeys }: Props) => {
    const [isOpenAnnSche, setIsOpenAnnSche] = useState(false);
    const [data, setData] = useState<components['schemas']['BspPlanRead']['schedule_years']>();
    const [plan, setPlan] = useState<components['schemas']['ScheduleYearRead'][]>([]);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bsp_plan_id = searchParams.get('bsp-plan-id');
    const localScheduelYear = useAppSelector((state) => state.scheduleYear.local);
    const removeScheduelYear = useAppSelector((state) => state.scheduleYear.remove);

    useEffect(() => {
        if (bsp_plan_id) {
            PrivateServices.get('/api/v1/plan/{id}/', {
                params: { path: { id: bsp_plan_id } },
            }).then((responce) => {
                if (responce.data) {
                    if (responce.data.schedule_years) {
                        setPlan(responce?.data?.schedule_years);
                    }
                }
            });
        }
    }, [localScheduelYear]);

    const error = () => {
        const currentLocale = localStorage.getItem('lan');

        Modal.confirm({
            title:
                currentLocale === 'kk'
                    ? 'Сіз шынымен барлық деректерді қалпына келтіргіңіз келе ме?'
                    : 'Вы действительно хотите сбросить все данные?',
            icon: <ExclamationCircleOutlined style={{ fontSize: '1.4rem', color: '#FC5555' }} />,
            content:
                currentLocale === 'kk'
                    ? 'Растай отырып, сіз осы жылдық жоспардың бөлігі ретінде енгізген барлық деректерді өшіресіз'
                    : 'Подтверждая, вы стираете все введенные вами данные в рамках настоящего годового плана',
            okText: currentLocale === 'kk' ? 'Ия' : 'Да',
            cancelText: currentLocale === 'kk' ? 'Жоқ' : 'Нет',
            onOk: () => {
                localScheduelYear.map((item) => {
                    if (item?.id && item?.staff_divisions?.[0]?.id) {
                        PrivateServices.del('/api/v1/schedule_year/division/{schedule_id}/{division_id}/', {
                            params: {
                                path: {
                                    schedule_id: item.id,
                                    division_id: item?.staff_divisions?.[0]?.id,
                                },
                            },
                        });
                    }
                });
                dispatch(clearLocalScheduleYear());
                dispatch(clearRemoteScheduleYear());

                setInfo([]);
                setNode(null);
                setCheckedKeys([]);
            },
        });
    };

    const isDraft = () => {
        if (bsp_plan_id !== null) {
            removeScheduelYear.map((item) => {
                PrivateServices.del('/api/v1/schedule_year/division/{schedule_id}/{division_id}/', {
                    params: {
                        path: {
                            schedule_id: item?.id,
                            division_id: item?.division_id,
                        },
                    },
                });
            });
            PrivateServices.post('/api/v1/plan/draft/{id}/', {
                params: {
                    path: {
                        id: bsp_plan_id,
                    },
                },
            }).then((response) => {
                notification.success({
                    message: <IntlMessage id={'bsp.delete.actual'} />,
                });
                localStorage.removeItem(SCHEDULE_YEAR);
                navigate(`${APP_PREFIX_PATH}/management/combat-starting-position/year-plan`);
            });
        }
    };

    return (
        <>
            <ModalAnnualSchedule
                onClose={() => setIsOpenAnnSche(false)}
                isOpen={isOpenAnnSche}
                data={data}
            />
            <Row gutter={16}>
                <Col>
                    <Button
                        onClick={error}
                        disabled={plan?.length === 0 && localScheduelYear.length === 0}
                        danger
                    >
                        <IntlMessage id={'csp.create.year.plan.button.throw'} />
                    </Button>
                </Col>

                <Col>
                    <Button
                        onClick={() => isDraft()}
                        disabled={plan?.length === 0 && localScheduelYear.length === 0}
                    >
                        <IntlMessage id={'initiate.draftAll'} />
                    </Button>
                </Col>

                <Col>
                    <Button
                        type={'primary'}
                        onClick={() => setIsOpenAnnSche(true)}
                        disabled={plan?.length === 0 && localScheduelYear.length === 0}
                    >
                        <IntlMessage id={'csp.create.year.plan.button.show.list'} />
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default PageHeaderButtons;

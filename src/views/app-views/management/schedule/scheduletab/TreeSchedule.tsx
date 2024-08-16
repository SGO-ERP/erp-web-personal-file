import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EditTreeStaff from './trees/Edit/TreeStaff';
import EditVerticalTree from './trees/Edit/VerticalTree';
import TreeStaff from './trees/TreeStaff';
import VerticalTree from './trees/VerticalTree';
import './trees/tree.css';
import { useAppDispatch } from 'hooks/useStore';
import { getDraftStaffDivision } from 'store/slices/schedule/archiveStaffDivision';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

export const TreeSchedule = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode');
    const [isEdit, setIsEdit] = useState(false);
    const staffListId = searchParams.get('staffListId');

    useEffect(() => {
        if (mode === 'edit') {
            setIsEdit(true);
        }
    }, [mode, searchParams]);

    useEffect(() => {
        if (staffListId) {
            (async () => {
                await dispatch(
                    getDraftStaffDivision({
                        query: {
                            staff_list_id: staffListId,
                        },
                    }),
                );
            })();
        } else {
            navigate(`${APP_PREFIX_PATH}/management/schedule/history`);
        }
    }, [staffListId]);

    return (
        <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col xs={24} lg={8} style={{ minWidth: '342px' }} className="schedule__left-side">
                {!isEdit ? <VerticalTree /> : <EditVerticalTree />}
            </Col>
            <Col
                xs={24}
                lg={16}
                style={{ position: 'sticky', top: '20px', width: '100%' }}
                className="schedule__right-side"
            >
                <div style={{ position: 'sticky', top: '95px' }}>
                    {!isEdit ? <TreeStaff /> : <EditTreeStaff />}
                </div>
            </Col>
        </Row>
    );
};

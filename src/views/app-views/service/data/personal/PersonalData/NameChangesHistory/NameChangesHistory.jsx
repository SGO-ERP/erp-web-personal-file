import { Col, Row } from 'antd';
import moment from 'moment/moment';
import React from 'react';
import IntlMessage from '../../../../../../../components/util-components/IntlMessage';
import CollapseErrorBoundary from '../../common/CollapseErrorBoundary';
import {useAppSelector} from '../../../../../../../hooks/useStore';
import {useDispatch, useSelector} from 'react-redux';
import {DeleteTwoTone} from '@ant-design/icons';
import {deleteByPath} from '../../../../../../../store/slices/myInfo/personalInfoSlice';
import {addFieldValue, replaceByPath} from '../../../../../../../store/slices/myInfo/myInfoSlice';
import { PERMISSION } from 'constants/permission';

const NameChangesHistory = ({ initialsHistory, source }) => {
    const myPermissions = useAppSelector((state) => state.profile.permissions);

    const isHR = myPermissions?.includes(PERMISSION.PERSONAL_PROFILE_EDITOR);
    const modeRedactor = useSelector((state) => state.myInfo.modeRedactor);

    const dispatch = useDispatch();

    const deleteHistoryName = (nameChange) => {
        if (source === 'get') {
            // Delete from GET slice
            dispatch(
                deleteByPath({
                    path: 'nameChangeHistory',
                    id: nameChange.id,
                }),
            );
            // Add to Edited slice
            dispatch(
                addFieldValue({
                    fieldPath: 'edited.personal_data.name_change',
                    value: { id: nameChange.id, delete: true },
                }),
            );
        }
        if (source === 'edited') {
            // Edit current item in Edited slice (item already exists)
            dispatch(
                replaceByPath({
                    path: 'edited.personal_data.name_change',
                    id: nameChange.id,
                    newObj: { id: nameChange.id, delete: true },
                }),
            );
        }
        if (source === 'added') {
            // Edit item in myInfo.allTabs
            dispatch(
                replaceByPath({
                    path: 'allTabs.personal_data.name_change',
                    id: nameChange.id,
                    newObj: { id: nameChange.id, delete: true },
                }),
            );
        }

    }

    return (
        <CollapseErrorBoundary fallback={<IntlMessage id='myInfo.dataLoadError' />}>
            <Col xs={24}>
                {/* <Row style={{ border: '1px solid black' }} /> */}
                {initialsHistory.map((nameChange, index) => {
                    if (nameChange.delete) {
                        return;
                    }
                    return (
                        <Row key={index} style={{height: 30}}>
                            <Col xs={8} className={'font-style text-muted'}>
                                <IntlMessage id={`personal.personalData.${nameChange?.name_type}`}/>
                            </Col>
                            <Col xs={14} className={'font-style'}>
                                {nameChange.name_before && nameChange.name_after
                                    ? `${nameChange.name_before} -> ${nameChange.name_after} (${moment(
                                        nameChange.created_at,
                                    ).format('DD.MM.YYYY')})`
                                    : 'No changes'}
                            </Col>
                            {
                                isHR && modeRedactor
                                &&
                                <Col xs={2}>
                                    <DeleteTwoTone twoToneColor='#FF4D4F'
                                                   onClick={() => deleteHistoryName(nameChange)}/>
                                </Col>
                            }
                        </Row>
                    )
                })}
            </Col>
        </CollapseErrorBoundary>
    );
};

export default NameChangesHistory;

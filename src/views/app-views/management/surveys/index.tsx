import React from 'react';

import { Card, Cascader, Col, Input, Radio, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import './style.css';

import IntlMessage from 'components/util-components/IntlMessage';

import { APP_PREFIX_PATH } from 'configs/AppConfig';

import Active from './components/tables/Active';
import Archive from './components/tables/Archive';
import Drafts from './components/tables/Drafts';
import { resetSlice } from 'store/slices/surveys/surveysSlice';
import { useDispatch } from 'react-redux';

enum TableType {
    Active = 'active',
    Archive = 'archive',
    Drafts = 'drafts',
}

const Polls = () => {
    const [search, setSearch] = React.useState<string>('');
    const [selectedTable, setSelectedTable] = React.useState<TableType>(TableType.Active);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const create: any = [
        {
            value: <IntlMessage id="surveys.toolbar.button.create" />,
            label: 'Create',
        },
        {
            value: 'survey',
            label: <IntlMessage id="surveys.toolbar.button.create.survey" />,
        },
        {
            value: 'blanc',
            label: <IntlMessage id="surveys.toolbar.button.create.blanc" />,
        },
    ];

    const createSurvey = (e: any) => {
        dispatch(resetSlice());
        if (e[0] !== 'blanc') {
            navigate(`${APP_PREFIX_PATH}/management/surveys/create/true`);
        } else {
            navigate(`${APP_PREFIX_PATH}/management/surveys/create/false`);
        }
    };

    return (
        <React.Fragment>
            <Card>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Radio.Group
                            defaultValue={TableType.Active}
                            value={selectedTable}
                            onChange={(evt) => {
                                setSelectedTable(evt.target.value);
                            }}
                        >
                            <Radio.Button value={TableType.Active}>
                                <IntlMessage id="surveys.toolbar.radio.group.surveys" />
                            </Radio.Button>
                            <Radio.Button value={TableType.Archive}>
                                <IntlMessage id="staffSchedule.radioButton.archive" />
                            </Radio.Button>
                            <Radio.Button value={TableType.Drafts}>
                                <IntlMessage id="staffSchedule.radioButton.drafts" />
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                    <Col
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Input.Search
                            placeholder={t('surveys.toolbar.search.placeholder')}
                            value={search}
                            onChange={(evt) => {
                                setSearch(evt.target.value);
                            }}
                            style={{
                                width: '300px',
                                marginRight: '20px',
                                marginTop: '10px',
                                marginBottom: '10px',
                            }}
                        />
                        <Cascader
                            options={create.filter((e: any) => e.label !== 'Create')}
                            style={{ width: 100 }}
                            value={create[0].value}
                            allowClear={false}
                            onChange={createSurvey}
                        />
                    </Col>
                </Row>

                {selectedTable === TableType.Active ? (
                    <Active />
                ) : selectedTable === TableType.Archive ? (
                    <Archive />
                ) : (
                    <Drafts />
                )}
            </Card>
        </React.Fragment>
    );
};

export default Polls;

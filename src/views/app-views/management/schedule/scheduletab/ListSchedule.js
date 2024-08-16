import { Card, Col, Input, Radio, Row, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import '../style.css';
import ListDraftsTable from '../tables/ListDraftsTable';
import ListSignedTable from '../tables/ListSignedTable';
import { useAppDispatch } from '../../../../../hooks/useStore';
import { querySearch } from '../../../../../store/slices/schedule/staffListSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
const { Search } = Input;

export default function ListSchedule() {
    const [type, setType] = useState('signed');

    const dispatch = useAppDispatch();

    function handleTableChange(event) {
        const value = event.target.value;
        setType(value);
    }

    const [show, setShow] = useState(null);

    const handleSearchText = (value) => {
        clearTimeout(show);
        setShow(
            setTimeout(() => {
                if (value === undefined) {
                    dispatch(querySearch(''));
                } else {
                    dispatch(querySearch(value));
                }
            }, 300),
        );
    };

    return (
        <Card style={{ marginTop: '20px' }}>
            <Row justify="space-between" gutter={12} style={{ marginBottom: '10px' }}>
                <Col xs={24} sm={6} md={12} lg={14} xl={16}>
                    <Radio.Group defaultValue="signed" value={type} onChange={handleTableChange}>
                        <Radio.Button value="signed">
                            <IntlMessage id="staffSchedule.radioButton.signed" />
                        </Radio.Button>
                        <Radio.Button value="drafts">
                            <IntlMessage id="letters.radioButton.draft" />
                        </Radio.Button>
                    </Radio.Group>
                </Col>
                <Col xs={24} sm={10} md={8} lg={6} xl={5}>
                    <Search
                        placeholder="Поиск"
                        allowClear
                        style={{ width: '100%' }}
                        onSearch={handleSearchText}
                    />
                </Col>
            </Row>
            {type === 'signed' ? <ListSignedTable /> : <ListDraftsTable />}
        </Card>
    );
}

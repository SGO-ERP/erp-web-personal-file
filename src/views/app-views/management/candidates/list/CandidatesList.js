import React, { useEffect, useState } from 'react';
import { PageHeader, Row, Col, Button, Input, Card, Radio } from 'antd';
import ActiveTable from './table/ActiveTable';
import ArchiveCandidateTable from '../archive/ArchiveCandidateTable';
import { useDispatch } from 'react-redux';
import { setSearchText } from '../../../../../store/slices/candidates/candidatesSlice';
import AddCandidate from '../modals/AddCandidate';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
const { Search } = Input;

const PageHeaderExtra = () => {
    const dispatch = useDispatch();

    const [show, setShow] = useState(null);

    const [openAddCandidate, setOpenAddCandidate] = useState(false);
    const showModalAddCandidate = (bool) => {
        setOpenAddCandidate(bool);
    };

    const handleSearch = (value) => {
        clearTimeout(show);
        setShow(
            setTimeout(() => {
                if (value === undefined) {
                    dispatch(setSearchText(null));
                } else {
                    dispatch(setSearchText(value));
                }
            }, 1000),
        );
    };

    return (
        <div>
            <Row gutter={15}>
                <Col>
                    <Search style={{ width: 300 }} onSearch={handleSearch} />
                </Col>
                <Col>
                    <Button onClick={showModalAddCandidate} type="primary">
                        <IntlMessage id="candidates.button.addCandidates" />
                    </Button>
                </Col>
            </Row>
            <AddCandidate modalCase={{ showModalAddCandidate }} openModal={openAddCandidate} />
        </div>
    );
};

export default function CandidatesList() {
    const [selectedTable, setSelectedTable] = useState('table');

    function handleTableChange(event) {
        setSelectedTable(event.target.value);
    }

    return (
        <div>
            <Card>
                <PageHeader
                    title={<IntlMessage id="candidates" />}
                    backIcon={false}
                    extra={<PageHeaderExtra />}
                />
                <Row justifyContent="space-between" gutter={12} style={{ marginBottom: '10px' }}>
                    <Col xs={24} sm={6} md={12} lg={14} xl={16}>
                        <Radio.Group defaultValue="table">
                            <Radio.Button value="table" onChange={handleTableChange}>
                                <IntlMessage id="candidates.radiobutton.active" />
                            </Radio.Button>

                            <Radio.Button value="manager" onChange={handleTableChange}>
                                <IntlMessage id="candidates.radiobutton.archieve" />
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
                {selectedTable === 'table' ? <ActiveTable /> : <ArchiveCandidateTable />}
            </Card>
        </div>
    );
}

import React, { useEffect } from 'react';

import { Button, Card, Col, Input, Radio, Row, Typography } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import IntlMessage from '../../../../components/util-components/IntlMessage';

import { setSearch } from 'store/slices/doNotTouch/staff';

import ArchiveTable from './components/tables/ArchivedStaff';
import ActiveStaff from './components/tables/ActiveStaff';
import { APP_PREFIX_PATH } from '../../../../configs/AppConfig';
import { useDebounce } from '../../../../hooks/useDebounce';

const { Search } = Input;
const { Title } = Typography;

const Staff = () => {
    const [selectedTable, setSelectedTable] = React.useState<string>('activeStaff');
    const [searchUser, setSearchUser] = React.useState<string>('');
    const debouncedSearchUser = useDebounce(searchUser, 500);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        dispatch(setSearch(''));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTable]);

    useEffect(() => {
        const getSearchUser = async () => {
            dispatch(setSearch(debouncedSearchUser));
        };

        getSearchUser();
    }, [debouncedSearchUser]);

    return (
        <React.Fragment>
            <Title
                level={2}
                style={{
                    marginBottom: '0px',
                }}
            >
                <IntlMessage id={'staff.title.name'} />
            </Title>

            <Card style={{ marginTop: '16px' }}>
                <Row justify="space-between">
                    <Col xs={10}>
                        <Radio.Group
                            defaultValue="activeStaff"
                            value={selectedTable}
                            onChange={(evt) => {
                                setSelectedTable(evt.target.value);
                            }}
                        >
                            <Radio.Button value="activeStaff">
                                <IntlMessage id={'current'} />
                            </Radio.Button>

                            <Radio.Button value="archivedStaff">
                                <IntlMessage id={'staff.dismissed'} />
                            </Radio.Button>
                        </Radio.Group>
                    </Col>

                    <Col>
                        <Row gutter={16}>
                            {/*<Col>*/}
                            {/*    <Button*/}
                            {/*        onClick={() => {*/}
                            {/*            navigate(`${APP_PREFIX_PATH}/management/staff/integration`);*/}
                            {/*        }}*/}
                            {/*    >*/}
                            {/*        <IntlMessage id={'button.title.staff'} />*/}
                            {/*    </Button>*/}
                            {/*</Col>*/}
                            <Col>
                                <Search
                                    placeholder="Поиск..."
                                    style={{
                                        width: '300px',
                                        marginRight: '20px',
                                        marginBottom: '10px',
                                    }}
                                    onChange={(e) => {
                                        setSearchUser(e.target.value);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {selectedTable === 'activeStaff' ? <ActiveStaff /> : <ArchiveTable />}
            </Card>
        </React.Fragment>
    );
};

export default Staff;

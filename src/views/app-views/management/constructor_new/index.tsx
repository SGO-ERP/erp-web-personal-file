import React, { useEffect, useState } from 'react';

import { Button, Card, Col, Input, Radio, RadioChangeEvent, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { resetConstructor } from 'store/slices/candidates/ordersConstructorSlice';
import { resetSlice } from 'store/slices/newConstructorSlices/constructorNewSlice';

import IntlMessage from 'components/util-components/IntlMessage';

import ActiveTable from './tables/ActiveTable';
import ArchiveTable from './tables/ArchiveTable';
import DraftTable from './tables/DraftTable';

const { Search } = Input;

enum TableType {
    active = 'active',
    archive = 'archive',
    draft = 'draft',
}

const Index = () => {
    const [table, setTable] = useState<TableType>(TableType.active);
    const [searchValue, setSearchValue] = useState<string>('');

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(resetConstructor());
    }, [dispatch]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    const addNewOrder = () => {
        navigate(`${APP_PREFIX_PATH}/management/letters/constructor/add-order-template`);

        dispatch(resetSlice());
    };

    const renderTable = () => {
        if (table === TableType.active) {
            return <ActiveTable searchValue={searchValue} />;
        } else if (table === TableType.archive) {
            return <ArchiveTable searchValue={searchValue} />;
        } else {
            return <DraftTable searchValue={searchValue} />;
        }
    };

    return (
        <Card>
            <Row justify="space-between">
                <Col>
                    <Radio.Group
                        defaultValue={TableType.active}
                        value={table}
                        onChange={(e: RadioChangeEvent) => {
                            setTable(e.target.value);
                        }}
                        style={{ marginTop: '10px', marginBottom: '10px' }}
                    >
                        <Radio.Button value={TableType.active}>
                            <IntlMessage id="candidates.radiobutton.active" />
                        </Radio.Button>
                        <Radio.Button value={TableType.archive}>
                            <IntlMessage id="archive" />
                        </Radio.Button>
                        <Radio.Button value={TableType.draft}>
                            <IntlMessage id="constructor.draft" />
                        </Radio.Button>
                    </Radio.Group>
                </Col>
                <Col style={{ alignItems: 'center', display: 'flex' }}>
                    <Search
                        placeholder={t('Search')}
                        onSearch={handleSearch}
                        style={{ width: '265px', marginRight: '20px' }}
                    />
                    <Button type="primary" onClick={addNewOrder}>
                        <IntlMessage id="Button.add" />
                    </Button>
                </Col>
            </Row>
            {renderTable()}
        </Card>
    );
};

export default Index;

import React from 'react';

import { Table } from 'antd';

import { components } from 'API/types';

const { useState } = React;

const defaultPageSize = 10;
const pageSizeOptions = ['10', '20', '50', '100'];
const showSizeChanger = true;

interface ITableWithPagination {
    columns: Array<any>;
    dataSource: Array<components['schemas']['SurveyRead']>;
    isLoading: boolean;
    total: number;
}

export const TableWithPagination = ({
    columns,
    dataSource,
    isLoading,
    total,
}: ITableWithPagination) => {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            pagination={{
                current,
                defaultPageSize,
                pageSize,
                pageSizeOptions,
                showSizeChanger,
                total,
                onChange: (page: number) => {
                    setCurrent(page);

                    // TODO: send request to update data source
                },
                onShowSizeChange: (current: number, size: number) => {
                    setCurrent(current);
                    setPageSize(size);

                    // TODO: send request to update data source
                },
            }}
            rowKey="id"
        />
    );
};

// components/shared-components/AntTablePagination.js

import { Table } from 'antd';
import { useCallback, useEffect, useState } from 'react';
// TableWithPagination component is a wrapper around Ant Design's Table component.
// It handles pagination and provides a fetchData callback function for custom data fetching.
const TableWithPagination = ({
    isLoading,
    dataSource,
    columns,
    fetchData,
    saveCurrentPage,
    initialPage = 1,
    initialPageSize = 5,
    hasMore = true,
    pagination,
}) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [currentPageSize, setCurrentPageSize] = useState(initialPageSize);
    const [hasNextPage, setHasNextPage] = useState(hasMore);

    useEffect(() => {
        setHasNextPage(hasMore);
    }, [hasMore]);

    useEffect(() => {
        setCurrentPage(initialPage);
        setCurrentPageSize(initialPageSize);
    }, [initialPage, initialPageSize]);

    // Handle pagination change by updating the current page and page size.
    // Then, fetch data using the provided fetchData function.
    const handlePaginationChange = useCallback(
        (page, pageSize) => {
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            fetchData({ page, limit: pageSize }).then((result) => {
                const hasMore = result.payload.hasMore;
                setHasNextPage(hasMore);
            });
            saveCurrentPage(page, pageSize);
        },
        [fetchData],
    );

    // Render the Table component with the necessary props for pagination and loading state.

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            pagination={
                pagination
                    ? false
                    : {
                          current: currentPage,
                          total: hasNextPage
                              ? currentPage * currentPageSize + 1
                              : currentPage * currentPageSize,
                          defaultPageSize: initialPageSize,
                          showSizeChanger: true,
                          pageSize: currentPageSize,
                          pageSizeOptions: ['5', '10', '20', '30'],
                          onChange: handlePaginationChange,
                          onShowSizeChange: handlePaginationChange,
                      }
            }
            rowKey="id"
            loading={isLoading}
            showSorterTooltip={false}
        />
    );
};

export default TableWithPagination;

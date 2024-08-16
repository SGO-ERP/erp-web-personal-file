import { Button, Checkbox, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { setTablePage, setTableSize } from "store/slices/admin-page/adminPositionSlice";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { nameSorter, tablePositionDelete } from "../utils/TableFunctions";

interface Props {
    setRecord: (record: RecordTypes) => void;
    record: any;
}

interface MaxRank {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    nameKZ: string;
    rank_order: number;
    military_url: string;
    employee_url: string;
}

interface RecordTypes {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    nameKZ: string;
    category_code: string;
    form: string;
    max_rank_id: string;
    position_order: number;
    max_rank: MaxRank;
}

const PositionTable = ({ setRecord, record }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);
    const [badgeSource, setBadgeSource] = useState<any>([]);

    const { position_types, tablePagination } = useAppSelector((state) => state.adminPositions);
    const { tableSearch } = useAppSelector((state) => state.adminPage);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setLoading(position_types.loading);
    }, [position_types.loading]);

    useEffect(() => {
        setCurrentPage(tablePagination.page);
        setCurrentPageSize(tablePagination.size);
    }, [tablePagination]);

    useEffect(() => {
        const filteredData =
            tableSearch.trim() === ""
                ? position_types.data.objects
                : position_types.data.objects.filter(
                      (e: any) =>
                          (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                          (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase())),
                  );

        setBadgeSource(filteredData);
        setTotal(filteredData.length);
    }, [position_types.data, tableSearch]);

    const onCheck = (record: any, e: boolean) => {
        setRecord(e ? record : "");
    };

    const columns = [
        {
            title: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox disabled />
                </div>
            ),
            dataIndex: "checkbox",
            key: "checkbox",
            render: (text: string, rec: any) => (
                <>
                    <div>
                        <Checkbox
                            className="single-checkboxs"
                            onChange={(e) => onCheck(rec, e.target.checked)}
                            checked={rec.id === record.id}
                        />
                    </div>
                </>
            ),
        },
        {
            title: <IntlMessage id={"admin.page.table.column.first"} />,
            dataIndex: "nameKZ",
            key: "nameKZ",
            sorter: (a: RecordTypes, b: RecordTypes) => nameSorter(a, b, "nameKZ"),
        },
        {
            title: <IntlMessage id={"admin.page.table.column.second"} />,
            dataIndex: "name",
            key: "name",
            sorter: (a: RecordTypes, b: RecordTypes) => nameSorter(a, b, "name"),
        },
        {
            title: <IntlMessage id={"letters.historytable.actions"} />,
            dataIndex: "actions",
            key: "actions",
            render: (_: string, record: RecordTypes) => (
                <Row>
                    <Button
                        type={"link"}
                        danger
                        onClick={() => {
                            if (record.id) {
                                tablePositionDelete(record.id);
                            }
                        }}
                        disabled={true}
                    >
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                </Row>
            ),
        },
    ];

    if (loading) {
        return <Spin spinning={true} style={{ width: "100%" }} />;
    }

    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={badgeSource}
                loading={loading}
                pagination={{
                    current: currentPage,
                    defaultPageSize: 10,
                    pageSize: currentPageSize,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showSizeChanger: true,
                    total: total,
                    onChange: (page: number) => {
                        dispatch(setTablePage(page));
                    },
                    onShowSizeChange: (currentAbsent: number, size: number) => {
                        dispatch(setTableSize(size));
                        dispatch(setTablePage(currentAbsent));
                    },
                }}
                rowKey="id"
            />
        </React.Fragment>
    );
};

export default PositionTable;

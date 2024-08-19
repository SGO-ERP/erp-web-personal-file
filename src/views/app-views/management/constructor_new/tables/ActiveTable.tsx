import React, { ReactNode, useEffect, useState } from "react";

import { Button, Divider, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useNavigate } from "react-router-dom";

import { resetSlice } from "store/slices/newConstructorSlices/constructorNewSlice";

import { orderPerson } from "../steps/CreateOrderKZ";

import IntlMessage from "components/util-components/IntlMessage";
import utils from "utils";

import { getTableData, setPage, setSize } from "store/slices/newConstructorSlices/activeTable";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import { archive, duplicate } from "./utils/tableFunctions";
import { RowItemType } from "./utils/interfaces";

type ActiveTableProps = {
    searchValue: string;
}

const ActiveTable: React.FC<ActiveTableProps> = ({
    searchValue
}) => {
    const [dataSource, setDataSource] = useState<RowItemType[]>([]);
    const [showSizeChanger] = useState(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { page, size, search, tableValue, total, defaultPageSize, tableLoading } = useAppSelector(
        (state) => state.activeTable,
    );

    useEffect(() => {
        updateTable();
    }, [size, page, search]);

    const updateTable = () => {
        const skip = size * (page - 1);

        dispatch(getTableData({ size, skip, search }));
    };

    useEffect(() => {
        setDataSource(tableValue);
    }, [tableValue]);

    const activeColumns = [
        {
            title: localStorage.getItem("lan") === "kk" ? "Аты" : "Название",
            dataIndex: localStorage.getItem("lan") === "kk" ? "nameKZ" : "name",
            width: "30%",
            sorter: (a: Record<string, string>, b: Record<string, string>) => {
                return localStorage.getItem("lan") === "kk"
                    ? a.nameKZ.localeCompare(b.nameKZ)
                    : a.name.localeCompare(b.name);
            },
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Субъект",
            dataIndex: "subject_type",
            width: "15%",
            sorter: (a: Record<string, string | number>, b: Record<string, string | number>) =>
                utils.antdTableSorter(a, b, "subject_type"),
            render: (record: number): ReactNode => {
                const type = orderPerson.filter((item) => item.value === record);
                const { name, nameKZ } = type?.[0].label;
                const subject_type = localStorage.getItem("lan") !== "kk" ? name : nameKZ;
                return <div>{subject_type || <IntlMessage id="activeTable.empty" />}</div>;
            },
        },
        {
            title: localStorage.getItem("lan") === "kk" ? "Сипаттама" : "Описание",
            dataIndex: "description",
            width: "20%",
            render: (record: Record<string, string>): ReactNode => {
                return localStorage.getItem("lan") !== "kk" ? (
                    <div>{record?.name ? record.name : <IntlMessage id="activeTable.empty" />}</div>
                ) : (
                    <div>
                        {record.nameKZ ? record.nameKZ : <IntlMessage id="activeTable.empty" />}
                    </div>
                );
            },
        },
        {
            title: localStorage.getItem("lan") === "kk" ? "Әрекеттер" : "Действия",
            width: "20%",
            render: (row: RowItemType): ReactNode => (
                <Space size="middle">
                    <Button
                        disabled={
                            row.name === "Приказ о зачислении на службу сотрудника" ||
                            row.name === "Приказ о назначении на должность"
                        }
                        onClick={() => {
                            navigate(`/management/letters/constructor/edit/${row.id}`);

                            dispatch(resetSlice());
                        }}
                        style={
                            row.name !== "Приказ о зачислении на службу сотрудника" &&
                            row.name !== "Приказ о назначении на должность"
                                ? {
                                      color: "#3e79f7",
                                  }
                                : { color: "#d0d4d7" }
                        }
                        type="text"
                    >
                        <IntlMessage id="personal.button.edit" />
                    </Button>
                    <Divider type="vertical" style={{ background: "grey" }} />{" "}
                    <Button danger type="text" onClick={() => archive(false, row, updateTable)}>
                        <IntlMessage id="surveys.surveys.table.body.row.actions.archive" />
                    </Button>
                    <Divider type="vertical" style={{ background: "grey" }} />{" "}
                    <Button
                        type="text"
                        style={{
                            color: "#3e79f7",
                        }}
                        onClick={() => duplicate(row.id, updateTable)}
                    >
                        <IntlMessage id="activeTable.duplicate" />
                    </Button>
                </Space>
            ),
        },
    ] as ColumnsType<RowItemType>;

    return (
        <Table
            columns={activeColumns}
            dataSource={dataSource}
            loading={tableLoading}
            pagination={{
                current: page,
                defaultPageSize: defaultPageSize,
                pageSize: size,
                pageSizeOptions: ["5", "10", "20", "30"],
                showSizeChanger: showSizeChanger,
                total: total,
                onChange: (page: number, size: number) => {
                    dispatch(setPage(page));
                    dispatch(setSize(size));
                },
                onShowSizeChange: (current: number, size: number) => {
                    dispatch(setPage(current));
                    dispatch(setSize(size));
                },
            }}
            rowKey="id"
        />
    );
};
export default ActiveTable;

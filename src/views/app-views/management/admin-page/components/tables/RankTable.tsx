import { Button, Checkbox, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import FileUploaderService from "../../../../../../services/myInfo/FileUploaderService";
import {
    setLoadingModal,
    setSelectedRank,
    setTablePage,
    setTableSize,
} from "../../../../../../store/slices/admin-page/adminRanksSlice";
import { nameSorter, tableRankDelete } from "../utils/TableFunctions";
import { ColumnType } from "antd/es/table";

interface Props {
    setRecord: (record: RankData) => void;
    record: any;
}

interface RankData {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    nameKZ: string;
    rank_order: number;
    military_url: string | null;
    employee_url: string | null;
}

const RankTable = ({ setRecord, record }: Props) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);

    const { rank_types, tablePagination } = useAppSelector((state) => state.adminRanks);
    const { tableSearch } = useAppSelector((state) => state.adminPage);

    const filteredData = (tableSearch.trim() === ""
        ? rank_types.data.objects
        : rank_types.data.objects.filter(
            (e: any) =>
                (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase()))
        )) as RankData[];


    const total = filteredData.length;

    const dispatch = useAppDispatch();

    useEffect(() => {
        setCurrentPage(tablePagination.page);
        setCurrentPageSize(tablePagination.size);
    }, [tablePagination]);

    const onCheck = async (record: any, e: boolean) => {
        setRecord(e ? record : "");

        console.log(record);

        if (!e) return;

        const data = {
            name: record.name ?? "",
            nameKZ: record.nameKZ ?? "",
        };

        dispatch(setLoadingModal(true));
        try {
            const url = await FileUploaderService.getFileByLink(
                record.employee_url ? record.employee_url : record.military_url,
            );
            const newData = { ...data, url: [url] };
            dispatch(setSelectedRank(newData));
        } catch (error) {
            dispatch(setSelectedRank(data));
        }
        dispatch(setLoadingModal(false));
    };

    const columns: ColumnType<RankData>[] = [
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
            sorter: (a: RankData, b: RankData) => nameSorter(a, b, "nameKZ"),
        },
        {
            title: <IntlMessage id={"admin.page.table.column.second"} />,
            dataIndex: "name",
            key: "name",
            sorter: (a: RankData, b: RankData) => nameSorter(a, b, "nameKZ"),
        },
        {
            title: <IntlMessage id={"letters.historytable.actions"} />,
            dataIndex: "actions",
            key: "actions",
            //TODO:Добавить типизацию
            render: (_: string, record: any) => (
                <Row>
                    <Button
                        type={"link"}
                        danger
                        onClick={() => {
                            if (record.id) {
                                tableRankDelete(record.id);
                            }
                        }}
                    >
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                </Row>
            ),
        },
    ];

    if (rank_types.loading) {
        return <Spin spinning={true} style={{ width: "100%" }} />;
    }
    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={rank_types.loading}
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

export default RankTable;

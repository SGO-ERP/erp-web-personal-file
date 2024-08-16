import { Button, Checkbox, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { setTablePage, setTableSize } from "store/slices/admin-page/adminSpecialtiesSlice";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { nameSorter, tableSpecialtiesDelete } from "../utils/TableFunctions";

interface Props {
    setRecord: (record: any) => void;
    record: any;
}

const SpecialtiesTables = ({ setRecord, record }: Props) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);

    const { specialty_types, tablePagination } = useAppSelector((state) => state.adminSpecialties);
    const { tableSearch } = useAppSelector((state) => state.adminPage);

    const filteredData =
        tableSearch.trim() === ""
            ? specialty_types.data.objects
            : specialty_types.data.objects.filter(
                  (e: any) =>
                      (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                      (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase())),
              );
    const total = filteredData.length;

    const dispatch = useAppDispatch();

    useEffect(() => {
        setCurrentPage(tablePagination.page);
        setCurrentPageSize(tablePagination.size);
    }, [tablePagination]);

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
            sorter: (a: any, b: any) => nameSorter(a, b, "nameKZ"),
        },
        {
            title: <IntlMessage id={"admin.page.table.column.second"} />,
            dataIndex: "name",
            key: "name",
            sorter: (a: any, b: any) => nameSorter(a, b, "name"),
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
                                tableSpecialtiesDelete(record.id);
                            }
                        }}
                    >
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                </Row>
            ),
        },
    ];

    if (specialty_types.loading) {
        return <Spin spinning={true} style={{ width: "100%" }} />;
    }
    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={specialty_types.loading}
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

export default SpecialtiesTables;

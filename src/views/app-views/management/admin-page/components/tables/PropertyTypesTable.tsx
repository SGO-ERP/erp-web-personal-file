import { Button, Checkbox, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
    getPropertyTypes,
    setTablePage,
    setTableSize,
} from "store/slices/admin-page/adminPropertySlice";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { nameSorter, tablePropertyDelete } from "../utils/TableFunctions";

interface Props {
    setRecord: (record: any) => void;
    record: any;
}

const PropertyTypesTable = ({ setRecord, record }: Props) => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);

    const propertyTypesDataObjects = useAppSelector(
        (state) => state.adminProperties.property_types.data.objects,
    );
    const propertyTypesLoading = useAppSelector(
        (state) => state.adminProperties.property_types.loading,
    );
    const tablePagination = useAppSelector((state) => state.adminProperties.tablePagination);
    const tableSearch = useAppSelector((state) => state.adminPage.tableSearch);

    const badgeSource =
        tableSearch.trim() === ""
            ? propertyTypesDataObjects
            : propertyTypesDataObjects.filter(
                  (e: any) =>
                      (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                      (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase())),
              );
    const total = badgeSource.length;

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getPropertyTypes());
    }, []);

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
                                tablePropertyDelete(record.id);
                            }
                        }}
                    >
                        <IntlMessage id={"initiate.deleteAll"} />
                    </Button>
                </Row>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={propertyTypesDataObjects}
                loading={propertyTypesLoading}
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

export default PropertyTypesTable;

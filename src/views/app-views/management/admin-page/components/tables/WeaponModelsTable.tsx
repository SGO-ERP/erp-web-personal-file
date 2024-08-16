import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/useStore";
import { Button, Checkbox, Row, Spin, Table } from "antd";
import IntlMessage from "../../../../../../components/util-components/IntlMessage";
import { setTablePage, setTableSize } from "store/slices/admin-page/adminWeaponModelsSlice";
import { nameSorter, tableWeaponModelDelete } from "../utils/TableFunctions";

interface Props {
    setRecord: (record: any) => void;
    record: any;
}

const WeaponModelsTable = ({ setRecord, record }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);
    const [badgeSource, setBadgeSource] = useState<any>([]);

    const { weapon_models, tablePagination } = useAppSelector((state) => state.adminWeaponModels);
    const { tableSearch } = useAppSelector((state) => state.adminPage);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setLoading(weapon_models.loading);
    }, [weapon_models.loading]);

    useEffect(() => {
        setCurrentPage(tablePagination.page);
        setCurrentPageSize(tablePagination.size);
    }, [tablePagination]);

    useEffect(() => {
        if (!weapon_models.data) return;

        const filteredData =
            tableSearch.trim() === ""
                ? weapon_models.data
                : weapon_models.data.filter(
                      (e: any) =>
                          (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                          (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase())),
                  );

        setBadgeSource(filteredData);
        setTotal(filteredData.length);
    }, [weapon_models.data, tableSearch]);

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
                                tableWeaponModelDelete(record.id);
                            }
                        }}
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

export default WeaponModelsTable;

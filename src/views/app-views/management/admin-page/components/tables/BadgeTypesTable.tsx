import { Button, Checkbox, Row, Spin, Table } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";
import { useAppDispatch, useAppSelector } from "hooks/useStore";
import React, { useEffect, useState } from "react";
import FileUploaderService from "services/myInfo/FileUploaderService";
import {
    setModalBadge,
    setSelectedBadge,
    setTablePage,
    setTableSize,
} from "store/slices/admin-page/adminBadgeSlice";
import { nameSorter, tableBadgeDelete } from "../utils/TableFunctions";

interface Props {
    setRecord: (record: any) => void;
    record: any;
}

const namesBadgeOrders = {
    defaultMedal: { name: "Медали", nameKZ: "Медальдар" },
    stateMedal: { name: "Государственная награда", nameKZ: "Мемлекеттік награда" },
    otherMedal: { name: "Другие награды", nameKZ: "Басқа марапаттар" },
};

interface RecordTypes {
    name: string | null;
    nameKZ: string | null;
    url: string[];
    badge_order: keyof BadgeOrderMapTypes;
    created_at: string;
    id: string;
    updated_at: string;
}

const BadgeTypesTable = ({ setRecord, record }: Props) => {
    const { badge_types, tablePagination } = useAppSelector((state) => state.adminBadge);
    const { tableSearch } = useAppSelector((state) => state.adminPage);

    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [currentPageSize, setCurrentPageSize] = useState<number>(0);
    const [badgeSource, setBadgeSource] = useState<any>([]);

    useEffect(() => {
        setLoading(badge_types.loading);
    }, [badge_types.loading]);

    useEffect(() => {
        setCurrentPage(tablePagination.page);
        setCurrentPageSize(tablePagination.size);
    }, [tablePagination]);

    useEffect(() => {
        const filteredData =
            tableSearch.trim() === ""
                ? badge_types.data.objects
                : badge_types.data.objects.filter(
                      (e: any) =>
                          (e.name && e.name.toLowerCase().includes(tableSearch.toLowerCase())) ||
                          (e.nameKZ && e.nameKZ.toLowerCase().includes(tableSearch.toLowerCase())),
                  );

        setBadgeSource(filteredData);
        setTotal(filteredData.length);
    }, [badge_types.data, tableSearch]);

    const dispatch = useAppDispatch();

    const onCheck = async (record: RecordTypes, e: boolean) => {
        setRecord(e ? record : "");

        if (!e) return;

        const data = {
            name: record?.name ?? "",
            nameKZ: record?.nameKZ ?? "",
            badge_order: record.badge_order,
            fileUrl: record.url,
        };

        dispatch(setModalBadge(true));

        try {
            const url = await FileUploaderService.getFileByLink(record.url);
            const newData = { ...data, url: [url] };
            dispatch(setSelectedBadge(newData));
        } catch (error) {
            const newData = { ...data, url: [] };
            dispatch(setSelectedBadge(newData));
        } finally {
            dispatch(setModalBadge(false));
        }
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
            title: <IntlMessage id={"awards.order"} />,
            dataIndex: "badgeOrder",
            key: "badgeOrder",
            filters: [
                { text: LocalText.getName(namesBadgeOrders.stateMedal), value: 2 },
                { text: LocalText.getName(namesBadgeOrders.defaultMedal), value: 1 },
                { text: LocalText.getName(namesBadgeOrders.otherMedal), value: 0 },
            ],
            onFilter: (value: string, record: any) => {
                console.log(value);
                const newTotal =
                    badgeSource.filter((item: any) => item.badge_order === value).length ?? 0;

                console.log("newTotal: ", newTotal);

                setTotal(newTotal);

                return record.badge_order === value;
            },
            render: (text: string, rec: any) => {
                if (rec.badge_order === 2) {
                    return LocalText.getName(namesBadgeOrders.stateMedal);
                } else if (rec.badge_order === 1) {
                    return LocalText.getName(namesBadgeOrders.defaultMedal);
                } else {
                    return LocalText.getName(namesBadgeOrders.otherMedal);
                }
            },
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
                                tableBadgeDelete(record.id);
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

export default BadgeTypesTable;

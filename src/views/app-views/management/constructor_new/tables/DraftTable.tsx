import React, { FC, useEffect, useState } from "react";

import { Button, Divider, notification, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { resetSlice } from "store/slices/newConstructorSlices/constructorNewSlice";
import { orderPerson } from "../steps/CreateOrderKZ";

import IntlMessage from "components/util-components/IntlMessage";
import HrDocumentTemplatesService from "services/HrDocumentTemplatesService";
import utils from "utils";
import { LocalText } from "components/util-components/LocalizationText/LocalizationText";

const DraftTable: FC<{ searchValue: string }> = ({ searchValue }) => {
    const [current, setCurrent] = useState(1);
    const [dataSource, setDataSource] = useState<[]>();
    const [defaultPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [showSizeChanger] = useState(true);
    const [total, setTotal] = useState<number>();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);

        HrDocumentTemplatesService.get_hr_doc_templates_draft_with_pagination(
            current,
            pageSize,
            searchValue,
        )
            .then((res) => {
                setTotal(res?.data ? res.data.total : 0);
                setDataSource(res?.data ? res.data.objects : []);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [current, pageSize, searchValue]);

    const dublicate = async (id: string) => {
        HrDocumentTemplatesService.hr_template_dublicate(id);

        // update dataSource (add copy of duplicated template)

        notification.success({
            message:
                localStorage.getItem("lan") === "kk"
                    ? "Бұйрықтың телнұсқасы құрылды"
                    : "Дубликат приказа создан",
        });
    };

    const columns = [
        {
            title: localStorage.getItem("lan") === "kk" ? "Аты" : "Название",
            dataIndex: localStorage.getItem("lan") === "kk" ? "nameKZ" : "name",
            width: "30%",
            sorter: (a, b) => {
                const itemName = localStorage.getItem("lan") === "kk" ? a.nameKZ : a.name;
                const itemBName = localStorage.getItem("lan") === "kk" ? b.nameKZ : b.name;

                if (!itemName || !itemBName) {
                    return <IntlMessage id="activeTable.empty" />;
                }

                return itemName.localeCompare(itemBName);
            },
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Субъект",
            dataIndex: "subject_type",
            width: "15%",
            sorter: (a, b) => utils.antdTableSorter(a, b, "subject_type"),
            render: (record) => {
                const type = LocalText.getName(
                    orderPerson.find((item) => item.value === record)?.label,
                );
                return <div>{type || <IntlMessage id="activeTable.empty" />}</div>;
            },
        },
        {
            title: localStorage.getItem("lan") === "kk" ? "Сипаттама" : "Описание",
            dataIndex: "description",
            width: "20%",
            render: (record) => {
                return localStorage.getItem("lan") !== "kk" ? (
                    <div>{record.name ? record.name : <IntlMessage id="activeTable.empty" />}</div>
                ) : (
                    <div>
                        {" "}
                        {record.nameKZ ? record.nameKZ : <IntlMessage id="activeTable.empty" />}
                    </div>
                );
            },
        },
        {
            title: localStorage.getItem("lan") === "kk" ? "Әрекеттер" : "Действия",
            width: "20%",
            render: (row) => (
                <Space size="middle">
                    <Button
                        disabled={
                            row.name === "Приказ о зачислении на службу сотрудника" ||
                            row.name === "Приказ о назначении на должность"
                        }
                        onClick={() => {
                            navigate(`/management/letters/constructor/draft/${row.id}`);

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
                        <IntlMessage id="personal.button.continue" />
                    </Button>
                    <Divider type="vertical" style={{ background: "grey" }} />{" "}
                    <Button
                        type="text"
                        style={{
                            color: "#3e79f7",
                        }}
                        onClick={() => dublicate(row.id)}
                    >
                        <IntlMessage id="activeTable.duplicate" />
                    </Button>
                </Space>
            ),
        },
    ] as ColumnsType<Record<string, string>>;

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            pagination={{
                current: current,
                defaultPageSize: defaultPageSize,
                pageSize: pageSize,
                pageSizeOptions: ["5", "10", "20", "30"],
                showSizeChanger: showSizeChanger,
                total: total,
                onChange: (page: number, size: number) => {
                    setCurrent(page);
                    setPageSize(size);
                },
                onShowSizeChange: (current: number, size: number) => {
                    setCurrent(current);
                    setPageSize(size);
                },
            }}
            rowKey="id"
        />
    );
};
export default DraftTable;

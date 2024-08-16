import React, {useEffect, useState} from "react";
import moment from "moment";

import { Avatar, Button, Col, Row, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { RootState } from "store";
import { getArchivedStaff } from "store/slices/doNotTouch/staff";

import IntlMessage from "../../../../../../components/util-components/IntlMessage";

import LocalizationText, { LocalText } from "../../../../../../components/util-components/LocalizationText/LocalizationText";
import { APP_PREFIX_PATH } from "../../../../../../configs/AppConfig";
import AvatarFallback from "components/shared-components/AvatarFallback";
import {components} from "../../../../../../API/types";
import {PrivateServices} from "../../../../../../API";

const { Text } = Typography;

const ArchivedStaff = () => {
    moment.locale("ar");

    const [current, setCurrent] = React.useState<number>(1);
    const [defaultPageSize] = React.useState<number>(10);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [showSizeChanger] = React.useState<boolean>(true);
    const [shouldFetch, setShouldFetch] = React.useState<boolean>(true);
    const [array,setArray] = useState([]);

    const dataSource = useSelector((state: RootState) => state.staff.archivedStaff.users);
    const isLoading = useSelector((state: RootState) => state.staff.isLoading);
    const search = useSelector((state: RootState) => state.staff.search);
    const total = useSelector((state: RootState) => state.staff.archivedStaff.total);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchArchivedStaff = (current: number, pageSize: number) => {
        dispatch(
            getArchivedStaff({
                skip: (current - 1) * pageSize,
                limit: pageSize,
                filter: search,
            }),
        );
    };

    React.useEffect(() => {
        if (shouldFetch) {
            fetchArchivedStaff(current, pageSize);
            setShouldFetch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldFetch, current, pageSize, dispatch]);

    React.useEffect(() => {
        setCurrent(1);
        fetchArchivedStaff(1, pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
    async function getDivisionParents(
        division: components["schemas"]["StaffDivisionRead"],
        data: components["schemas"]["StaffDivisionRead"][],
    ) {
        let updatedParents = [
            ...data,
            {
                id: division.id,
                name: division.name,
                nameKZ: division.nameKZ,
                type: division.type,
                staff_division_number: division.staff_division_number,
            },
        ];
        if (division.children && division.children?.length > 0) {
            updatedParents = await getDivisionParents(division.children[0], updatedParents);
        }
        return updatedParents;
    }

    const seeLastChildren = async (staff_division_id: string) => {
        const response = await PrivateServices.get("/api/v1/staff_division/division_parents/{id}/", {
            params: {
                path: {
                    id: staff_division_id,
                },
            },
        });
        if (response.data) {
            return getDivisionParents(response.data, []);
        }
    };

    const divisions = (record: any) => {
        return (
            <Row justify="end">
                {record?.full_staff_division?.map((division:any) => (
                    <Col
                        xs={24}
                        style={{ display: 'flex', justifyContent: 'flex-start' }}
                    >
                        {
                            division.id !== record.staff_unit?.staff_division.id
                            &&
                            <>
                                <LocalizationText text={division} />
                            </>
                        }
                    </Col>
                ))}
            </Row>
        );
    };



    useEffect(() => {
        if (dataSource.length > 0) {
            setArray([]);
            const fetchData = async () => {
                const promises = dataSource.map(async (item) => {
                    // Дождитесь завершения seeLastChildren перед созданием объекта
                    const division = await seeLastChildren(item.staff_unit?.staff_division_id);
                    return {
                        ...item,
                        full_staff_division: division
                    };
                });
                const newData = await Promise.all(promises);

                setArray((prevState:any) => {
                    const filteredData = newData.filter((newItem) => {
                        return !prevState.some((prevItem:any) => prevItem.id === newItem.id);
                    });
                    return prevState.concat(filteredData);
                });
            };
            fetchData();
        } else {
            setArray([]);
        }
    }, [dataSource]);



    const columns = [
        {
            dataIndex: "last_signed_at",
            key: "last_signed_at",
            title: t("entryDate"),
            render: (_: string, record: Record<string, string>) =>
                record?.last_signed_at ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Text>{moment(record.last_signed_at).format("DD.MM.YYYY HH:mm")}</Text>
                        <Text style={{ color: "#366EF6" }}>
                            {moment(record.last_signed_at).fromNow()}
                        </Text>
                    </div>
                ) : (
                    <div>
                        <Text><IntlMessage id={'entry.not.carried'} /></Text>
                    </div>
                ),
            sorter: (
                a: {
                    last_signed_at: string;
                },
                b: {
                    last_signed_at: string;
                },
            ) => {
                if (a.last_signed_at === null) {
                    return -1;
                } else if (b.last_signed_at === null) {
                    return 1;
                } else {
                    const dateA = new Date(a.last_signed_at);
                    const dateB = new Date(b.last_signed_at);

                    return dateB.getTime() - dateA.getTime();
                }
            },
        },
        {
            dataIndex: ["last_name", "first_name", "father_name"],
            key: "full_name",
            title: t("personal.breadcrumbs.employee"),
            render: (_: string, record: Record<string, string>) => (
                <div className="d-flex">
                    <Row align="middle">
                        <Col>
                            <Avatar size={40} src={record?.icon} icon={<AvatarFallback />}>
                                {`${record.last_name} ${record.first_name}`}
                            </Avatar>
                        </Col>
                        <Col>
                            <Text
                                style={{
                                    marginLeft: "12px",
                                }}
                            >{`${record.last_name} ${record.first_name} ${
                                record?.father_name || ""
                            }`}</Text>
                        </Col>
                    </Row>
                </div>
            ),
            sorter: (
                a: { last_name: string; first_name: string; father_name?: string },
                b: { last_name: string; first_name: string; father_name?: string },
            ) => {
                const nameA = `${a.last_name} ${a.first_name} ${a.father_name || ""}`;
                const nameB = `${b.last_name} ${b.first_name} ${b.father_name || ""}`;

                return nameA.localeCompare(nameB);
            },
        },
        {
            dataIndex: ["staff_unit", "position", "name"],
            key: "position",
            title: t("post"),
            render: (_: string, record: Record<string, Record<string, string>>) => (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Text strong>
                        {LocalText.getName(
                            record.staff_unit?.actual_position
                                ? record.staff_unit?.actual_position
                                : record.staff_unit?.position,
                        )}
                    </Text>
                    <Text>
                        {divisions(record)}
                        {LocalText.getName(record.staff_unit?.staff_division) || (
                            <IntlMessage id={"no.staff_division"} />
                        )}
                    </Text>
                </div>
            ),
            sorter: (
                a: { staff_unit: { position: string; actual_position: string } },
                b: { staff_unit: { position: string; actual_position: string } },
            ) => {
                const positionA = a.staff_unit?.actual_position
                    ? a.staff_unit?.actual_position
                    : a.staff_unit?.position;
                const positionB = b.staff_unit?.actual_position
                    ? b.staff_unit?.actual_position
                    : b.staff_unit?.position;
                const nameA = LocalText.getName(positionA);
                const nameB = LocalText.getName(positionB);

                return nameA.localeCompare(nameB);
            },
        },
        {
            dataIndex: "id",
            key: "id",
            title: t("letters.historytable.actions"),
            render: (_: string, record: { id: string }) => (
                <NavLink to={`${APP_PREFIX_PATH}/duty/data/${record.id}`} state={{ name: "staff" }}>
                    <Button
                        type="text"
                        style={{
                            color: "#3e79f7",
                        }}
                    >
                        <IntlMessage id={"personalBusiness"} />
                    </Button>
                </NavLink>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Table
                columns={columns}
                dataSource={array}
                loading={isLoading}
                pagination={{
                    current: current,
                    defaultPageSize: defaultPageSize,
                    pageSize: pageSize,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    showSizeChanger: showSizeChanger,
                    total: total,
                    onChange: (page: number, size: number) => {
                        setCurrent(page);
                        setPageSize(size);
                        setShouldFetch(true);
                    },
                    onShowSizeChange: (current: number, size: number) => {
                        setCurrent(current);
                        setPageSize(size);
                        setShouldFetch(true);
                    },
                }}
                rowKey="id"
            />
        </React.Fragment>
    );
};

export default ArchivedStaff;

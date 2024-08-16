import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Select, Typography } from "antd";
import { setTableSearch } from "store/slices/admin-page/adminPageSlice";
import { useAppDispatch } from "hooks/useStore";
import IntlMessage from "components/util-components/IntlMessage";

import ModalCombine from "./modals/ModalCombine";
import ModalCorrection from "./modals/ModalCorrection";
import ModalAdd from "./modals/ModalAdd";
import ModalEdit from "./modals/ModalEdit";

import { handleSelect, info, renderTableComponent } from "./utils/TableSelectFunctions";

const { Text } = Typography;

const ActualCard = () => {
    const [choose, setChoose] = useState<string>("");
    const [record, setRecord] = useState<any>("");

    const [open, setOpen] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [openCombine, setOpenCombine] = useState<boolean>(false);
    const [openCorrection, setOpenCorrection] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const currentLocale = localStorage.getItem("lan");

    useEffect(() => {
        dispatch(setTableSearch(""));
    }, [choose]);

    return (
        <React.Fragment>
            <ModalAdd
                onClose={() => setOpen(false)}
                isOpen={open}
                choose={info.find((i) => i.id === choose)?.name || ""}
            />

            <ModalEdit
                onClose={() => setOpenEdit(false)}
                isOpen={openEdit}
                choose={info.find((i) => i.id === choose)?.name || ""}
                record={record}
                setRecord={setRecord}
            />

            <ModalCombine
                onClose={() => setOpenCombine(false)}
                isOpen={openCombine}
                choose={info.find((i) => i.id === choose)?.name || ""}
                record={record}
                setRecord={setRecord}
            />

            <ModalCorrection
                onClose={() => setOpenCorrection(false)}
                isOpen={openCorrection}
                choose={info.find((i) => i.id === choose)?.name || ""}
                record={record}
                setRecord={setRecord}
            />

            <Card style={{ marginTop: "16px" }}>
                <Row justify="space-between">
                    <Col xs={12}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24}>
                                <Text>
                                    <IntlMessage id={"admin.panel.name.all"} />
                                </Text>
                            </Col>
                            <Col xs={24}>
                                <Select
                                    style={{ width: "400px" }}
                                    options={info.map((item) => ({
                                        value: item.id,
                                        label: currentLocale === "kk" ? item.nameKZ : item.name,
                                    }))}
                                    onChange={(e: string) => handleSelect(e, setChoose, dispatch)}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    showSearch
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12}>
                        <Row align="middle" justify="end">
                            <Col>
                                <Button onClick={() => setOpenEdit(true)} disabled={record === ""}>
                                    <IntlMessage id={"staffSchedule.edit"} />
                                </Button>
                            </Col>
                            <Col style={{ marginLeft: 10 }}>
                                <Button
                                    onClick={() => setOpenCorrection(true)}
                                    disabled={record === ""}
                                >
                                    <IntlMessage id={"admin.page.button.adjustment"} />
                                </Button>
                            </Col>
                            <Col style={{ marginLeft: 10 }}>
                                <Button
                                    onClick={() => setOpenCombine(true)}
                                    disabled={record === ""}
                                >
                                    <IntlMessage id={"admin.page.button.join"} />
                                </Button>
                            </Col>
                            <Col style={{ marginLeft: 10 }}>
                                <Button
                                    type={"primary"}
                                    onClick={() => setOpen(true)}
                                    disabled={choose === ""}
                                >
                                    <IntlMessage id={"Button.add"} />
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <div className={"mt-3"}>{renderTableComponent(setRecord, record, choose)}</div>
            </Card>
        </React.Fragment>
    );
};

export default ActualCard;

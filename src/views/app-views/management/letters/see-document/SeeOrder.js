import { VerticalAlignBottomOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Row, Space } from "antd";
import saveAs from "file-saver";
import React, { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Link, useLocation } from "react-router-dom";
import HrDocumentsService from "../../../../../services/HrDocumentsService";
import HrDocumentService from "../../../../../services/HrDocumentsService";
import EditorComponent from "../../candidates/list/stage/EditorComponent";
import "./editor.css";
import IntlMessage from "components/util-components/IntlMessage";

const SeeOrder = () => {
    const location = useLocation();
    const { state } = location;
    const [value, setValue] = useState("");

    console.log("state: ", state);

    useEffect(() => {
        async function handleDownloadTemplate() {
            const file = await HrDocumentService.getGeneratedHTMLDocument(state.id);
            file.text().then((result) => {
                setTemplate(result);
            });
        }

        void handleDownloadTemplate();
    }, [setTemplate, state.id]);

    function capitalizeFirstLetter(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    function setTemplate(templateValue) {
        templateValue = replaceAutoProperties(templateValue);
        templateValue = templateValue.replaceAll("<ins", "<u");
        templateValue = templateValue.replaceAll("ins>", "u>");

        const capitalArray = ["name", "father_name", "surname"];
        const properties = state.document_template.properties;
        for (let item in properties) {
            capitalArray.forEach((e) => {
                if (properties[item].field_name === e) {
                    const regex = new RegExp(state.properties[item].nameKZ, "g");
                    templateValue = templateValue.replace(
                        regex,
                        capitalizeFirstLetter(state.properties[item].nameKZ),
                    );
                }
            });
        }

        // console.log("templateValue: ", templateValue);

        setValue(templateValue);
    }

    async function exportDoc() {
        const pdfData = await HrDocumentsService.getGenerateDocument(state.id);
        const pdfFile = new File([pdfData], `${state?.document_template.nameKZ}.pdf`);
        saveAs(pdfFile);
    }

    function replaceAutoProperties(resultValue) {
        return resultValue;
    }

    return state.status.name === "Завершен" ? (
        <div>
            <div>
                <Row>
                    <Col xs={4} style={{ display: "flex", alignItems: "center" }}>
                        <h4 style={{ margin: "0" }}>
                            <b>
                                <IntlMessage id={"seeOrder.see.order"} />
                            </b>
                        </h4>
                    </Col>
                    <Col xs={12} style={{ display: "flex", alignItems: "center" }}>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link href="/management/letters">
                                    <IntlMessage id={"sidenav.management.lettersAndOrders"} />
                                </Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link href="">
                                    <IntlMessage id={"seeOrder.look.order"} />
                                </Link>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                    <Col xs={8}>
                        <Space align="center">
                            <Button type="primary">
                                <Link
                                    to={`/management/letters/document/report/${state?.id}`}
                                ></Link>
                                <IntlMessage id={"letters.viewDocument"} />
                            </Button>
                            <Button onClick={exportDoc} disabled={state.status.name !== "Завершен"}>
                                <VerticalAlignBottomOutlined />
                                <IntlMessage id={"personal.button.download"} />
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </div>
            <div
                style={{
                    width: "210mm",
                    height: "297mm",
                    display: "table",
                    margin: "20px auto 0 auto",
                }}
                className="document-a4"
            >
                <Card>
                    <EditorComponent
                        disabled={true}
                        waterMarkerText={""}
                        value={value}
                        setValue={setValue}
                        style={{ maxWidth: "100%" }}
                    />
                </Card>
            </div>
        </div>
    ) : (
        <h4 style={{ marginRight: "10px" }}>
            <b style={{ textTransform: "uppercase" }}>
                <IntlMessage id={"schedule.order_signed_by"} /> {state.status.name}
            </b>
        </h4>
    );
};

export default SeeOrder;

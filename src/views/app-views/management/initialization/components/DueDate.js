import { Button, Card, Col, DatePicker, Row } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setDueDate } from "store/slices/initialization/initializationDocInfoSlice";
import IntlMessage from "components/util-components/IntlMessage";

export const DueDate = () => {
    const dispatch = useDispatch();
    const { dueDate } = useSelector((state) => state.initializationNew);

    const hanDleChangeDate = (date) => {
        dispatch(setDueDate(date));
    };
    const disabledDate = (current) => {
        return current && current < moment().startOf("day");
    };

    const handleClearDate = () => {
        dispatch(setDueDate(null));
    };

    return (
        <Card style={{ width: "100%" }}>
            <Row gutter={15}>
                <Col lg={6} style={{ alignItems: "center", marginTop: "2%", color: "#1a3353" }}>
                    <IntlMessage id="initiate.dueDateSign" />
                </Col>
                <Col lg={12}>
                    <DatePicker
                        value={dueDate ? moment(dueDate) : null}
                        onChange={hanDleChangeDate}
                        handleClearDate={handleClearDate}
                        disabledDate={disabledDate}
                        format="DD.MM.YYYY"
                        style={{ width: "100%", marginTop: "5px", alignItems: "center" }}
                    />
                </Col>
                <Col lg={6} style={{ alignItems: "center", marginTop: "5px", color: "#1a3353" }}>
                    <Button onClick={handleClearDate} danger>
                        <IntlMessage id="initiate.clearDate" />
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default DueDate;

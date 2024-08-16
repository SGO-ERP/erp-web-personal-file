import React from "react";
import { Card, Col, Input, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setComment } from "store/slices/initialization/initializationDocInfoSlice";
import IntlMessage from "components/util-components/IntlMessage";

const { TextArea } = Input;

const CommentField = () => {
    const dispatch = useDispatch();

    const { comment } = useSelector((state) => state.initializationDocInfo);

    const handleChangeText = (e) => {
        dispatch(setComment(e.target.value));
    };

    return (
        <Card style={{ width: "100%" }}>
            <Row justify="center" gutter={[0, 16]}>
                <Col span={24}>
                    <IntlMessage id={"addComment"} />
                </Col>
                <Col span={24}>
                    <TextArea
                        value={comment}
                        onChange={handleChangeText}
                        allowClear={true}
                        placeholder={"Введите комментарий"}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default CommentField;

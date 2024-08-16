import React from "react";
import Header from "./components/Header";
import { Card, Col, Row } from "antd";
import TextBlock from "./components/TextBlock";
import UsersBlock from "./components/UsersBlock";
import TagsBlock from "./components/TagsBlock";
import ChooseSteps from "./components/ChooseSteps";
import DueDate from "./components/DueDate";
import CommentField from "./components/CommentField";
import { useSelector } from "react-redux";

const Index = () => {
    const { needDueDate, needComment } = useSelector((state) => state.initializationDocuments);

    return (
        <Col xs={24}>
            <Header />
            <Row style={{ marginTop: 20 }}>
                <Col xs={14}>
                    <Card>
                        <TextBlock />
                    </Card>
                </Col>
                <Col xs={1} style={{ width: 10 }} />
                <Col xs={9}>
                    <Card style={{ width: "100%" }}>
                        <UsersBlock />
                        <TagsBlock />
                    </Card>
                    {needDueDate ? (
                        <Row>
                            <DueDate className="dueDateBlock" />
                        </Row>
                    ) : null}
                    {needComment ? (
                        <Row>
                            <CommentField className="commentFieldBlock" />
                        </Row>
                    ) : null}
                    <ChooseSteps />
                </Col>
            </Row>
        </Col>
    );
};

export default Index;

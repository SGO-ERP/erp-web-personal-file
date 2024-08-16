import { Card, Checkbox, Col, Form, Input, Row, Select } from "antd";
import IntlMessage from "components/util-components/IntlMessage";
import { useState } from "react";
import EditorComponent from "../../candidates/list/stage/EditorComponent";
import { LocalText } from "../../../../../components/util-components/LocalizationText/LocalizationText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useRightClickMenu from "../hooks/useRightClickMenu";
import {
    saveTextKZ,
    setComment,
    setDate,
    setLanguage,
    setOrderDescription,
    setOrderName,
    setOrderNameKZ,
    setOrderPerson,
} from "store/slices/newConstructorSlices/constructorNewSlice";
import "../style.css";
import CreateTagModal from "../modals/CreateTagModal";
import TagsBlock from "../blocks/TagsBlock";
import HideTagsBlock from "../blocks/HideTagsBlock";

export const orderPerson = [
    { value: 1, label: { name: "Кандидат", nameKZ: "Кандидат" } },
    { value: 2, label: { name: "Сотрудник", nameKZ: "Қызметкер" } },
];

const CreateOrderKZ = (templateForm) => {
    const [tagToChange, setTagToChange] = useState(null);
    const [selectedWord, setSelectedWord] = useState(null);
    const [tagToDelete, setTagToDelete] = useState(null);

    const { t } = useTranslation();
    const { x, y, showMenu, targetRef } = useRightClickMenu();

    const { orderTemplate } = useSelector((state) => state.constructorNew);

    const dispatch = useDispatch();

    const changeOrderPerson = (value) => {
        dispatch(setOrderPerson(value));
    };
    const handleOrderTemplateNameChange = (e) => {
        dispatch(setOrderName(e.target.value));
    };
    const handleOrderTemplateNameChangeKZ = (e) => {
        dispatch(setOrderNameKZ(e.target.value));
    };
    const handleOrderTemplateDescriptionChange = (e) => {
        dispatch(setOrderDescription(e.target.value));
    };
    const handleComment = (e) => {
        dispatch(setComment(e.target.checked));
    };
    const handleDate = (e) => {
        dispatch(setDate(e.target.checked));
    };
    const handleLanguage = (e) => {
        dispatch(setLanguage(e.target.checked));
    };
    const handleSetText = (newValue) => {
        dispatch(saveTextKZ(newValue));
    };

    return (
        <div className="card">
            <Row>
                <Col xs={12}>
                    <Card style={{ marginRight: "3%" }}>
                        <div ref={targetRef}>
                            <EditorComponent
                                value={orderTemplate.textKZ}
                                setValue={handleSetText}
                                waterMarkerText={""}
                                setSelectedWord={setSelectedWord}
                            />
                            <CreateTagModal
                                tagToChange={tagToChange}
                                setTagToChange={setTagToChange}
                                x={x}
                                y={y + 70}
                                showMenu={showMenu}
                                selectedWord={selectedWord}
                                tagToDelete={tagToDelete}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Card style={{ width: "100%" }}>
                            <Row className="text" justify="left" style={{ marginBottom: "2%" }}>
                                <IntlMessage id="constructor.title.template" />
                            </Row>
                            <Form
                                form={templateForm.templateForm}
                                name="templateForm"
                                fields={[
                                    {
                                        name: "name",
                                        value: orderTemplate.name,
                                    },
                                    {
                                        name: "nameKZ",
                                        value: orderTemplate.nameKZ,
                                    },
                                    {
                                        name: "person",
                                        value: orderTemplate.person,
                                    },
                                    {
                                        name: "description",
                                        value: orderTemplate.description,
                                    },
                                    {
                                        name: "needRuLanguage",
                                        value: orderTemplate.needRuLanguage,
                                    },
                                    {
                                        name: "needComment",
                                        value: orderTemplate.needComment,
                                    },
                                    {
                                        name: "needDueDate",
                                        value: orderTemplate.needDueDate,
                                    },
                                ]}
                            >
                                <Form.Item
                                    name="name"
                                    label={<IntlMessage id="constructor.name.template" />}
                                    labelCol={{
                                        className: "form-item-label",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="constructor.name.template.placeholder" />
                                            ),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t("constructor.dismiss.template")}
                                        onChange={handleOrderTemplateNameChange}
                                        value={orderTemplate.name}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="nameKZ"
                                    label={
                                        <IntlMessage id="constructor.name.template.placeholderKZ" />
                                    }
                                    labelCol={{
                                        className: "form-item-label label-inline-style-own",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="constructor.name.template.placeholderKZ" />
                                            ),
                                        },
                                    ]}
                                >
                                    <Input //Write placeholder on kk
                                        placeholder={t("constructor.dismiss.kzTemplate")}
                                        onChange={handleOrderTemplateNameChangeKZ}
                                        value={orderTemplate.name}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="person"
                                    label={<IntlMessage id="constructor.subject.template" />}
                                    labelCol={{
                                        className: "form-item-label",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="constructor.subject.template.placeholder" />
                                            ),
                                        },
                                    ]}
                                >
                                    <Select
                                        style={{ width: "100%" }}
                                        placeholder={t("constructor.placeholder")}
                                        options={orderPerson.map((person) => ({
                                            value: person.value,
                                            label: LocalText.getName(person.label),
                                        }))}
                                        value={orderTemplate.person}
                                        onChange={changeOrderPerson}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<IntlMessage id="constructor.command.desc" />}
                                    name="description"
                                    labelCol={{
                                        className: "form-item-label",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                    rules={[
                                        {
                                            required: true,
                                            message: (
                                                <IntlMessage id="constructor.command.desc.placeholder" />
                                            ),
                                        },
                                    ]}
                                >
                                    <Input
                                        placeholder={t("constructor.command.dismiss")}
                                        onChange={handleOrderTemplateDescriptionChange}
                                        value={orderTemplate.description}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="needRuLanguage"
                                    label={<IntlMessage id="constructor.need.AnotherLanguage" />}
                                    labelCol={{
                                        className: "form-item-label",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                >
                                    <Checkbox
                                        checked={orderTemplate.needRuLanguage}
                                        onChange={handleLanguage}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="needComment"
                                    label={<IntlMessage id="constructor.need.needComment" />}
                                    labelCol={{
                                        className: "form-item-label",
                                        span: 8,
                                    }}
                                    wrapperCol={{
                                        span: 17,
                                    }}
                                >
                                    <Checkbox
                                        checked={orderTemplate.needComment}
                                        onChange={handleComment}
                                    />
                                </Form.Item>
                            </Form>
                        </Card>
                    </Row>
                    <TagsBlock setTagToChange={setTagToChange} setTagToDelete={setTagToDelete} />
                    <HideTagsBlock setTagToChange={setTagToChange} />
                </Col>
            </Row>
        </div>
    );
};

export default CreateOrderKZ;

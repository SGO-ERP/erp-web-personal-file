import { Col, Row, Card, Button, Input } from 'antd';
import IntlMessage from 'components/util-components/IntlMessage';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../style.css';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    changeIsHiddenTag,
    deleteTagsInfo,
    showTagModal,
} from 'store/slices/newConstructorSlices/constructorNewSlice';

const TagsBlock = (props) => {
    const { tagsInfoArray } = useSelector((state) => state.constructorNew);

    const dispatch = useDispatch();

    const changeTag = (tag) => {
        dispatch(showTagModal(true));
        dispatch(changeIsHiddenTag(false));
        props.setTagToChange(tag);
    };

    const deleteTag = (tag) => {
        let newWord;
        if (tag.directory && tag.directory === 'staff_unit') {
            newWord = '{{new_department_name}} {{' + tag.tagname + '}}';
        } else {
            newWord = '{{' + tag.tagname + '}}';
        }

        dispatch(deleteTagsInfo(tag.id));

        props.setTagToDelete({ newWord: tag.prevWordKZ, oldWord: newWord, isHidden: false });
    };

    return tagsInfoArray.length > 0 ? (
        <Card>
            <Row className="text" justify="left" style={{ marginBottom: 30 }}>
                <IntlMessage id="constructor.tag.displays.letter" />
            </Row>
            <Row>
                <Col xs={5} className="text">
                    <IntlMessage id="constructor.tag.name" />
                </Col>
                <Col xs={16} className="text">
                    <IntlMessage id="constructor.tag.name.user" />
                </Col>
                <Col xs={3} className="text" style={{ display: 'flex', justifyContent: 'end' }}>
                    <IntlMessage id="constructor.tag.action" />
                </Col>
            </Row>
            {tagsInfoArray.map((tag) => {
                if (tag.isHidden) return;
                return (
                    <Row justify="left" key={tag.id} className="tagRow">
                        <Col xs={5} className="tagName">
                            {tag.tagname}
                        </Col>
                        <Col xs={15}>
                            <Input value={tag.alias_nameKZ} />
                        </Col>
                        <Col xs={4} style={{ display: 'flex', justifyContent: 'end' }}>
                            <Button className="tagRowButtons" onClick={() => changeTag(tag)}>
                                <EditOutlined />
                            </Button>
                            <Button
                                className="tagRowButtons"
                                style={{ marginLeft: 5 }}
                                onClick={() => deleteTag(tag)}
                            >
                                <DeleteOutlined style={{ color: 'red' }} />
                            </Button>
                        </Col>
                    </Row>
                );
            })}
        </Card>
    ) : null;
};

export default TagsBlock;

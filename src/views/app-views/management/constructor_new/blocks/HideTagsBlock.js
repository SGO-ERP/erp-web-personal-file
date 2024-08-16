import { Button, Card, Col, Input, Row } from 'antd';
import { DeleteOutlined, EditOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessage from 'components/util-components/IntlMessage';
import {
    deleteTagsInfo,
    showTagModal,
    changeIsHiddenTag,
} from 'store/slices/newConstructorSlices/constructorNewSlice';

const HideTagsBlock = (props) => {
    const dispatch = useDispatch();

    const { tagsInfoArray } = useSelector((state) => state.constructorNew);

    const openModalProperty = () => {
        dispatch(showTagModal(true));
        dispatch(changeIsHiddenTag(true));
    };

    const changeTag = (tag) => {
        dispatch(showTagModal(true));
        dispatch(changeIsHiddenTag(true));
        props.setTagToChange(tag);
    };

    const deleteTag = (tag) => {
        let newWord;
        dispatch(deleteTagsInfo(tag.id));
        if (tag.directory && tag.directory === 'staff_unit') {
            newWord = '{{new_department_name}} {{' + tag.tagname + '}}';
        } else {
            newWord = '{{' + tag.tagname + '}}';
        }

        props.setTagToDelete({ newWord: tag.prevWordKZ, oldWord: newWord, isHidden: true });
    };

    return (
        <>
            <Card style={{ width: '100%' }}>
                <Row style={{ marginBottom: '20px' }}>
                    <Col xs={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>
                            <IntlMessage id="constructor.tag.displays.hidden" />
                        </b>

                        <Button
                            style={{
                                height: 32,
                                width: 32,
                                padding: '0px',
                            }}
                            onClick={openModalProperty}
                        >
                            <PlusSquareOutlined />
                        </Button>
                    </Col>
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
                    return tag.isHidden ? (
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
                    ) : null;
                })}
            </Card>
        </>
    );
};
export default HideTagsBlock;

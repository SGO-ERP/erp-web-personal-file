import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Input, Row } from 'antd';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../components/util-components/IntlMessage';
import { DeleteOutlined } from '@ant-design/icons';
import { addRusTags } from 'store/slices/newConstructorSlices/constructorNewSlice';

const TagsBlockRU = (props) => {
    const { tagsInfoArray } = useSelector((state) => state.constructorNew);
    const isKK = localStorage.getItem('lan');

    const dispatch = useDispatch();

    const deleteTag = (tag) => {
        let newWord;
        if (tag.directory && tag.directory === 'staff_unit') {
            newWord = '{{new_department_name}} {{' + tag.tagname + '}}';
        } else {
            newWord = '{{' + tag.tagname + '}}';
        }

        props.setTagToDelete({ newWord: tag.prevWordRU, oldWord: newWord, isHidden: false });
        dispatch(addRusTags({ tagname: tag.tagname, prev: null, alias_name: null }));
    };

    if (tagsInfoArray.length > 0)
        return (
            <Card style={{ width: '100%' }}>
                <Row style={{ marginBottom: '20px' }}>
                    <Col>
                        <b>
                            <IntlMessage id={'constructor.tag.displays.letter'} />
                        </b>
                    </Col>
                </Row>
                <Row justify="space-between" align="middle" style={{ marginTop: '2%' }}>
                    <Col xs={5} className="text">
                        <IntlMessage id={'constructor.tag.name'} />
                    </Col>
                    <Col xs={15} className="text">
                        <IntlMessage id={'constructor.tag.name.user'} />
                    </Col>
                    <Col xs={3} className="text" style={{ display: 'flex', justifyContent: 'end' }}>
                        <IntlMessage id="constructor.tag.action" />
                    </Col>
                </Row>
                {tagsInfoArray.map((tag) => {
                    if (tag.isHidden) return;
                    return (
                        <Row
                            justify="space-between"
                            align="middle"
                            style={{ marginTop: '2%' }}
                            key={tag.id}
                        >
                            <Col
                                className={`text2 ${!tag.alias_name ? 'red-text' : ''}`}
                                xs={5}
                                style={{ paddingRight: 10 }}
                            >
                                {tag.tagname}
                            </Col>
                            <Col xs={15}>
                                <Input
                                    style={{ width: '98%', height: 32 }}
                                    value={tag.alias_name ? tag.alias_name : ''}
                                    placeholder={
                                        !isKK
                                            ? 'Орыс тіліндегі тег атауы'
                                            : 'Название тега на русском'
                                    }
                                ></Input>
                            </Col>
                            <Col xs={4} style={{ display: 'flex', justifyContent: 'end' }}>
                                <Button
                                    className="tagRowButtons"
                                    onClick={() => deleteTag(tag)}
                                    style={{ color: 'red' }}
                                    disabled={tag.alias_name ? false : true}
                                >
                                    <DeleteOutlined />
                                </Button>
                            </Col>
                        </Row>
                    );
                })}
            </Card>
        );

    return null;
};

export default TagsBlockRU;

import { Card, Col, Form, Input, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import EditorComponent from '../../candidates/list/stage/EditorComponent';
import useRightClickMenuAnotherLanguage from '../hooks/useRightClickMenuAnotherLanguage';
import {
    saveTextRU,
    setOrderDescriptionRU,
} from 'store/slices/newConstructorSlices/constructorNewSlice';
import PickTagModal from '../modals/PickTagModal';
import TagsBlockRU from '../blocks/TagsBlockRU';

const CreateOrderRU = ({ templateFormRU }) => {
    const [tagToDelete, setTagToDelete] = useState(null);
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const { orderTemplate } = useSelector((state) => state.constructorNew);

    const [selectedWord, setSelectedWord] = useState(null);

    const orderSubject = [
        { value: 1, label: 'Кандидат' },
        { value: 2, label: 'Сотрудник' },
    ];

    if (localStorage.getItem('lan') === 'kk') {
        orderSubject[0].label = 'Кандидат';
        orderSubject[1].label = 'Қызметкер';
    }

    const { x, y, showMenu, targetRefRU } = useRightClickMenuAnotherLanguage();

    const handleOrderTemplateDescriptionChange = (e) => {
        dispatch(setOrderDescriptionRU(e.target.value));
    };

    const handleSetText = (newValue) => {
        dispatch(saveTextRU(newValue));
    };

    return (
        <div className="card">
            <Row>
                <Col xs={12}>
                    <Card style={{ marginRight: '3%' }}>
                        <div ref={targetRefRU}>
                            <EditorComponent
                                setSelectedWord={setSelectedWord}
                                value={orderTemplate.textRU}
                                setValue={handleSetText}
                                waterMarkerText={''}
                            />
                            <PickTagModal
                                x={x}
                                y={y + 60}
                                showMenu={showMenu}
                                selectedWord={selectedWord}
                                tagToDelete={tagToDelete}
                            />
                        </div>
                    </Card>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Card style={{ width: '100%' }}>
                            <Row className="text" justify="left" style={{ marginBottom: '2%' }}>
                                <IntlMessage id="constructor.addTag.another.language" />
                            </Row>
                            <Form
                                form={templateFormRU}
                                name="templateFormRU"
                                fields={[
                                    {
                                        name: 'person',
                                        value: orderTemplate.person,
                                    },
                                    {
                                        name: 'description',
                                        value: orderTemplate.descriptionRU,
                                    },
                                ]}
                            >
                                <Form.Item
                                    name="person"
                                    label={<IntlMessage id="initiate.chooseForm" />}
                                    labelCol={{
                                        className: 'form-item-label',
                                        span: 7,
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
                                        style={{ width: '100%' }}
                                        placeholder={t('constructor.placeholder')}
                                        options={orderSubject}
                                        disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label={<IntlMessage id="constructor.command.desc" />}
                                    labelCol={{
                                        className: 'form-item-label',
                                        span: 7,
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
                                    <Input
                                        onChange={handleOrderTemplateDescriptionChange}
                                        placeholder={t('constructor.command.dismiss')}
                                        value={orderTemplate.descriptionRU}
                                    ></Input>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Row>
                    <TagsBlockRU setTagToDelete={setTagToDelete} />
                </Col>
            </Row>
        </div>
    );
};

export default CreateOrderRU;

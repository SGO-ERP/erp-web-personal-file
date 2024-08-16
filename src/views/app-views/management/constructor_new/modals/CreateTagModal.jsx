import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import IntlMessage from 'components/util-components/IntlMessage';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
    auto_option,
    cases,
    dataTaken,
    dataTakenKZ,
    dictionary,
    field_default,
    inputFormat,
    styleUnser,
} from '../DataOptions';
import {
    deleteTagsInfo,
    saveTextKZ,
    setTags,
    showTagModal,
} from 'store/slices/newConstructorSlices/constructorNewSlice';

const CreateTagModal = ({
    x,
    y,
    showMenu,
    selectedWord,
    setTagToChange,
    tagToChange,
    tagToDelete,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [tagForm] = Form.useForm();
    const { i18n } = useTranslation();
    const isKkLanguage = i18n.language === 'kk';
    const [typeInput, setTypeInput] = useState();
    const { properties } = useSelector((state) => state.ordersConstructor.orderTemplate);

    const { tagModal, tagsInfoArray, orderTemplate, isHidden } = useSelector(
        (state) => state.constructorNew,
    );

    const style = () => {
        return {
            backgroundColor: 'white',
            flexDirection: 'column',
            padding: 10,
            top: y,
            left: x,
            position: 'absolute',
            display: showMenu ? 'flex' : 'none',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
        };
    };

    useEffect(() => {
        if (!tagToDelete) return;

        replaceWordOrTags(tagToDelete.oldWord, tagToDelete.newWord, tagToDelete.isHidden);
    }, [tagToDelete]);

    const replaceWordOrTags = (oldWord, newWord) => {
        if (!isHidden) {
            let startIndex = 0;
            let searchIndex;
            let updatedEditorValue = orderTemplate.textKZ;

            while ((searchIndex = updatedEditorValue.indexOf(oldWord, startIndex)) > -1) {
                if (
                    /^[^<_0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ{}-]+$/.test(
                        updatedEditorValue[searchIndex - 1],
                    ) &&
                    /^[^>_0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ{}-]+$/.test(
                        updatedEditorValue[searchIndex + oldWord.length],
                    )
                ) {
                    updatedEditorValue =
                        updatedEditorValue.slice(0, searchIndex) +
                        newWord +
                        updatedEditorValue.slice(searchIndex + oldWord.length);

                    startIndex = searchIndex + newWord.length;
                } else {
                    startIndex = searchIndex + oldWord.length;
                }
            }

            dispatch(saveTextKZ(updatedEditorValue));
        }
    };

    const submitTagForm = async (value) => {
        let newWord;
        let oldWord;
        await tagForm.validateFields();

        if (tagToChange) {
            dispatch(deleteTagsInfo(tagToChange.id));
        }

        if (value.data_taken !== 'document_params') {
            dispatch(
                setTags({
                    tagname: value.tagname,
                    alias_name: null,
                    alias_nameKZ: value.alias_nameKZ,
                    isHidden: tagToChange ? tagToChange.isHidden : isHidden,
                    id: tagToChange ? tagToChange.id : tagsInfoArray.length,
                    data_taken: value.data_taken,
                    directory: value?.directory || null,
                    input_format: value?.input_format || null,
                    cases: value.cases !== undefined ? value.cases : null,
                    field_name: value?.field_name || null,
                    prevWordKZ: tagToChange ? tagToChange.prevWordKZ : selectedWord,
                    prevWordRU: tagToChange ? tagToChange.prevWordKZ : null,
                }),
            );
        }

        if (!isHidden) {
            const tagname =
                value.data_taken !== 'document_params' ? value.tagname : value.input_format;

            if (value.directory && value.directory === 'staff_unit') {
                newWord = '{{new_department_name}} {{' + tagname + '}}';
            } else {
                newWord = '{{' + tagname + '}}';
            }

            if (tagToChange) {
                if (value.directory && value.directory === 'staff_unit') {
                    oldWord = '{{new_department_name}} {{' + tagToChange.tagname + '}}';
                } else {
                    oldWord = '{{' + tagToChange.tagname + '}}';
                }
                replaceWordOrTags(oldWord, newWord);
            } else {
                replaceWordOrTags(selectedWord, newWord);
            }
        }

        closeModalProperty();
        tagForm.resetFields();
        setTypeInput();
    };

    const changeTypeInput = (value) => {
        setTypeInput(value);
    };

    useEffect(() => {
        if (tagToChange) {
            setTypeInput(tagToChange?.data_taken);
        }
    }, [tagToChange]);

    const openModalProperty = () => {
        dispatch(showTagModal(true));
        setTypeInput();
        setTagToChange(null);
        tagForm.resetFields();
    };

    const closeModalProperty = () => {
        dispatch(showTagModal(false));
        setTypeInput();
        setTagToChange(null);
        tagForm.resetFields();
    };

    const checkIfNameExists = (name, originalTagName) => {
        return Object.values(tagsInfoArray).some(
            (property) => property.tagname === name && property.tagname !== originalTagName,
        );
    };

    const checkIfTitleExists = (name, originalTagName) => {
        return Object.values(properties).some(
            (property) => property.title === name && property.title !== originalTagName,
        );
    };

    return (
        <div style={style()}>
            <div onClick={openModalProperty}>
                <IntlMessage id="constructor.create.tag" />
            </div>
            <Modal
                title={<IntlMessage id="constructor.creating.tag" />}
                open={tagModal}
                okText={isKkLanguage ? 'Сақтау' : 'Сохранить'}
                cancelText={isKkLanguage ? 'Болдырмау' : 'Отменить'}
                onCancel={closeModalProperty}
                onOk={tagForm.submit}
            >
                <Form
                    onFinish={submitTagForm}
                    fields={
                        tagToChange && [
                            {
                                name: 'tagname',
                                value: tagToChange?.tagname,
                            },
                            {
                                name: 'alias_nameKZ',
                                value: tagToChange?.alias_nameKZ,
                            },
                            {
                                name: 'data_taken',
                                value: tagToChange?.data_taken,
                            },
                            {
                                name: 'directory',
                                value: tagToChange?.directory,
                            },
                            {
                                name: 'field_name',
                                value: tagToChange?.field_name,
                            },
                            {
                                name: 'input_format',
                                value: tagToChange?.input_format,
                            },
                            {
                                name: 'cases',
                                value: tagToChange?.cases,
                            },
                        ]
                    }
                    form={tagForm}
                    name="tagForm"
                >
                    <Row style={{ marginBottom: '2%' }}>
                        <Col className="text">
                            <IntlMessage id="constructor.enter.type" />
                        </Col>
                        <Col
                            xs={2}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <QuestionCircleFilled />
                        </Col>
                    </Row>
                    <Form.Item
                        name="data_taken"
                        rules={[
                            {
                                required: true,
                                message: <IntlMessage id="constructor.enter.type.placeholder" />,
                            },
                        ]}
                    >
                        <Select
                            style={{ width: '100%' }}
                            placeholder={t('constructor.enter.type.placeholder')}
                            options={isKkLanguage ? dataTakenKZ : dataTaken}
                            onChange={changeTypeInput}
                            value={typeInput}
                            dropdownRender={(menu) => <div className="custom-cascader">{menu}</div>}
                        ></Select>
                    </Form.Item>
                    {typeInput === 'auto' ? (
                        <>
                            <Row>
                                <Col xs={24}>
                                    <Row style={{ marginBottom: '2%' }}>
                                        <Col className="text">
                                            <IntlMessage id="constructor.tag.name" />
                                        </Col>
                                        <Col
                                            xs={2}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Row>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <div
                                                        style={styleUnser}
                                                        title={
                                                            <IntlMessage id="constructor.name.local.title" />
                                                        }
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="tagname"
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessage id="constructor.enter.tag" />,
                                            },
                                            () => ({
                                                validator(_, value) {
                                                    const regex = /\s/;
                                                    const regexLan = /^[A-Za-z0-9\s_]+$/;

                                                    if (regex.test(value)) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.space'),
                                                            ),
                                                        );
                                                    }
                                                    if (!regexLan.test(value) && value !== '') {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.lang'),
                                                            ),
                                                        );
                                                    }
                                                    if (
                                                        !value ||
                                                        !checkIfNameExists(
                                                            value,
                                                            tagToChange?.tagname,
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            new Error(
                                                                t('constructor.enter.another.tag'),
                                                            ),
                                                        ),
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input placeholder={t('constructor.enter.tag')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.tag.name.userKZ" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="alias_nameKZ"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="constructor.enter.tag.user.kz" />,
                                    },
                                    () => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                !checkIfNameExists(value, tagToChange?.alias_nameKZ)
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    new Error(t('constructor.enter.another.tag')),
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input placeholder={t('constructor.enter.tag.user.kz')} />
                            </Form.Item>
                            <Row style={{ marginBottom: '2%', marginTop: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.name.field" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="field_name"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="constructor.name.field" />,
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('constructor.name.field')}
                                    options={auto_option(isKkLanguage)}
                                />
                            </Form.Item>
                            <Row style={{ marginBottom: '2%', marginTop: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.name.cases" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="cases"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="constructor.name.cases" />,
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('constructor.name.cases')}
                                    options={cases(isKkLanguage)}
                                />
                            </Form.Item>
                        </>
                    ) : null}

                    {typeInput === 'dropdown' ? (
                        <>
                            <Row>
                                <Col xs={24}>
                                    <Row style={{ marginBottom: '2%' }}>
                                        <Col className="text">
                                            <IntlMessage id="constructor.tag.name" />
                                        </Col>
                                        <Col
                                            xs={2}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Row>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <div
                                                        style={styleUnser}
                                                        title={
                                                            <IntlMessage id="constructor.name.local.title" />
                                                        }
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="tagname"
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessage id="constructor.enter.tag" />,
                                            },
                                            () => ({
                                                validator(_, value) {
                                                    const regex = /\s/;
                                                    const regexLan = /^[A-Za-z0-9\s_]+$/;

                                                    if (regex.test(value)) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.space'),
                                                            ),
                                                        );
                                                    }
                                                    if (!regexLan.test(value) && value !== '') {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.lang'),
                                                            ),
                                                        );
                                                    }
                                                    if (
                                                        !value ||
                                                        !checkIfNameExists(
                                                            value,
                                                            tagToChange?.tagname,
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            new Error(
                                                                t('constructor.enter.another.tag'),
                                                            ),
                                                        ),
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input placeholder={t('constructor.enter.tag')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.tag.name.userKZ" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="alias_nameKZ"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="constructor.enter.tag.user.kz" />,
                                    },
                                ]}
                            >
                                <Input placeholder={t('constructor.enter.tag.user.kz')} />
                            </Form.Item>
                            <Row style={{ marginBottom: '2%', marginTop: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.name.directory" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="directory"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="constructor.name.directory.placeholder" />
                                        ),
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('constructor.name.directory.placeholder')}
                                    options={dictionary(isKkLanguage)}
                                ></Select>
                            </Form.Item>
                        </>
                    ) : null}
                    {typeInput === 'manual' ? (
                        <>
                            <Row>
                                <Col xs={24}>
                                    <Row style={{ marginBottom: '2%' }}>
                                        <Col className="text">
                                            <IntlMessage id="constructor.tag.name" />
                                        </Col>
                                        <Col
                                            xs={2}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Row>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <div
                                                        style={styleUnser}
                                                        title={
                                                            <IntlMessage id="constructor.name.local.title" />
                                                        }
                                                    >
                                                        ?
                                                    </div>
                                                </div>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item
                                        name="tagname"
                                        rules={[
                                            {
                                                required: true,
                                                message: <IntlMessage id="constructor.enter.tag" />,
                                            },
                                            () => ({
                                                validator(_, value) {
                                                    const regex = /\s/;
                                                    const regexLan = /^[A-Za-z0-9\s_]+$/;

                                                    if (regex.test(value)) {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.space'),
                                                            ),
                                                        );
                                                    }
                                                    if (!regexLan.test(value) && value !== '') {
                                                        return Promise.reject(
                                                            new Error(
                                                                t('constructor.name.error.lang'),
                                                            ),
                                                        );
                                                    }
                                                    if (
                                                        !value ||
                                                        !checkIfNameExists(
                                                            value,
                                                            tagToChange?.tagname,
                                                        )
                                                    ) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        new Error(
                                                            new Error(
                                                                t('constructor.enter.another.tag'),
                                                            ),
                                                        ),
                                                    );
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input placeholder={t('constructor.enter.tag')} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.tag.name.userKZ" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="alias_nameKZ"
                                rules={[
                                    {
                                        required: true,
                                        message: <IntlMessage id="constructor.enter.tag.user.kz" />,
                                    },
                                    () => ({
                                        validator(_, value) {
                                            if (
                                                !value ||
                                                !checkIfTitleExists(
                                                    value,
                                                    tagToChange?.alias_nameKZ,
                                                )
                                            ) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error(
                                                    new Error(t('constructor.enter.another.tag')),
                                                ),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input placeholder={t('constructor.enter.tag.user.kz')} />
                            </Form.Item>
                            <Row style={{ marginBottom: '2%', marginTop: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.format.data" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="input_format"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="constructor.format.data.placeholder" />
                                        ),
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('constructor.format.data.placeholder')}
                                    options={inputFormat(isKkLanguage)}
                                />
                            </Form.Item>
                        </>
                    ) : null}
                    {typeInput === 'document_params' ? (
                        <>
                            <Row style={{ marginBottom: '2%', marginTop: '2%' }}>
                                <Col className="text">
                                    <IntlMessage id="constructor.format.data" />
                                </Col>
                                <Col
                                    xs={2}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Row>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <div
                                                style={styleUnser}
                                                title={
                                                    <IntlMessage id="constructor.name.local.title" />
                                                }
                                            >
                                                ?
                                            </div>{' '}
                                        </div>
                                    </Row>
                                </Col>
                            </Row>
                            <Form.Item
                                name="input_format"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <IntlMessage id="constructor.format.data.placeholder" />
                                        ),
                                    },
                                ]}
                            >
                                <Select
                                    style={{ width: '100%' }}
                                    placeholder={t('constructor.format.data.placeholder')}
                                    options={field_default(isKkLanguage)}
                                />
                            </Form.Item>
                        </>
                    ) : null}
                </Form>
            </Modal>
        </div>
    );
};

export default CreateTagModal;

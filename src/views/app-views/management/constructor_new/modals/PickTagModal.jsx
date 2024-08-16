import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import '../editor.css';
import {
    showPickTagModal,
    addRusTags,
    saveTextRU,
} from 'store/slices/newConstructorSlices/constructorNewSlice';
import { useEffect } from 'react';

const PickTagModal = ({ x, y, showMenu, selectedWord, tagToDelete }) => {
    let dispatch = useDispatch();

    useEffect(() => {
        if (!tagToDelete) return;

        replaceWordOrTags(tagToDelete.oldWord, tagToDelete.newWord);
    }, [tagToDelete]);

    const { pickTagModal, tagsInfoArray, orderTemplate } = useSelector(
        (state) => state.constructorNew,
    );
    const [tagForm] = Form.useForm();

    const transformPropertiesToArray = () => {
        const keys = Object.keys(tagsInfoArray);

        const filteredKeys = keys.filter((key) => {
            return !tagsInfoArray[key].isHidden && tagsInfoArray[key].tagname;
        });

        return filteredKeys
            .filter((key) => tagsInfoArray[key].alias_name === null)
            .map((key) => {
                return {
                    value: tagsInfoArray[key].tagname,
                    label: tagsInfoArray[key].tagname,
                };
            });
    };

    const selectTag = transformPropertiesToArray();

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

    const styleUnser = {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(114, 132, 154, 0.4)',
        color: 'white',
        fontSize: 11,
        display: 'flex',
        justifyContent: 'center',
    };

    const openTagModal = () => {
        dispatch(showPickTagModal(true));
    };

    const subMitTagForm = (value) => {
        dispatch(showPickTagModal(false));
        dispatch(
            addRusTags({
                tagname: value.tagname,
                alias_name: value.alias_name,
                prev: selectedWord,
            }),
        );
        let newWord;
        let matchTag = tagsInfoArray.filter((tag) => tag.tagname === value.tagname);

        if (matchTag[0].directory && matchTag[0].directory === 'staff_unit') {
            newWord = '{{new_department_name}} {{' + value.tagname + '}}';
        } else {
            newWord = '{{' + value.tagname + '}}';
        }

        replaceWordOrTags(selectedWord, newWord);
        tagForm.resetFields();
    };

    const handleCancel = () => {
        dispatch(showPickTagModal(false));
    };

    const replaceWordOrTags = (oldWord, newWord) => {
        let startIndex = 0;
        let searchIndex;
        let updatedEditorValue = orderTemplate.textRU;

        while ((searchIndex = updatedEditorValue.indexOf(oldWord, startIndex)) > -1) {
            if (
                /^[^<_0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ{}]+$/.test(
                    updatedEditorValue[searchIndex - 1],
                ) &&
                /^[^>_\-0-9A-Za-zА-Яа-яӘәІіҢңҒғҮүҰұҚқҺһЁёҖҗҢңҪҫҮүҰұҺһҖҗҢңҪҫ{}]+$/.test(
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

        dispatch(saveTextRU(updatedEditorValue));
    };

    return (
        <div style={style()}>
            <div onClick={openTagModal}>Выбрать тег</div>
            <Modal
                title="Выбор тега"
                open={pickTagModal}
                okText="Сохранить"
                cancelText="Отменить"
                onCancel={handleCancel}
                onOk={tagForm.submit}
                onFinish={subMitTagForm}
            >
                <Form onFinish={subMitTagForm} form={tagForm} name="tagForm">
                    <Row style={{ marginBottom: '2%' }}>
                        <Col className="text">Выберте тег</Col>
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
                                        title="Локальное имя тега, будет отображаться в документе"
                                    >
                                        ?
                                    </div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Form.Item
                        name="tagname"
                        rules={[
                            {
                                required: true,
                                message: 'Выберите тег',
                            },
                        ]}
                    >
                        <Select options={selectTag} placeholder="Тег" />
                    </Form.Item>
                    <Row style={{ marginBottom: '2%' }}>
                        <Col className="text">Имя тега для пользователей</Col>
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
                                        title="Локальное имя тега, будет отображаться в документе"
                                    >
                                        ?
                                    </div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Form.Item
                        name="alias_name"
                        rules={[
                            {
                                required: true,
                                message: 'Введите имя тега для пользователей',
                            },
                        ]}
                    >
                        <Input placeholder="Введите имя тега для пользователей" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PickTagModal;

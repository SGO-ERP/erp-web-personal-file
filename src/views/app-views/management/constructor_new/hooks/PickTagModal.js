import { Col, Form, Input, Modal, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { showTagModalPick } from 'store/slices/candidates/ordersConstructorSlice';
import '../style.css';

const PickTagModal = ({ x, y, showMenu, modalCase }) => {
    let dispatch = useDispatch();

    const tagModalPick = useSelector((state) => state.ordersConstructor.tagModalPick);
    const properties = useSelector((state) => state.ordersConstructor.orderTemplate.properties);

    const [tagForm] = Form.useForm();

    const transformPropertiesToArray = () => {
        const keys = Object.keys(properties);

        const filteredKeys = keys.filter((key) => {
            return properties[key].foundInText === false && properties[key].isHidden === false;
        });

        return filteredKeys.map((key) => {
            return {
                value: properties[key].tagname,
                label: properties[key].tagname,
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
        dispatch(showTagModalPick(true));
    };

    const subMitTagForm = (value) => {
        dispatch(showTagModalPick(false));
        modalCase.selectTag({
            title_another_language: value.title_another_language,
            foundInText: true,
            tagname: value.tagname,
        });
        tagForm.resetFields();
    };

    const handleCancel = () => {
        dispatch(showTagModalPick(false));
    };

    return (
        <div style={style()}>
            <div onClick={openTagModal}>Выбрать тег</div>
            <Modal
                title="Выбор тега"
                open={tagModalPick}
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
                        name="title_another_language"
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

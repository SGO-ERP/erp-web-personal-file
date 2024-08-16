import { Col, Form, Input, Modal, notification, Radio, Row, Tag, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { addRemoteStaffUnit, editRemoteStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { embedStaffUnitNode, findSubDivisionNode } from 'utils/schedule/utils';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/useStore';
import uuidv4 from '../../../../../../utils/helpers/uuid';
import { addLocalStaffUnit, editLocalStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { Typography } from 'antd';
import { PrivateServices } from 'API';

const { Title } = Typography;

const ModalQualReq = ({ isOpen, onClose, staffUnit }) => {
    const [staffUnitResponse, setStaffUnitResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const [formItems, setFormItems] = useState([
        { inputValue: '', tags: [] },
        { inputValue: '', tags: [] },
        { inputValue: '', tags: [] },
        { inputValue: '', tags: [] },
    ]);
    const [modalTitles, setModalTitles] = useState([
        'Требования к образованию через точку',
        'Требования к стажу через точку',
        'Практический опыт через точку',
        'Требования по состоянию здоровья через точку',
    ]);
    const [modalTitlesKz, setModalTitlesKz] = useState([
        'Қазақ тілінде білім беруге қойылатын талаптар нүкте арқылы',
        'Қазақ тіліндегі өтілге қойылатын талаптар нүкте арқылы',
        'Қазақ тіліндегі практикалық тәжірибе нүкте арқылы',
        'Денсаулық жағдайы бойынша қойылатын талаптар қазақ тілінде нүкте арқылы',
    ]);
    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const dispatch = useAppDispatch();
    const REMOTE_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);
    const LOCAL_archiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.local);
    const [selectedLanguage, setSelectedLanguage] = useState('ru');
    const [dataLoaded, setDataLoaded] = useState(false);
    const [form] = Form.useForm();

    let requirements = [
        {
            name: 'Требования к образованию',
            nameKZ: 'Қазақ тілінде білім беруге қойылатын талаптар',
            keys: formItems[0].tags,
        },
        {
            name: 'Требования к стажу',
            nameKZ: 'Қазақ тіліндегі өтілге қойылатын талаптар',
            keys: formItems[1].tags,
        },
        {
            name: 'Практический опыт',
            nameKZ: 'Қазақ тіліндегі практикалық тәжірибе',
            keys: formItems[2].tags,
        },
        {
            name: 'Требования по состоянию здоровья',
            nameKZ: 'Денсаулық жағдайы бойынша қойылатын талаптар қазақ тілінде',
            keys: formItems[3].tags,
        },
    ];

    useEffect(() => {
        const getStaffUnit = async () => {
            if (!staffUnit || !staffUnit?.id) {
                return
            }
            try {
                setIsLoading(true)

                const id = staffUnit.id
                const url =`/api/v1/archive_staff_unit/${id}`
                const response = await PrivateServices.get(url)
                const staffUnitResponse = response.data

                setFormItems((prevFormItems) => {
                    const updatedFormItems = prevFormItems.map((item, index) => {
                        const propInfo = staffUnitResponse?.requirements?.[index]?.keys ?? [];
                        return { ...item, tags: [...item.tags, ...propInfo] };
                    });
                    return updatedFormItems;
                });
                setStaffUnitResponse(staffUnitResponse)
            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false)
            }
        }
        getStaffUnit()
    }, [staffUnit])

    const handleCancel = () => {
        setDataLoaded(false);
        setFormItems([
            { inputValue: '', tags: [] },
            { inputValue: '', tags: [] },
            { inputValue: '', tags: [] },
            { inputValue: '', tags: [] },
        ]);
        onClose();
    };

    const handleOk = () => {
        const foundStaffDivision = findSubDivisionNode(
            archiveStaffDivision,
            staffUnit.staff_division_id,
        );
        if (Object.prototype.hasOwnProperty.call(staffUnit, 'isLocal')) {
            const isExists = LOCAL_archiveStaffUnit.find((item) => item.id === staffUnit.id);
            if (!isExists) {
                dispatch(
                    addLocalStaffUnit({
                        ...staffUnit,
                        isLocal: true,
                        id: uuidv4(),
                        requirements,
                    }),
                );
            } else {
                dispatch(
                    editLocalStaffUnit({
                        ...staffUnit,
                        id: staffUnit.id,
                        isLocal: true,
                        requirements,
                    }),
                );
            }
            if (foundStaffDivision)
                dispatch(
                    change(
                        embedStaffUnitNode(
                            {
                                ...staffUnit,
                                id: staffUnit.id,
                                isLocal: true,
                                requirements,
                            },
                            foundStaffDivision,
                            archiveStaffDivision,
                        ),
                    ),
                );
        } else {
            const isExists = REMOTE_archiveStaffUnit.find(
                (staffUnit) => staffUnit.id === staffUnit?.id,
            );
            const newStaffUnit = {
                ...staffUnit,
                requirements: requirements,
            };
            if (isExists) {
                dispatch(editRemoteStaffUnit(newStaffUnit));
            } else {
                dispatch(addRemoteStaffUnit(newStaffUnit));
            }
            if (foundStaffDivision) {
                dispatch(
                    change(
                        embedStaffUnitNode(newStaffUnit, foundStaffDivision, archiveStaffDivision),
                    ),
                );
            }
        }
        onClose();
    };

    const handleInputChange = (index, value) => {
        setFormItems((prevFormItems) => {
            const updatedFormItems = [...prevFormItems];
            updatedFormItems[index].inputValue = value;
            return updatedFormItems;
        });
    };

    const handleInputConfirm = (index) => {
        form.resetFields();
        setFormItems((prevFormItems) => {
            const updatedFormItems = prevFormItems.map((item) => {
                const updatedItem = {
                    ...item,
                    tags: item.tags.map((tag) => ({ ...tag })),
                };
                return updatedItem;
            });

            const inputValue = updatedFormItems[index].inputValue;

            if (inputValue && inputValue.trim() !== '') {
                const tags = {
                    text: inputValue
                        .split('.')
                        .map((tag) => tag.trim())
                        .filter((tag) => tag !== ''),
                    lang: selectedLanguage,
                };
                updatedFormItems[index].tags.push(tags);
            }
            updatedFormItems[index].inputValue = '';

            return updatedFormItems;
        });
    };

    const handleTagCloseKz = (index, removedTag, tagIndex) => {
        setFormItems((prevFormItems) => {
            const updatedFormItems = prevFormItems.map((item, i) => {
                if (i === index) {
                    const updatedTags = item.tags.map((tag) => {
                        if (tag === removedTag) {
                            const updatedText = tag.text.filter((textElement) => {
                                return textElement !== removedTag.text[0];
                            });

                            return updatedText.length > 0 ? { ...tag, text: updatedText } : null;
                        }

                        return tag;
                    });

                    const filteredTags = updatedTags.filter(Boolean);

                    return filteredTags.length > 0
                        ? { ...item, tags: filteredTags }
                        : { ...item, tags: [] };
                }

                return item;
            });

            return updatedFormItems;
        });
    };

    const seeTagsKz = (formItem, index) => {
        return (
            <>
                {formItem.tags.map(
                    (tag, tagIndex) =>
                        selectedLanguage === 'kz' &&
                        tag.lang === 'kz' && (
                            <>
                                {tag.text.map((text, textIndex) => (
                                    <Tag
                                        key={uuidv4()}
                                        closable
                                        onClose={() => handleTagCloseKz(index, tag, tagIndex)}
                                        style={{
                                            margin: '5px',
                                            borderRadius: '10px',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        <span key={textIndex}>{text}</span>
                                    </Tag>
                                ))}
                            </>
                        ),
                )}
            </>
        );
    };
    const seeTagsRu = (formItem, index) => {
        return (
            <>
                {formItem.tags.map(
                    (tag, tagIndex) =>
                        selectedLanguage === 'ru' &&
                        tag.lang === 'ru' && (
                            <>
                                {tag.text.map((text, textIndex) => (
                                    <Tag
                                        key={uuidv4()}
                                        closable
                                        onClose={() => handleTagCloseKz(index, tag, tagIndex)}
                                        style={{
                                            margin: '5px',
                                            borderRadius: '10px',
                                            whiteSpace: 'normal',
                                        }}
                                    >
                                        <span key={textIndex}>{text}</span>
                                    </Tag>
                                ))}
                            </>
                        ),
                )}
            </>
        );
    };

    useEffect(() => {
        if (!form.isFieldsTouched()) {
            form.resetFields();
        }
    }, [form]);

    return (
        <Modal
            width={572}
            title={
                <Row>
                    <Col xs={19}>
                        {selectedLanguage === 'ru'
                            ? 'Добавление квалификационных требования'
                            : 'Квалификация талаптарын қосу'}
                    </Col>
                    <Col xs={5}>
                        <div style={{ marginLeft: '5px' }}>
                            <Radio.Group
                                defaultValue="ru"
                                size={'small'}
                                style={{ display: 'flex' }}
                            >
                                <Radio.Button
                                    value="ru"
                                    style={{
                                        height: '1.4rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <span style={{ fontSize: '12px' }}>Рус</span>
                                </Radio.Button>
                                <Radio.Button
                                    value="kz"
                                    style={{
                                        height: '1.4rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                >
                                    <span style={{ fontSize: '12px' }}>Қаз</span>
                                </Radio.Button>
                            </Radio.Group>
                        </div>
                    </Col>
                </Row>
            }
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    {selectedLanguage === 'ru' ? 'Отменить' : 'Болдырмау'}
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    {selectedLanguage === 'ru' ? 'Сохранить' : 'Қол қоюға жіберу'}
                </Button>,
            ]}
        >
            <Title level={4} style={{ marginBottom: 20 }}>
                {selectedLanguage === 'ru'
                    ? 'Для добавления нажмите Enter'
                    : 'Қосу үшін Enter пернесін басыңыз'}
            </Title>
            {selectedLanguage === 'ru'
                ? formItems.map((formItem, index) => (
                      <React.Fragment key={index}>
                          <div
                              style={{
                                  marginBottom: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  rowGap: '8px',
                              }}
                          >
                              <Form layout={'vertical'} form={form}>
                                  <Form.Item
                                      label={modalTitles[index]}
                                      name={modalTitles[index]}
                                      // rules={[
                                      //     {
                                      //         required: true,
                                      //         message: <IntlMessage id={'candidates.title.must'} />,
                                      //     },
                                      // ]}
                                  >
                                      <Input
                                          required
                                          type="text"
                                          placeholder="Название"
                                          onChange={(e) => handleInputChange(index, e.target.value)}
                                          onPressEnter={() => handleInputConfirm(index)}
                                      />
                                      <div>{seeTagsRu(formItem, index)}</div>
                                  </Form.Item>
                              </Form>
                          </div>
                      </React.Fragment>
                  ))
                : formItems.map((formItem, index) => (
                      <React.Fragment key={index}>
                          <div
                              style={{
                                  marginBottom: '12px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  rowGap: '8px',
                              }}
                          >
                              <Form layout={'vertical'} form={form}>
                                  <Form.Item
                                      label={modalTitlesKz[index]}
                                      name={modalTitlesKz[index]}
                                      // rules={[
                                      //     {
                                      //         required: true,
                                      //         message: <IntlMessage id={'candidates.title.must'} />,
                                      //     },
                                      // ]}
                                  >
                                      <Input
                                          required
                                          type="text"
                                          placeholder={'Атауы'}
                                          onChange={(e) => handleInputChange(index, e.target.value)}
                                          onPressEnter={() => handleInputConfirm(index)}
                                      />
                                      <div>{seeTagsKz(formItem, index)}</div>
                                  </Form.Item>
                              </Form>
                          </div>
                      </React.Fragment>
                  ))}
        </Modal>
    );
};

export default ModalQualReq;

import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Select } from 'antd';
import IntlMessage from '../../../../../components/util-components/IntlMessage';
import { DeleteOutlined } from '@ant-design/icons';
import ActionsService from 'services/ActionsService';
import { useDispatch, useSelector } from 'react-redux';
import {
    addActionCard,
    addActionsToTag,
    addEmptyCard,
    clearActionCard,
    deleteActionCard,
    deleteActionsInTag,
} from 'store/slices/newConstructorSlices/constructorNewSlice';
import { actionsTemplate } from 'store/slices/candidates/ordersConstructorSlice';

const ActionsCard = () => {
    const [takeActions, setTakeActions] = useState([]);
    const { tagsInfoArray, actionsCard } = useSelector((state) => state.constructorNew);
    const isKkLanguage = localStorage.getItem('lan') === 'kk';
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(actionsTemplate());
    }, []);

    useEffect(() => {
        if (takeActions.length === 0) {
            ActionsService.get_actions().then((r) => {
                setTakeActions(r);
            });
        }
    }, [takeActions]);

    // данные для селекта экшненов
    const actionOptions = takeActions
        .filter((action) => action.action_name !== undefined)
        .map((action) => ({
            value: isKkLanguage ? action.action_nameKZ : action.action_name,
            label: isKkLanguage ? action.action_nameKZ : action.action_name,
        }));

    // выборка экшена
    const handleActionName = (value, id) => {
        const selectedData = takeActions.find(
            (item) => item.action_name === value || item.action_nameKZ === value,
        );

        dispatch(deleteActionsInTag({ id }));

        dispatch(
            addActionCard({
                id,
                data: selectedData,
            }),
        );
    };

    // сборка доступных тегов для экшнов
    const generateOptions = (arg) => {
        const options = tagsInfoArray
            .filter((tag) => tag.actions === undefined)
            .map((tag) => {
                if (arg.data_taken === tag.data_taken && arg.field_name === tag.directory) {
                    return { value: tag.tagname, label: tag.tagname };
                } else if (
                    arg.data_taken === tag.data_taken &&
                    arg.data_type === tag.input_format
                ) {
                    return { value: tag.tagname, label: tag.tagname };
                }
            });

        return options.filter((option) => option !== undefined);
    };

    const handleProperty = (actions, tagname, id, propertyId, card) => {
        dispatch(
            addActionsToTag({ tagname, actions, id, propertyId, actionNames: card.actionsValue }),
        );
    };

    // добавление пустой карты
    useEffect(() => {
        let tagCount = 0;
        let actionCount = 0;
        actionsCard.forEach((action) => {
            if (action.actions.args !== undefined) {
                const keys = Object.keys(action.properties);
                actionCount = actionCount + keys.length;
            }
        });

        tagsInfoArray.forEach((tag) => {
            if (tag.actionId !== undefined) {
                tagCount++;
            }
        });

        if (actionsCard[actionsCard.length - 1].actions.args !== undefined) {
            dispatch(addEmptyCard());
        }
    }, [actionsCard, tagsInfoArray]);

    // получение значение пропертиес
    const setPropertyValue = (ids) => {
        const option = tagsInfoArray.filter(
            (tag) => tag.actionId === ids.actionId && tag.propertyId === ids.propertyId,
        );

        return { value: option[0]?.tagname, label: option[0]?.tagname };
    };

    const deleteCard = (id) => {
        if (id === 0 && actionsCard.length < 3) {
            dispatch(deleteActionsInTag({ id }));
            dispatch(clearActionCard({ id }));
        } else {
            dispatch(deleteActionCard(id));
            dispatch(deleteActionsInTag({ id }));
        }
    };

    const generateActionCard = () => {
        const cards = actionsCard.map((card) => {
            return (
                <Card key={card.id}>
                    <Row justify="start" align="middle">
                        <Col className="text" xs={4}>
                            <IntlMessage id={'constructor.actionTemplate'} />
                        </Col>
                        <Col xs={6}>
                            <Select
                                style={{ width: '100%' }}
                                options={actionOptions}
                                value={
                                    isKkLanguage
                                        ? card?.actionsValue?.nameKZ
                                        : card?.actionsValue?.name
                                }
                                onChange={(value) => handleActionName(value, card.id)}
                            />
                        </Col>
                        <Col xs={6} style={{ marginLeft: 15 }}>
                            <DeleteOutlined
                                onClick={() => deleteCard(card.id)}
                                style={{ cursor: 'pointer' }}
                            />
                        </Col>
                    </Row>
                    {Object.keys(card.properties).length > 0
                        ? Object.keys(card.properties).map((key, index) => {
                              return (
                                  <Row
                                      key={`child-${index}`}
                                      justify="start"
                                      align="middle"
                                      style={{ marginTop: '1%' }}
                                  >
                                      <Col className="text" xs={4}>
                                          {isKkLanguage
                                              ? card.properties[key].alias_nameKZ
                                              : card.properties[key].alias_name}
                                      </Col>
                                      <Col xs={6}>
                                          <Select
                                              style={{ width: '100%' }}
                                              value={setPropertyValue({
                                                  propertyId: index,
                                                  actionId: card.id,
                                              })}
                                              options={generateOptions(card.properties[key])}
                                              onChange={(value) =>
                                                  handleProperty(
                                                      card.properties[key],
                                                      value,
                                                      card.id,
                                                      index,
                                                      card,
                                                  )
                                              }
                                          />
                                      </Col>
                                      {/* <Col
                                xs={13}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'start',
                                    marginLeft: 15,
                                    width: 'fit-content',
                                }}
                            >
                                <Row>
                                    <Tooltip
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0.5,
                                        }}
                                        title={`Выбор только из тегов с параметрами ${
                                            value.selectedChildren[index].data_taken === 'manual'
                                                ? 'ручной'
                                                : 'справочник'
                                        } / ${
                                            value.selectedChildren[index].field_name !== undefined
                                                ? getUniqueValues(
                                                      takeActions.map((el) =>
                                                          getFieldName(el, index, value),
                                                      ),
                                                  )
                                                : getUniqueValues(
                                                      takeActions.map((el) =>
                                                          getDataType(el, index, value),
                                                      ),
                                                  )
                                        }`}
                                    >
                                        <QuestionCircleOutlined />
                                    </Tooltip>
                                </Row>
                            </Col> */}
                                  </Row>
                              );
                          })
                        : null}
                </Card>
            );
        });

        return cards;
    };

    return generateActionCard();
};

export default ActionsCard;

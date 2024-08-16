import { Card, Col, Radio, Row, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { LocalText } from 'components/util-components/LocalizationText/LocalizationText';
import { useDebounce } from 'hooks/useDebounce';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    addLocalStaffDivision,
    editLocalStaffDivision,
} from 'store/slices/schedule/Edit/staffDivision';
import {
    addRemoteStaffDivision,
    editRemoteStaffDivision,
} from 'store/slices/schedule/Edit/staffDivision';
import { change } from 'store/slices/schedule/archiveStaffDivision';
import { embedSubDivisionNode, findSubDivisionNode } from 'utils/schedule/utils';
import { useAppDispatch, useAppSelector } from '../../../../../../../hooks/useStore';
import { components } from 'API/types';

interface Props {
    selectedItem: components['schemas']['ArchiveStaffDivisionRead'];
}

export default function TextAreaCard({ selectedItem }: Props) {
    const dispatch = useAppDispatch();
    const currentLocale = localStorage.getItem('lan');

    const [selectedLanguage, setSelectedLanguage] = useState('ru');
    const [text, setText] = useState(selectedItem?.description?.name);
    const [textKZ, setTextKZ] = useState(selectedItem?.description?.nameKZ);
    const [name, setName] = useState(selectedItem?.name);
    const [nameKZ, setNameKZ] = useState(selectedItem?.nameKZ);
    const [searchParams] = useSearchParams();
    const debouncedTextTerm = useDebounce(text, 200);
    const debouncedTextKzTerm = useDebounce(textKZ, 200);
    const debouncedNameTerm = useDebounce(name, 200);
    const debouncedNameKzTerm = useDebounce(nameKZ, 200);

    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);

    const staffListId = searchParams.get('staffListId');

    const remoteArchiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.remote,
    );
    const localArchiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.local,
    );

    useEffect(() => {
        const getInitialValue = async () => {
            setText(selectedItem?.description?.name);
            setTextKZ(selectedItem?.description?.nameKZ);
            setName(selectedItem?.name);
            setNameKZ(selectedItem?.nameKZ);
        };

        getInitialValue();
    }, [selectedItem.id]);

    useEffect(() => {
        if (
            selectedItem.description?.nameKZ === textKZ &&
            selectedItem.description?.name === text &&
            selectedItem?.name === name &&
            selectedItem?.nameKZ === nameKZ
        )
            return;

        const isLocal = Object.prototype.hasOwnProperty.call(selectedItem, 'isLocal');
        if (staffListId) {
            const newStaffDivision = {
                ...selectedItem,
                ...(isLocal && { isLocal: true }),
                description: {
                    name: text,
                    nameKZ: textKZ,
                },
                name: name,
                nameKZ: nameKZ,
                type_id: selectedItem.type_id,
                type: selectedItem.type,
                staff_division_number: selectedItem.staff_division_number,
                staff_list_id: staffListId,
            };
            if (isLocal) {
                const isExists = localArchiveStaffDivision.find(
                    (staff_div) => staff_div.id === selectedItem?.id,
                );

                if (!isExists)
                    dispatch(
                        addLocalStaffDivision(
                            // @ts-expect-error Accepts
                            newStaffDivision,
                        ),
                    );
                else
                    dispatch(
                        editLocalStaffDivision(
                            // @ts-expect-error Accepts
                            newStaffDivision,
                        ),
                    );
                const found = findSubDivisionNode(
                    archiveStaffDivision,
                    selectedItem.parent_group_id,
                );
                dispatch(
                    change(
                        embedSubDivisionNode(
                            archiveStaffDivision,
                            newStaffDivision,
                            found,
                        ),
                    ),
                );
            } else {
                const isExists = remoteArchiveStaffDivision.find(
                    (staff_div) => staff_div.id === selectedItem?.id,
                );

                if (isExists)
                    dispatch(
                        editRemoteStaffDivision(
                            // @ts-expect-error Accepts
                            newStaffDivision,
                        ),
                    );
                else
                    dispatch(
                        addRemoteStaffDivision(
                            // @ts-expect-error Accepts
                            newStaffDivision,
                        ),
                    );

                const found = findSubDivisionNode(
                    archiveStaffDivision,
                    selectedItem.parent_group_id,
                );
                dispatch(
                    change(
                        embedSubDivisionNode(
                            archiveStaffDivision,
                            newStaffDivision,
                            found,
                        ),
                    ),
                );
            }
        }
    }, [
        debouncedTextKzTerm,
        debouncedTextTerm,
        debouncedNameTerm,
        debouncedNameKzTerm,
        selectedItem.id,
        localArchiveStaffDivision,
        remoteArchiveStaffDivision,
    ]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        if (selectedLanguage === 'ru') {
            setText(newText);
        } else if (selectedLanguage === 'kk') {
            setTextKZ(newText);
        }
    };
    const handleChangeName = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        if (selectedLanguage === 'ru') {
            setName(newText);
        } else if (selectedLanguage === 'kk') {
            setNameKZ(newText);
        }
    };

    useEffect(() => {
        if (currentLocale !== null) {
            setSelectedLanguage(currentLocale);
        }
    }, [currentLocale]);

    return (
        <>
            <Card>
                <Row>
                    <Col xs={22}>
                        <Row gutter={12}>
                            {/*<Col>*/}
                            {/*    <Typography.Title*/}
                            {/*        level={4}*/}
                            {/*        style={{ textAlign: 'center', margin: '10px' }}*/}
                            {/*    >*/}
                            {/*        /!*{LocalText.getName(selectedItem)}*!/*/}
                            {/*        {selectedLanguage === 'ru'*/}
                            {/*            ? selectedItem?.name*/}
                            {/*            : selectedItem?.nameKZ}*/}
                            {/*    </Typography.Title>*/}
                            {/*</Col>*/}
                            <Col>
                                {selectedItem.type !== null && name!==null && nameKZ!==null ? (
                                    <TextArea
                                        autoSize={{
                                            minRows: 1,
                                            maxRows: 2,
                                        }}
                                        key={selectedLanguage}
                                        defaultValue={selectedLanguage === 'ru' ? name : nameKZ}
                                        style={{ width: '200px' }}
                                        onChange={handleChangeName}
                                    />
                                ) : null}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                        <div style={{ float: 'right', cursor: 'pointer' }}>
                            <Radio.Group
                                value={selectedLanguage}
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
                                    value="kk"
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
                <br />
                {text !== ' ' && textKZ !== ' ' && selectedItem && (
                    <TextArea
                        key={selectedItem.id + selectedLanguage}
                        defaultValue={selectedLanguage === 'ru' ? text ?? '' : textKZ ?? ''}
                        autoSize={{
                            minRows: 2,
                            maxRows: 14,
                        }}
                        onChange={handleChange}
                    />
                )}
            </Card>
        </>
    );
}

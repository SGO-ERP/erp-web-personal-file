import { QuestionCircleFilled } from '@ant-design/icons/lib/icons';
import { Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import IntlMessage, {
    IntlMessageText,
} from '../../../../../../components/util-components/IntlMessage';
import { components } from '../../../../../../API/types';
import LocalizationText from '../../../../../../components/util-components/LocalizationText/LocalizationText';

const dep = { dep: 'департамент' };
const upr = { upr: 'управление' };
const otdel = { otdel: 'отдел' };
const uni = { uni: 'универсал' };
const group = { group: 'группа' };

interface Props {
    setNumber: (value: number) => void;
    setType: (type: components['schemas']['StaffDivisionTypeRead']) => void;
    setNameStaffDiv: (name: string) => void;
    setNameStaffDivKZ: (name: string) => void;
    typeDiv: components['schemas']['StaffDivisionTypeRead'][];
    form: FormInstance;
    staffDivision?: components['schemas']['ArchiveStaffDivisionRead'];
}

const AddEditDepartmentWithDivision = ({
    setNumber,
    setType,
    setNameStaffDiv,
    setNameStaffDivKZ,
    form,
    typeDiv,
    staffDivision,
}: Props) => {
    const [name, setName] = useState('');
    const [nameKZ, setNameKZ] = useState('');

    useEffect(() => {
        if (!form.isFieldsTouched()) {
            form.resetFields();
        }
    }, [form]);

    const handle = (e: string) => {
        const foundItem = typeDiv.find((item) => item.id === e);

        if (foundItem) {
            setType(foundItem);
            // setName(foundItem?.name || '');
            // setNameKZ(foundItem?.nameKZ || '');
        }
    };

    // useEffect(() => {
    //     form.setFieldsValue({
    //         name: name,
    //         nameKZ: nameKZ,
    //     });
    // }, [name, nameKZ]);

    return (
        <div>
            <Form form={form} layout="vertical">
                {/*<Form.Item*/}
                {/*    label={*/}
                {/*        <>*/}
                {/*            <IntlMessage id="schedule.number.dep" />*/}
                {/*            <QuestionCircleFilled*/}
                {/*                style={{*/}
                {/*                    color: 'rgba(114, 132, 154, 0.4)',*/}
                {/*                    marginLeft: '5px',*/}
                {/*                }}*/}
                {/*            />*/}
                {/*        </>*/}
                {/*    }*/}
                {/*    name="divisionType"*/}
                {/*    // rules={[*/}
                {/*    //     {*/}
                {/*    //         required: true,*/}
                {/*    //         message: <IntlMessage id={'candidates.title.must'} />,*/}
                {/*    //     },*/}
                {/*    // ]}*/}
                {/*>*/}

                {/*</Form.Item>*/}
                <Form.Item
                    label={
                        <>
                            <IntlMessage id="schedule.add.department.type" />
                            <QuestionCircleFilled
                                style={{
                                    color: 'rgba(114, 132, 154, 0.4)',
                                    marginLeft: '5px',
                                }}
                            />
                        </>
                    }
                    name="divisionTypeName"
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: <IntlMessage id={'candidates.title.must'} />,
                    //     },
                    // ]}
                >
                    <Row gutter={12}>
                        <Col xs={3}>
                            <Input
                                onChange={(e) => {
                                    setNumber(parseInt(e.target.value, 10));
                                }}
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                        </Col>
                        <Col xs={21}>
                            <Select
                                style={{ width: '100%' }}
                                options={typeDiv
                                    .filter((item) => {
                                        if (staffDivision?.type?.name.toLowerCase() === dep.dep) {
                                            return item.name.toLowerCase() !== dep.dep;
                                        } else if (
                                            staffDivision?.type?.name.toLowerCase() === upr.upr
                                        ) {
                                            return (
                                                item.name.toLowerCase() !== upr.upr &&
                                                item.name.toLowerCase() !== dep.dep
                                            );
                                        } else if (
                                            staffDivision?.type?.name.toLowerCase() === otdel.otdel
                                        ) {
                                            return (
                                                item.name.toLowerCase() !== upr.upr &&
                                                item.name.toLowerCase() !== dep.dep &&
                                                item.name.toLowerCase() !== otdel.otdel
                                            );
                                        } else if (
                                            staffDivision?.type === null &&
                                            staffDivision?.parent_group_id === null
                                        ) {
                                            return (
                                                item.name.toLowerCase() !== otdel.otdel &&
                                                item.name.toLowerCase() !== group.group
                                            );
                                        }
                                        return item;
                                    })
                                    .map(
                                        (item: components['schemas']['StaffDivisionTypeRead']) => ({
                                            value: item.id,
                                            label: <LocalizationText text={item} />,
                                        }),
                                    )}
                                onChange={(e) => handle(e)}
                                allowClear
                            />
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item
                    label={
                        <>
                            <IntlMessage id="staffSchedule.modal.departmentNameRu" />
                            <QuestionCircleFilled
                                style={{
                                    color: ' rgba(114, 132, 154, 0.4)',
                                    marginLeft: '5px',
                                }}
                            />
                        </>
                    }
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({ id: 'schedule.qualreq.name' })}
                        onChange={(e) => {
                            setNameStaffDiv(e.target.value);
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label={
                        <>
                            <IntlMessage id="staffSchedule.modal.departmentNameKz" />
                            <QuestionCircleFilled
                                style={{
                                    color: ' rgba(114, 132, 154, 0.4)',
                                    marginLeft: '5px',
                                }}
                            />
                        </>
                    }
                    name="nameKZ"
                    rules={[
                        {
                            required: true,
                            message: <IntlMessage id={'candidates.title.must'} />,
                        },
                    ]}
                    required
                >
                    <Input
                        placeholder={IntlMessageText.getText({ id: 'schedule.qualreq.name' })}
                        onChange={(e) => {
                            setNameStaffDivKZ(e.target.value);
                        }}
                    />
                </Form.Item>
            </Form>
        </div>
    );
};
export default AddEditDepartmentWithDivision;

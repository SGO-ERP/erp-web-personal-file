import { PlusCircleTwoTone } from '@ant-design/icons';
import { Col, Row, Tooltip, Typography } from 'antd';
import IntlMessage from '../../../../../../components/util-components/IntlMessage';
import { LocalText } from '../../../../../../components/util-components/LocalizationText/LocalizationText';

export const StaffUnitScheduleSubstitute = ({
    staff_unit,
    canEditSchedule,
    setType,
    setIsOpenUserRepl,
}) => {
    if (staff_unit.user_replacing == null) {
        return (
            <Row>
                <Col xs={18}>
                    <Typography.Text strong>
                        <IntlMessage id={'scheduel.absent'} />
                    </Typography.Text>
                </Col>
                {canEditSchedule && (
                    <Col
                        xs={6}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'end',
                        }}
                    >
                        <div>
                            <Tooltip title={<IntlMessage id="schedule.add.or.edit.absent" />}>
                                <PlusCircleTwoTone
                                    onClick={() => {
                                        setType('add');
                                        setIsOpenUserRepl(true);
                                    }}
                                />
                            </Tooltip>
                        </div>
                    </Col>
                )}
            </Row>
        );
    }
    return (
        <Row style={{ fontWeight: '500', color: '#1A335' }}>
            <Typography.Text>
                {LocalText.getName(staff_unit.user_replacing.rank)}
                &nbsp;
                <Typography.Text type="secondary">
                    (
                    {staff_unit.user_replacing.last_name +
                        ' ' +
                        staff_unit.user_replacing.first_name.charAt(0)}
                    .
                    {staff_unit?.user_replacing?.father_name !== null &&
                        staff_unit?.user_replacing?.father_name?.charAt(0) + '.'}
                    )
                </Typography.Text>
            </Typography.Text>
        </Row>
    );
};

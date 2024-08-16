import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'antd';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import IntlMessage from 'components/util-components/IntlMessage';
import { useAppSelector } from '../../../../../../hooks/useStore';
import { components } from '../../../../../../API/types';
import { ColumnsType } from 'antd/es/table';
import { concatBySpace } from '../../../../../../utils/format/format';
import { save } from '../../../../../../store/slices/myInfo/myInfoSlice';
import { useSave } from '../../../../../../hooks/schedule/useSave';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    setIsSign: (name: boolean) => void;
    saveOrApprove: 'save' | 'approve';
}

const WithdrawalOrder = ({ isOpen, onClose, setIsSign, saveOrApprove }: Props) => {
    const [current, setCurrent] = React.useState<number>(1);
    const [defaultPageSize] = React.useState<number>(10);
    const [pageSize, setPageSize] = React.useState<number>(10);
    const [showSizeChanger] = React.useState<boolean>(true);

    const users = useAppSelector((state) => state.disposal.remote);
    const { save } = useSave();

    const archiveStaffDivision = useAppSelector((state) => state.archiveStaffDivision.data);
    const [spreadedUsers, setSpreadedUsers] = useState<
        components['schemas']['ArchiveStaffUnitRead'][]
    >([]);

    const handleOk = () => {
        onClose();
        if (saveOrApprove === 'save') {
            save('draft');
        } else if (saveOrApprove === 'approve') {
            setIsSign(true);
        }
    };

    useEffect(() => {
        setSpreadedUsers([
            ...(users as components['schemas']['ArchiveStaffUnitRead'][]),
            ...(archiveStaffDivision[archiveStaffDivision.length ?? 0 - 1]?.staff_units ?? []),
        ]);
    }, [users, archiveStaffDivision]);

    const currentTableColumns: ColumnsType<components['schemas']['ArchiveStaffUnitRead']> = [
        {
            title: 'Субъект',
            dataIndex: ['first_name'],
            render: (text, record) => (
                <div className="d-flex">
                    <AvatarStatus size={40} src={record?.user?.icon} />
                    <div className="mt-2">
                        <p style={{ color: 'black', display: 'block' }}>
                            {concatBySpace([
                                record?.user?.last_name,
                                record?.user?.first_name,
                                record?.user?.father_name,
                            ])}
                        </p>
                    </div>
                </div>
            ),
            width: '40%',
        },
        {
            title: <IntlMessage id={'candidates.currentTable.reason'} />,
            render: (text, record) => <IntlMessage id={'schedule.reason.disposal'} />,
            width: '60%',
        },
    ];

    return (
        <Modal
            title={
                <span>
                    <IntlMessage fallback={'ru'} id={'staffSchedule.modal.withdrawalOrder'} />
                    &nbsp; ({spreadedUsers.length} субъекта)
                </span>
            }
            open={isOpen}
            okText={<IntlMessage id={'continue'} />}
            cancelText={<IntlMessage id={'staffSchedule.cancel'} />}
            onOk={handleOk}
            onCancel={onClose}
            width={1200}
        >
            <Table dataSource={spreadedUsers} columns={currentTableColumns} pagination={false} />
        </Modal>
    );
};

export default WithdrawalOrder;

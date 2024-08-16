import { Form, Input, Modal, notification, Progress, Row, Space, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_PREFIX_PATH } from '../../../../../../configs/AppConfig';
import { PrivateServices } from 'API';
import React, { KeyboardEventHandler, useEffect, useRef, useState } from 'react';
import { InputRef } from 'antd/lib/input';
import { useTranslation } from 'react-i18next';
import { useAsyncCeleryRequest } from 'hooks/useAsyncCeleryRequest/useAsyncCeleryRequest';
import { getDraftStaffDivision } from 'store/slices/schedule/archiveStaffDivision';
import { components } from 'API/types';
import { PERMISSION } from 'constants/permission';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ModalDraft = ({ isOpen, onClose }: Props) => {
    const { t } = useTranslation()

    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const inputRef = useRef<InputRef>(null);
    const staffListId = searchParams.get('staffListId');

    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const myPermissions = useAppSelector((state) => state.profile.permissions);
    const canEditSchedule = myPermissions?.includes(PERMISSION.STAFF_LIST_EDITOR);

    const [taskId, setTaskId] = useState<string | null>(null)

    const statusCheckUrl = `/staff_list/task-status/${taskId}/`
    const {
        data,
        progress,
        error
    } = useAsyncCeleryRequest<components['schemas']['StaffListRead']>({ statusCheckUrl, showLoader })

    useEffect(() => {
        if (!data) {
            return
        }
        setIsLoading(false)

        if (!data.id) {
            return
        }

        navigate(
            `${APP_PREFIX_PATH}/management/schedule/edit?staffListId=${data.id}&mode=edit`,
        );

        dispatch(
            getDraftStaffDivision({
                query: {
                    staff_list_id: data.id,
                },
            }),
        );
        onClose();
    }, [data])

    useEffect(() => {
        if (!isOpen) {
            return
        }
        if (
            typeof inputRef === 'object' &&
            inputRef !== null &&
            inputRef.hasOwnProperty('current') &&
            typeof inputRef.current === 'object' &&
            inputRef.current !== null &&
            inputRef.current.hasOwnProperty('focus') &&
            typeof inputRef.current.focus === 'function'
        ) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!showLoader) {
            return;
        }
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = t('schedule.modal.confirm');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [showLoader]);

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Enter') {
            await handleOk();
        }
    };

    const handleOk = async () => {
        if (!canEditSchedule) {
            notification.error({ message: t('schedule.not.hr') });
            return;
        }
        await form.validateFields();
        setIsLoading(true);

        if (staffListId) {
            PrivateServices.post('/api/v1/staff_list/duplicate/{id}/', {
                params: {
                    path: {
                        id: staffListId,
                    },
                },
                body: {
                    name: form.getFieldValue('name'),
                },
            }).then((response) => {
                navigate(
                    `${APP_PREFIX_PATH}/management/schedule/edit?staffListId=${response.data?.id}&mode=edit`,
                );
            });

            return;
        }
        const response = await PrivateServices.post('/api/v1/staff_list', {
            body: {
                name: form.getFieldValue('name'),
            },
        });

        if (!response?.data?.task_id) {
            return
        }

        setTaskId(response.data.task_id)
        setShowLoader(true);
    };

    if (error) {
        notification.error({ message: t('schdeule.warning') });
    }
    return (
        <Modal
            title={t('schedule.modal.createDraft')}
            open={isOpen}
            okText={t('initiate.create')}
            cancelText={t('candidates.warning.cancel')}
            onCancel={onClose}
            onOk={handleOk}
            okButtonProps={{ disabled: isLoading }}
            cancelButtonProps={{ disabled: isLoading }}
            keyboard={true}
        >
            {showLoader && (
                <Row align="middle" justify="center">
                    <Space
                        direction="vertical"
                        align="center"
                        size="large"
                        style={{ margin: '0 auto' }}
                    >
                        <Progress type="circle" percent={progress} />
                        <Typography>
                            {t("schedule.modal.inProcess")}
                        </Typography>
                    </Space>
                </Row>
            )}
            {!showLoader && (
                <Form layout={'vertical'} form={form}>
                    <Form.Item
                        label={'Название черновика'}
                        required
                        name={'name'}
                        rules={[
                            {
                                required: true,
                                message: t('candidates.title.must'),
                            },
                        ]}
                    >
                        <Input ref={inputRef} onKeyDown={handleKeyDown} />
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default ModalDraft;

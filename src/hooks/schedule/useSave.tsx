import { PrivateServices } from 'API';
import { notification } from 'antd';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import moment from 'moment';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearRemoteDisposal } from 'store/slices/schedule/Edit/disposal';
import {
    clearLocalStaffDivision,
    clearRemoteStaffDivision,
} from 'store/slices/schedule/Edit/staffDivision';
import {
    clearLocalStaffFunction,
    clearRemoteStaffFunction,
} from 'store/slices/schedule/Edit/staffFunctions';
import { clearLocalStaffUnit, clearRemoteStaffUnit } from 'store/slices/schedule/Edit/staffUnit';
import { clearLocalVacancies, clearRemoteVacancies } from 'store/slices/schedule/Edit/vacancy';
import { getDraftStaffDivision } from 'store/slices/schedule/archiveStaffDivision';
import { _processDivisions, buildTree, separate } from 'utils/schedule/utils';
import { asyncCeleryRequest } from '../../auth/asyncCeleryRequest';
import { delay } from '../../utils/helpers/common';
import IntlMessage from '../../components/util-components/IntlMessage';
import { getStaffDivision } from '../../store/slices/schedule/staffDivisionSlice';

export const useSave = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const staffListId = searchParams.get('staffListId');

    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const localArchiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.local,
    );
    const localArchiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.local);
    const localVacancies = useAppSelector((state) => state.editArchiveVacancy.local);
    const localArchiveStaffFunction = useAppSelector((state) => state.editStaffFunction.local);

    const remoteArchiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.remote,
    );
    const remoteArchiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remote);
    const remoteArchiveVacancy = useAppSelector((state) => state.editArchiveVacancy.remote);
    const remoteArchiveStaffFunction = useAppSelector((state) => state.editStaffFunction.remote);

    const removeArchiveStaffDivision = useAppSelector(
        (state) => state.editArchiveStaffDivision.remove,
    );
    const removeArchiveStaffUnit = useAppSelector((state) => state.editArchiveStaffUnit.remove);
    const removeArchiveStaffFunction = useAppSelector((state) => state.editStaffFunction.remove);
    const disposedStaffUnits = useAppSelector((state) => state.disposal.remote);

    // Функция для очистки всех слайсов изменений
    const clearAllChanges = () => {
        dispatch(clearRemoteStaffDivision());
        dispatch(clearRemoteStaffUnit());
        dispatch(clearLocalStaffDivision());
        dispatch(clearLocalStaffUnit());
        dispatch(clearLocalVacancies());
        dispatch(clearRemoteVacancies());
        dispatch(clearLocalStaffFunction());
        dispatch(clearRemoteStaffFunction());
        dispatch(clearRemoteDisposal());
    };

    const deleteDraft = () => {
        if (!staffListId) {
            notification.error({
                message: <IntlMessage id={'warning.delete.draft.schedule'} />,
            });
            return null;
        }
        PrivateServices.del('/api/v1/staff_list/{id}/', {
            params: { path: { id: staffListId } },
        }).then(() => {
            clearAllChanges();
            navigate(`${APP_PREFIX_PATH}/management/schedule/history`);
        });
    };

    const save = async (
        type: 'draft' | 'sign',
        signedBy?: string,
        createdDate?: string,
        rank?: string,
        reqNumber?: string,
        documentLink?: string,
    ) => {
        if (isLoading) {
            notification.warn({
                message: <IntlMessage id={'warning.delay.schedule'} />,
            });
        }
        if (setIsLoading) {
            setIsLoading(true);
        }
        const promises: Promise<any>[] = [];
        if (!staffListId) {
            return;
        }

        // Данная конструкция присваивания используется для того, чтобы при необходимости модифицировать массив, не трогая слайс, так как, слайс не успееет обновиться
        let currenLocalStaffUnits = localArchiveStaffUnit;
        let currentLocalVacancies = localVacancies;
        let currentLocalFunction = localArchiveStaffFunction;
        let currentRemoteStaffDivisions = remoteArchiveStaffDivision;

        // Функция проходится по всем вложенным элементам и для каждого вызывает callback
        // Каждая отработка callback должна возвращать ответ от созданного подразделения, сама функция _processDivisions выдает в callback аргументом createdParentStaffDivision только родитель этого подразделения
        await _processDivisions(
            // Строим дерево из плоского списка
            buildTree(localArchiveStaffDivision),
            // @ts-expect-error parent_group_id may be undefined
            async (
                {
                    name,
                    nameKZ,
                    parent_group_id,
                    id,
                    leader_id,
                    staff_list_id,
                    type_id,
                    staff_division_number,
                    description,
                },
                parent,
                createdParentStaffDivision,
            ) => {
                // Тут находим список созданных staffUnit'ов которые принадлежат именно этому департаменту
                const { found, notFound } = separate(
                    currenLocalStaffUnits,
                    (item) => item.staff_division_id === id,
                );
                // То, что не принадлежит этому подразделению, отсекаем
                currenLocalStaffUnits = notFound;
                // Создаем подразделение, которое принадлежит родительскому подразделению
                const archiveStaffDivision = await PrivateServices.post(
                    '/api/v1/archive_staff_division',
                    {
                        body: {
                            ...(parent === null
                                ? parent_group_id && { parent_group_id }
                                : createdParentStaffDivision && {
                                      parent_group_id: createdParentStaffDivision.id,
                                  }),
                            name: name as string,
                            nameKZ,
                            staff_list_id,
                            type_id,
                            staff_division_number,
                            description,
                        },
                    },
                );
                // Может быть такое, что пользователь перетащит уже имеющуеся подразделение на сервере, пихнуть в существующий только на локалке подразделение, для такого случая, находим массив вложенных подразделении которые вложены в подразделение, которое пока только на локалке.
                const { found: foundRemoteDivisions, notFound: notFoundRemoteDivisions } = separate(
                    currentRemoteStaffDivisions,
                    (item) => item.parent_group_id === id,
                );

                foundRemoteDivisions.forEach(
                    ({ name, nameKZ, description, staff_list_id, id, leader_id, type_id }) => {
                        promises.push(
                            PrivateServices.put('/api/v1/archive_staff_division/{id}/', {
                                params: {
                                    path: {
                                        id,
                                    },
                                },
                                body: {
                                    parent_group_id: archiveStaffDivision.data?.id,
                                    name,
                                    nameKZ,
                                    staff_list_id,
                                    description,
                                    leader_id,
                                    type_id,
                                },
                            }),
                        );
                    },
                );
                // Убираем из списка те подразделения, которые уже были отредактированы
                currentRemoteStaffDivisions = notFoundRemoteDivisions;
                for (const { user_id, position_id, user_replacing_id, id, requirements } of found) {
                    // Создаем должности, которые принадлежат этому подразделению
                    if (
                        position_id &&
                        archiveStaffDivision &&
                        archiveStaffDivision.data &&
                        archiveStaffDivision.data.id
                    ) {
                        const createdStaffUnit = await PrivateServices.post(
                            '/api/v1/archive_staff_unit',
                            {
                                body: {
                                    position_id: position_id,
                                    staff_division_id: archiveStaffDivision.data.id,
                                    user_id,
                                    user_replacing_id,
                                    requirements,
                                },
                            },
                        );
                        if (createdStaffUnit.data !== undefined)
                            if (createdStaffUnit.data.id === leader_id)
                                // Если id должности совпадает с leader_id подразделения, то редактируем созданное родительское подразделение и привязываем его к leader_id
                                await PrivateServices.put('/api/v1/archive_staff_division/{id}/', {
                                    params: {
                                        path: {
                                            id: archiveStaffDivision.data.id,
                                        },
                                    },
                                    body: {
                                        ...(parent === null
                                            ? parent_group_id && { parent_group_id }
                                            : createdParentStaffDivision && {
                                                  parent_group_id: createdParentStaffDivision.id,
                                              }),
                                        name,
                                        nameKZ,
                                        staff_list_id,
                                        leader_id: createdStaffUnit.data.id,
                                        staff_division_number,
                                        type_id,
                                    },
                                });
                        // Находим функции, которые принадлежат этой должности
                        const { found: foundFunctions, notFound: notFoundFunctions } = separate(
                            currentLocalFunction,
                            (item) => item.staff_unit_id === id,
                        );

                        currentLocalFunction = notFoundFunctions;
                        // Создаем найденные функции
                        for (const _function of foundFunctions) {
                            const createdFunction = await PrivateServices.post(
                                '/api/v1/archive_service_staff_function',
                                {
                                    body: {
                                        name: _function.name,
                                        nameKZ: _function.nameKZ,
                                        hours_per_week: _function.hours_per_week,
                                    },
                                },
                            );
                            if (
                                createdStaffUnit.data &&
                                createdFunction.data &&
                                createdStaffUnit.data.id &&
                                createdFunction.data.id
                            )
                                // Привязываем созданные функции
                                await PrivateServices.post(
                                    '/api/v1/archive_staff_unit/add-service-staff-function',
                                    {
                                        body: {
                                            staff_unit_id: createdStaffUnit.data.id,
                                            staff_function_ids: [createdFunction.data.id],
                                        },
                                    },
                                );
                        }

                        const foundVacancy = currentLocalVacancies.find(
                            (item) => item.staff_unit_id === id,
                        );
                        const notFoundVacancy = currentLocalVacancies.filter(
                            (item) => item.staff_unit_id !== id,
                        );

                        currentLocalVacancies = notFoundVacancy;
                        if (
                            createdStaffUnit &&
                            createdStaffUnit.data &&
                            foundVacancy?.staff_unit_id &&
                            createdStaffUnit.data.id
                        ) {
                            await PrivateServices.post('/api/v1/hr_vacancies/archieve-staff-unit', {
                                body: {
                                    is_active: foundVacancy?.is_active ?? false,
                                    staff_unit_id: createdStaffUnit.data.id,
                                },
                            });
                        }
                    }
                }

                return {
                    createdStaffDivision: archiveStaffDivision.data,
                };
            },
        );

        remoteArchiveStaffFunction.forEach((item) => {
            // @ts-expect-error isParentLocal and discriminator is has in this item
            const clone = (({ id,isParentLocal,staff_unit_id,discriminator, ...o }) => o)(item);

            promises.push(
                PrivateServices.put('/api/v1/archive_service_staff_function/{id}/', {
                    params: {
                        path: {
                            id: item.id,
                        },
                    },
                    body: clone,
                }),
            );
        });

        removeArchiveStaffFunction.forEach(({ staff_unit_id, id }) => {
            promises.push(
                PrivateServices.post('/api/v1/archive_staff_unit/remove-service-staff-function', {
                    body: { staff_unit_id, staff_function_ids: [id] },
                }).then(async () => {
                    await PrivateServices.del('/api/v1/archive_service_staff_function/{id}/', {
                        params: {
                            path: {
                                id,
                            },
                        },
                    });
                }),
            );
        });

        for (const {
            user_id,
            position_id,
            staff_division_id,
            requirements,
            user_replacing_id,
            id,
            curator_of_id,
        } of currenLocalStaffUnits) {
            if (position_id && staff_division_id) {
                const _createdStaffUnit = await PrivateServices.post('/api/v1/archive_staff_unit', {
                    body: {
                        position_id,
                        staff_division_id,
                        user_id,
                        requirements,
                        user_replacing_id,
                        curator_of_id,
                    },
                });

                // eslint-disable-next-line no-loop-func
                for (const remoteStaffDivision of currentRemoteStaffDivisions) {
                    if (_createdStaffUnit.data?.id && remoteStaffDivision.leader_id === id) {
                        currentRemoteStaffDivisions = currentRemoteStaffDivisions.filter(
                            (item) => item.id !== remoteStaffDivision.id,
                        );
                        await PrivateServices.put('/api/v1/archive_staff_division/{id}/', {
                            params: {
                                path: {
                                    id: remoteStaffDivision.id,
                                },
                            },
                            body: {
                                ...remoteStaffDivision,
                                leader_id: _createdStaffUnit.data.id,
                            },
                        });
                    }
                }

                const { found: foundFunctions, notFound: notFoundFunctions } = separate(
                    currentLocalFunction,
                    (item) => item.staff_unit_id === id,
                );
                currentLocalFunction = notFoundFunctions;

                for (const _function of foundFunctions) {
                    const createdFunction = await PrivateServices.post(
                        '/api/v1/archive_service_staff_function',
                        {
                            body: {
                                name: _function.name,
                                nameKZ: _function.nameKZ,
                                hours_per_week: _function.hours_per_week,
                            },
                        },
                    );
                    if (
                        _createdStaffUnit.data &&
                        createdFunction.data &&
                        _createdStaffUnit.data.id &&
                        createdFunction.data.id
                    ) {
                        await PrivateServices.post(
                            '/api/v1/archive_staff_unit/add-service-staff-function',
                            {
                                body: {
                                    staff_unit_id: _createdStaffUnit.data.id,
                                    staff_function_ids: [createdFunction.data.id],
                                },
                            },
                        );
                    }
                }
                const foundVacancy = currentLocalVacancies.find(
                    (item) => item.staff_unit_id === id,
                );

                const notFoundVacancy = currentLocalVacancies.filter(
                    (item) => item.staff_unit_id !== id,
                );
                currentLocalVacancies = notFoundVacancy;
                if (_createdStaffUnit.data && _createdStaffUnit.data.id) {
                    await PrivateServices.post('/api/v1/hr_vacancies/archieve-staff-unit', {
                        body: {
                            is_active: foundVacancy?.is_active ?? false,
                            staff_unit_id: _createdStaffUnit.data.id,
                        },
                    });
                }
            }
        }
        // Создание вакансии
        currentLocalVacancies.forEach(({ isStaffUnitLocal, is_active, staff_unit_id }) => {
            if (!isStaffUnitLocal && staff_unit_id) {
                promises.push(
                    PrivateServices.post('/api/v1/hr_vacancies/archieve-staff-unit', {
                        body: { is_active: is_active ?? false, staff_unit_id },
                    }),
                );
            }
        });

        // Создаем функцию
        for (const { staff_unit_id, name, hours_per_week, nameKZ } of currentLocalFunction) {
            const createdFunction = await PrivateServices.post(
                '/api/v1/archive_service_staff_function',
                {
                    body: {
                        name,
                        nameKZ,
                        hours_per_week: hours_per_week,
                    },
                },
            );
            if (createdFunction.data && createdFunction.data.id)
                await PrivateServices.post(
                    // Привязываем созданную функцию к staffUnit
                    '/api/v1/archive_staff_unit/add-service-staff-function',
                    {
                        body: { staff_unit_id, staff_function_ids: [createdFunction.data.id] },
                    },
                );
        }

        // Редактирование staffUnits
        remoteArchiveStaffUnit.forEach(
            ({
                user_id,
                position,
                position_id,
                staff_division_id,
                id,
                user_replacing_id,
                requirements,
                ...rest
            }) => {
                if (position?.id && position_id && staff_division_id)
                    promises.push(
                        PrivateServices.put('/api/v1/archive_staff_unit/{id}/', {
                            params: {
                                path: {
                                    id,
                                },
                            },
                            body: {
                                position_id: position_id,
                                staff_division_id,
                                user_replacing_id,
                                user_id,
                                requirements,
                                ...rest,
                            },
                        }),
                    );
            },
        );

        // Редактирование существующей вакансии
        remoteArchiveVacancy.forEach((item) => {
            promises.push(
                PrivateServices.put('/api/v1/hr_vacancies/{id}/archieve-staff-unit', {
                    params: {
                        path: {
                            id: item.id,
                        },
                    },
                    body: {
                        ...item,
                        staff_unit_id: item.staff_unit_id,
                    },
                }),
            );
        });

        // Редактируем подразделение
        currentRemoteStaffDivisions.forEach(
            ({
                parent_group_id,
                name,
                nameKZ,
                description,
                staff_list_id,
                id,
                leader_id,
                staff_division_number,
                type_id,
            }) => {
                promises.push(
                    PrivateServices.put('/api/v1/archive_staff_division/{id}/', {
                        params: {
                            path: {
                                id,
                            },
                        },
                        body: {
                            ...(parent_group_id && { parent_group_id }),
                            name,
                            nameKZ,
                            staff_list_id,
                            description,
                            leader_id,
                            staff_division_number,
                            type_id,
                        },
                    }).then(async (response) => {
                        // const foundVacancy = remoteArchiveVacancy.find(
                        // (item) => item.staff_unit_id === id,
                        // );
                        // if (
                        // foundVacancy?.staff_unit_id &&
                        // response.data?.staff_units &&
                        // response.data?.staff_units[0].id
                        // ) {
                        // await PrivateServices.post('/api/v1/hr_vacancies/archieve-staff-unit', {
                        // body: {
                        // is_active: foundVacancy?.is_active ?? true,
                        // staff_unit_id: response.data.staff_units[0]?.id,
                        // },
                        // });
                        // }
                    }),
                );
            },
        );

        // Формируем список на распоряжение
        const staffUnitIds = disposedStaffUnits
            .filter((item) => item !== undefined)
            .map((item) => item.id) as string[];

        if (staffUnitIds.length > 0) {
            promises.push(
                PrivateServices.put('/api/v1/archive_staff_unit/disposition/all/', {
                    body: {
                        staff_list_id: staffListId,
                        staff_unit_ids: [
                            ...staffUnitIds,
                            ...removeArchiveStaffUnit.map((item) => item.id),
                        ],
                    },
                }),
            );

            // Дожидаемся конца всех запросов
            await Promise.all(promises);
        }
        // Удаление подразделении
        // removeArchiveStaffDivision.forEach(({ id }) => {
        //     promises.push(
        //         PrivateServices.del('/api/v1/archive_staff_division/{id}/', {
        //             params: {
        //                 path: {
        //                     id,
        //                 },
        //             },
        //         }),
        //     );
        // });

        async function delStaffDiv() {
            for (const { id } of removeArchiveStaffDivision) {
                promises.push(
                    PrivateServices.del('/api/v1/archive_staff_division/{id}/', {
                        params: {
                            path: {
                                id,
                            },
                        },
                    }),
                );
            }

            await Promise.all(promises);
        }

        // Вызываем асинхронную функцию
        await delStaffDiv();

        // // Удаление staffUnits
        // removeArchiveStaffUnit.forEach(({ id }) => {
        //     promises.push(
        //         PrivateServices.del('/api/v1/archive_staff_unit/{id}/', {
        //             params: {
        //                 path: {
        //                     id,
        //                 },
        //             },
        //         }),
        //     );
        // });

        async function delStaffUnit() {
            for (const { id } of removeArchiveStaffUnit) {
                promises.push(
                    PrivateServices.del('/api/v1/archive_staff_unit/{id}/', {
                        params: {
                            path: {
                                id,
                            },
                        },
                    }),
                );
            }

            await Promise.all(promises);
        }

        // Вызываем асинхронную функцию
        await delStaffUnit();

        if (type === 'draft') {
            setTimeout(async () => {
                // Ждем еще одну секунду, чтобы сервер успел все изменения отработать и стираем все изменения на локалке и обновляем слайс черновика
                clearAllChanges();
                await dispatch(
                    getDraftStaffDivision({
                        query: {
                            staff_list_id: staffListId,
                        },
                    }),
                );
                if (setIsLoading) {
                    setIsLoading(false);
                }
            }, 1000);
        }

        if (staffListId && type === 'sign' && signedBy && createdDate) {
            const response = await PrivateServices.post('/api/v1/staff_list/apply/{id}/', {
                params: {
                    path: {
                        id: staffListId,
                    },
                    query: {
                        signed_by: signedBy,
                        document_creation_date: moment(createdDate).format('YYYY-MM-DD'),
                        rank: rank as string,
                        document_number: reqNumber as string,
                        document_link: documentLink as string,
                    },
                },
            });

            const taskId: string = response.data?.task_id || '';

            asyncCeleryRequest(`/staff_list/task-status/${taskId}/`, setProgress).then(
                async () => {
                    await delay(1000);
                    clearAllChanges();
                    await dispatch(
                        getDraftStaffDivision({
                            query: {
                                staff_list_id: staffListId,
                            },
                        }),
                    );
                    await dispatch(
                        getStaffDivision({
                            query: {},
                        }),
                    );
                    if (setIsLoading) {
                        setIsLoading(false);
                    }
                    navigate(`${APP_PREFIX_PATH}/management/schedule/history`);
                    notification.success({
                        message: <IntlMessage id={'warning.update.schedule'} />,
                    });
                },
            );
        }
    };

    return { save, isLoading, clearAllChanges, deleteDraft, progress };
};

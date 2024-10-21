import React, { useRef, useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Dialog } from 'primereact/dialog';
import { showToastError, showToastSuccess } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import styles from './Index.module.scss';

import {
    useGetServicesQuery,
    useCreateServiceMutation,
    useDeleteServiceMutation,
    useEditServiceMutation,

    useGetRolesQuery,
    useCreateRoleMutation,
    useDeleteRoleMutation,
    useEditRoleMutation,

    useGetPetTypesQuery,
    useCreatePetTypeMutation,
    useDeletePetTypeMutation,
    useEditPetTypeMutation,

    useGetCoatColorsQuery,
    useCreateCoatColorMutation,
    useDeleteCoatColorMutation,
    useEditCoatColorMutation,

    useGetCoatTypesQuery,
    useCreateCoatTypeMutation,
    useDeleteCoatTypeMutation,
    useEditCoatTypeMutation,

    useGetBreedsQuery,
    useCreateBreedMutation,
    useDeleteBreedMutation,
    useEditBreedMutation,
} from '../../../store/api/administrationApi'


const AdministrationComponent = () => {
	const current_pet_id = localStorage.getItem('current_pet_id');
	const toast = useRef(null);
	const [selectedTableRow, setSelectedTableRow] = useState(null)

    const {
        data: services,
        refetch: refetchServices
    } = useGetServicesQuery()

    const {
        data: roles,
        refetch: refetchRoles
    } = useGetRolesQuery()

    const {
        data: petTypes,
        refetch: refetchPetTypes
    } = useGetPetTypesQuery()

    const {
        data: coatColors,
        refetch: refetchCoatColors
    } = useGetCoatColorsQuery()

    const {
        data: coatTypes,
        refetch: refetchCoatTypes
    } = useGetCoatTypesQuery()

    const {
        data: breeds,
        refetch: refetchBreeds
    } = useGetBreedsQuery()


    useEffect(() => {
        console.log('COLORS', coatColors)
    }, [coatColors])


	// Таблица SERVICES

    const menuSERVICES = useRef(null)

    const actionsOverlaySERVICES = (event, rowData) => {
		menuSERVICES?.current?.toggle(event)
		setSelectedTableRow(rowData)
	}

    const actionsMenuDataSERVICES = [
		{
			label: 'Редактировать',
			icon: 'pi pi-user-edit',
			command: () => {
                openEditServiceDialog()
			}
		},
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: () => {
                setServiceDeleteDialogVisible(true)
            }
        },
	]

	const servicesHeader = () => {
        return (
			<div className={styles['table-header']}>
                <h2>Услуги</h2>
				<Button onClick={() => {setServiceCreateDialogVisible(true)}} icon='pi pi-plus' label='Добавить услугу'></Button>
			</div>
        );
    };

    const displayActionsSERVICES = (rowData) => {
		return (
			<>
				<TieredMenu
					model={actionsMenuDataSERVICES}
					popup
					ref={menuSERVICES}
					id='popup_menu'
					className='vm-actions'
					style={{ width: 'auto' }}
				/>
				<Button
					onClick={(event) => actionsOverlaySERVICES(event, rowData)}
					icon='pi pi-ellipsis-v'
					className='p-button-rounded actions-button'
				/>
			</>
		)
	}

    // СОздание услуги

    const [serviceCreateDialogVisible, setServiceCreateDialogVisible] = useState(false)
    const [serviceName, setServiceName] = useState('')
    
    const [createService, { isLoading: createServiceIsLoading }] = useCreateServiceMutation()

    const serviceCreateActionHandler = () => {
        if (serviceName !== '') {
            createServiceAction()
        }
    }

    const createServiceAction = async () => {
        await createService({
            body: {
                name: serviceName
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Услуга добавлена в систему', 5000))
            setServiceCreateDialogVisible(false)
            refetchServices()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания услуги')
        })
    }

    const serviceCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setServiceCreateDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />

            <Button label="Сохранить" icon="pi pi-check" onClick={() => serviceCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление услуги

    const [deleteService, { isLoading: deleteServiceIsLoading }] = useDeleteServiceMutation()
    const [serviceDeleteDialogVisible, setServiceDeleteDialogVisible] = useState(false)

    const serviceDeleteActionHandler = async (id) => {
        await deleteService({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Услуга удалена из системы', 5000))
            setServiceDeleteDialogVisible(false)
            refetchServices()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления услуги')
        })
    }

    const serviceDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setServiceDeleteDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => serviceDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );


    // Редактирование услуги

    const [newServiceName, setNewServiceName] = useState('')
    const [serviceEditDialogVisible, setServiceEditDialogVisible] = useState(false)

    const openEditServiceDialog = () => {
        setNewServiceName(selectedTableRow?.name)
        setServiceEditDialogVisible(true)
    }

    const serviceEditActionHandler = () => {
        if (newServiceName !== '') {
            serviceEditAction()
        }
    }

    const [editService, { isLoading: editServiceIsLoading }] = useEditServiceMutation()

    const serviceEditAction = async () => {
        await editService({
            body: {
                name: newServiceName
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Услуга изменена', 5000))
            setServiceEditDialogVisible(false)
            refetchServices()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения услуги')
        })
    }

    const serviceEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setServiceEditDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => serviceEditActionHandler()} className="p-button-submit" />
        </div>
    );

    // Таблица ROLES

    const menuROLES = useRef(null)

    const actionsOverlayROLES = (event, rowData) => {
		menuROLES?.current?.toggle(event)
		setSelectedTableRow(rowData)
	}

    const actionsMenuDataROLES = [
		{
			label: 'Редактировать',
			icon: 'pi pi-user-edit',
			command: () => {
                openEditRoleDialog()
			}
		},
        {
			label: 'Удалить',
			icon: 'pi pi-trash',
			command: () => {
                setRoleDeleteDialogVisible(true)
			}
		},
	]


    const rolesHeader = () => {
        return (
			<div className={styles['table-header']}>
                <h2>Роли</h2>
				<Button onClick={() => {
                    setRoleCreateDialogVisible(true)
                }} icon='pi pi-plus' label='Добавить роль'></Button>
			</div>
        );
    };

    const displayActionsROLES = (rowData) => {
		return (
			<>
				<TieredMenu
					model={actionsMenuDataROLES}
					popup
					ref={menuROLES}
					id='popup_menu'
					className='vm-actions'
					style={{ width: 'auto' }}
				/>
				<Button
					onClick={(event) => actionsOverlayROLES(event, rowData)}
					icon='pi pi-ellipsis-v'
					className='p-button-rounded actions-button'
				/>
			</>
		)
	}

    // Создание роли

    const [roleCreateDialogVisible, setRoleCreateDialogVisible] = useState(false)
    const [roleName, setRoleName] = useState('')

    const [createRole, { isLoading: createRoleIsLoading }] = useCreateRoleMutation()

    const roleCreateActionHandler = () => {
        setRoleCreateDialogVisible(true)

        if (roleName !== '') {
            createRoleAction()
        }
    }

    const createRoleAction = async () => {
        await createRole({
            body: {
                role_name: roleName
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Роль добавлена в систему', 5000))
            setRoleCreateDialogVisible(false)
            refetchRoles()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания роли')
        })
    }

    const roleCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setRoleCreateDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => roleCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление роли

    const [deleteRole, { isLoading: deleteRoleIsLoading }] = useDeleteRoleMutation()
    const [roleDeleteDialogVisible, setRoleDeleteDialogVisible] = useState(false)

    const roleDeleteActionHandler = async (id) => {
        await deleteRole({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Роль удалена из системы', 5000))
            setRoleDeleteDialogVisible(false)
            refetchRoles()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления роли')
        })
    }

    const roleDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setRoleDeleteDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => roleDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );

    // Редактирование роли

    const [newRoleName, setNewRoleName] = useState('')
    const [roleEditDialogVisible, setRoleEditDialogVisible] = useState(false)

    const openEditRoleDialog = () => {
        setNewRoleName(selectedTableRow?.role_name)
        setRoleEditDialogVisible(true)
    }

    const roleEditActionHandler = () => {
        if (newRoleName !== '') {

            roleEditAction()
        }
    }

    const [editRole, { isLoading: editRoleIsLoading }] = useEditRoleMutation()

    const roleEditAction = async () => {
        await editRole({
            body: {
                role_name: newRoleName
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Роль изменена', 5000))
            setRoleEditDialogVisible(false)
            refetchRoles()
        }
        )
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения роли')
        })
    }

    const roleEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setRoleEditDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => roleEditActionHandler()} className="p-button-submit" />
        </div>
    );


    // Таблица PET_TYPES

    const menuPET_TYPES = useRef(null)

    const actionsOverlayPET_TYPES = (event, rowData) => {
        menuPET_TYPES?.current?.toggle(event)
        setSelectedTableRow(rowData)
    }

    const actionsMenuDataPET_TYPES = [
        {
            label: 'Редактировать',
            icon: 'pi pi-user-edit',
            command: () => {
                openEditPetTypeDialog()
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: () => {
                setPetTypeDeleteDialogVisible(true)
            }
        },
    ]

    const petTypesHeader = () => {
        return (
            <div className={styles['table-header']}>
                <h2>Виды животных</h2>
                <Button onClick={() => {
                    setPetTypeCreateDialogVisible(true)
                }} icon='pi pi-plus' label='Добавить вид животных'></Button>
            </div>
        );
    }

    const displayActionsPET_TYPES = (rowData) => {
        return (
            <>
                <TieredMenu
                    model={actionsMenuDataPET_TYPES}
                    popup
                    ref={menuPET_TYPES}
                    id='popup_menu'
                    className='vm-actions'
                    style={{ width: 'auto' }}
                />
                <Button
                    onClick={(event) => actionsOverlayPET_TYPES(event, rowData)}
                    icon='pi pi-ellipsis-v'
                    className='p-button-rounded actions-button'
                />
            </>
        )
    }     

    // Создание вида животных

    const [petTypeCreateDialogVisible, setPetTypeCreateDialogVisible] = useState(false)
    const [petTypeName, setPetTypeName] = useState('')

    const [createPetType, { isLoading: createPetTypeIsLoading }] = useCreatePetTypeMutation()

    const petTypeCreateActionHandler = () => {
        if (petTypeName !== '') {
            createPetTypeAction()
        }
    }

    const createPetTypeAction = async () => {
        await createPetType({
            body: {
                pet_type_name: petTypeName
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Вид животных добавлен в систему', 5000))
            setPetTypeCreateDialogVisible(false)
            refetchPetTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания вида животных')
        })
    }

    const petTypeCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setPetTypeCreateDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => petTypeCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление вида животных

    const [deletePetType, { isLoading: deletePetTypeIsLoading }] = useDeletePetTypeMutation()
    const [petTypeDeleteDialogVisible, setPetTypeDeleteDialogVisible] = useState(false)

    const petTypeDeleteActionHandler = async (id) => {
        await deletePetType({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Вид животных удален из системы', 5000))
            setPetTypeDeleteDialogVisible(false)
            refetchPetTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления вида животных')
        })
    }

    const petTypeDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setPetTypeDeleteDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => petTypeDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );

    // Редактирование вида животных

    const [newPetTypeName, setNewPetTypeName] = useState('')
    const [petTypeEditDialogVisible, setPetTypeEditDialogVisible] = useState(false)

    const openEditPetTypeDialog = () => {
        setNewPetTypeName(selectedTableRow?.pet_type_name)
        setPetTypeEditDialogVisible(true)
    }

    const petTypeEditActionHandler = () => {
        if (newPetTypeName !== '') {
            petTypeEditAction()
        }
    }

    const [editPetType, { isLoading: editPetTypeIsLoading }] = useEditPetTypeMutation()

    const petTypeEditAction = async () => {
        await editPetType({

            body: {
                pet_type_name: newPetTypeName
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Вид животных изменен', 5000))
            setPetTypeEditDialogVisible(false)
            refetchPetTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения вида животных')
        })
    }

    const petTypeEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setPetTypeEditDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => petTypeEditActionHandler()} className="p-button-submit" />
        </div>
    );



    // Таблица COAT_COLORS

    const menuCOAT_COLORS = useRef(null)

    const actionsOverlayCOAT_COLORS = (event, rowData) => {
        menuCOAT_COLORS?.current?.toggle(event)
        setSelectedTableRow(rowData)
    }

    const actionsMenuDataCOAT_COLORS = [
        {
            label: 'Редактировать',
            icon: 'pi pi-user-edit',
            command: () => {
                openEditCoatColorDialog()
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: () => {
                setCoatColorDeleteDialogVisible(true)
            }
        },
    ]

    const coatColorsHeader = () => {
        return (
            <div className={styles['table-header']}>
                <h2>Цвета шерсти</h2>
                <Button onClick={() => {
                    setCoatColorCreateDialogVisible(true)
                }} icon='pi pi-plus' label='Добавить цвет шерсти'></Button>
            </div>
        );
    }

    const displayActionsCOAT_COLORS = (rowData) => {
        return (
            <>
                <TieredMenu
                    model={actionsMenuDataCOAT_COLORS}
                    popup
                    ref={menuCOAT_COLORS}
                    id='popup_menu'
                    className='vm-actions'
                    style={{ width: 'auto' }}
                />
                <Button

                    onClick={(event) => actionsOverlayCOAT_COLORS(event, rowData)}
                    icon='pi pi-ellipsis-v'
                    className='p-button-rounded actions-button'
                />
            </>
        )
    }

    // Создание цвета шерсти

    const [coatColorCreateDialogVisible, setCoatColorCreateDialogVisible] = useState(false)
    const [coatColorName, setCoatColorName] = useState('')

    const [createCoatColor, { isLoading: createCoatColorIsLoading }] = useCreateCoatColorMutation()

    const coatColorCreateActionHandler = () => {
        if (coatColorName !== '') {
            createCoatColorAction()
        }
    }

    const createCoatColorAction = async () => {
        await createCoatColor({
            body: {
                coat_color: coatColorName
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Цвет шерсти добавлен в систему', 5000))
            setCoatColorCreateDialogVisible(false)
            refetchCoatColors()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания цвета шерсти')
        })
    }

    const coatColorCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatColorCreateDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => coatColorCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление цвета шерсти

    const [deleteCoatColor, { isLoading: deleteCoatColorIsLoading }] = useDeleteCoatColorMutation()

    const [coatColorDeleteDialogVisible, setCoatColorDeleteDialogVisible] = useState(false)

    const coatColorDeleteActionHandler = async (id) => {
        await deleteCoatColor({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Цвет шерсти удален из системы', 5000))
            setCoatColorDeleteDialogVisible(false)
            refetchCoatColors()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления цвета шерсти')
        })
    }

    const coatColorDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatColorDeleteDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => coatColorDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );

    // Редактирование цвета шерсти

    const [newCoatColorName, setNewCoatColorName] = useState('')
    const [coatColorEditDialogVisible, setCoatColorEditDialogVisible] = useState(false)

    const openEditCoatColorDialog = () => {
        setNewCoatColorName(selectedTableRow?.color_name)
        setCoatColorEditDialogVisible(true)
    }

    const coatColorEditActionHandler = () => {
        if (newCoatColorName !== '') {
            coatColorEditAction()
        }
    }

    const [editCoatColor, { isLoading: editCoatColorIsLoading }] = useEditCoatColorMutation()

    const coatColorEditAction = async () => {
        await editCoatColor({
            body: {
                coat_color: newCoatColorName
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Цвет шерсти изменен', 5000))
            setCoatColorEditDialogVisible(false)
            refetchCoatColors()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения цвета шерсти')
        })
    }

    const coatColorEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatColorEditDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => coatColorEditActionHandler()} className="p-button-submit" />
        </div>
    );

    // Таблица COAT_TYPES

    const menuCOAT_TYPES = useRef(null)

    const actionsOverlayCOAT_TYPES = (event, rowData) => {
        menuCOAT_TYPES?.current?.toggle(event)
        setSelectedTableRow(rowData)
    }

    const actionsMenuDataCOAT_TYPES = [
        {
            label: 'Редактировать',
            icon: 'pi pi-user-edit',
            command: () => {
                openEditCoatTypeDialog()
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: () => {
                setCoatTypeDeleteDialogVisible(true)
            }
        },
    ]

    const coatTypesHeader = () => {
        return (
            <div className={styles['table-header']}>
                <h2>Типы шерсти</h2>
                <Button onClick={() => {
                    setCoatTypeCreateDialogVisible(true)
                }} icon='pi pi-plus' label='Добавить тип шерсти'></Button>
            </div>
        );
    }

    const displayActionsCOAT_TYPES = (rowData) => {
        return (
            <>
                <TieredMenu
                    model={actionsMenuDataCOAT_TYPES}
                    popup
                    ref={menuCOAT_TYPES}
                    id='popup_menu'
                    className='vm-actions'
                    style={{ width: 'auto' }}
                />
                <Button
                    onClick={(event) => actionsOverlayCOAT_TYPES(event, rowData)}
                    icon='pi pi-ellipsis-v'
                    className='p-button-rounded actions-button'
                />
            </>
        )
    }

    // Создание типа шерсти

    const [coatTypeCreateDialogVisible, setCoatTypeCreateDialogVisible] = useState(false)
    const [coatTypeName, setCoatTypeName] = useState('')

    const [createCoatType, { isLoading: createCoatTypeIsLoading }] = useCreateCoatTypeMutation()

    const coatTypeCreateActionHandler = () => {
        if (coatTypeName !== '') {
            createCoatTypeAction()
        }
    }

    const createCoatTypeAction = async () => {
        await createCoatType({
            body: {
                coat_type_name: coatTypeName
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Тип шерсти добавлен в систему', 5000))
            setCoatTypeCreateDialogVisible(false)
            refetchCoatTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания типа шерсти')
        })
    }

    const coatTypeCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatTypeCreateDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => coatTypeCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление типа шерсти

    const [deleteCoatType, { isLoading: deleteCoatTypeIsLoading }] = useDeleteCoatTypeMutation()
    const [coatTypeDeleteDialogVisible, setCoatTypeDeleteDialogVisible] = useState(false)

    const coatTypeDeleteActionHandler = async (id) => {
        await deleteCoatType({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Тип шерсти удален из системы', 5000))
            setCoatTypeDeleteDialogVisible(false)
            refetchCoatTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления типа шерсти')
        })
    }

    const coatTypeDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatTypeDeleteDialogVisible(false)
            }
            } autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => coatTypeDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );

    // Редактирование типа шерсти

    const [newCoatTypeName, setNewCoatTypeName] = useState('')
    const [coatTypeEditDialogVisible, setCoatTypeEditDialogVisible] = useState(false)

    const openEditCoatTypeDialog = () => {
        setNewCoatTypeName(selectedTableRow?.coat_type_name)
        setCoatTypeEditDialogVisible(true)
    }

    const coatTypeEditActionHandler = () => {
        if (newCoatTypeName !== '') {
            coatTypeEditAction()
        }
    }

    const [editCoatType, { isLoading: editCoatTypeIsLoading }] = useEditCoatTypeMutation()

    const coatTypeEditAction = async () => {
        await editCoatType({
            body: {
                coat_type_name: newCoatTypeName
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Тип шерсти изменен', 5000))
            setCoatTypeEditDialogVisible(false)
            refetchCoatTypes()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения типа шерсти')
        })
    }

    const coatTypeEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setCoatTypeEditDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => coatTypeEditActionHandler()} className="p-button-submit" />
        </div>
    );


    // Таблица BREEDS

    const menuBREEDS = useRef(null)

    const actionsOverlayBREEDS = (event, rowData) => {
        menuBREEDS?.current?.toggle(event)
        setSelectedTableRow(rowData)
    }

    const actionsMenuDataBREEDS = [
        {
            label: 'Редактировать',
            icon: 'pi pi-user-edit',
            command: () => {
                openEditBreedDialog()
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: () => {
                setBreedDeleteDialogVisible(true)
            }
        },
    ]

    const breedsHeader = () => {
        return (
            <div className={styles['table-header']}>
                <h2>Породы</h2>
                <Button onClick={() => {setBreedCreateDialogVisible(true)}} icon='pi pi-plus' label='Добавить породу'></Button>
            </div>
        );
    }

    const displayActionsBREEDS = (rowData) => {
        return (
            <>
                <TieredMenu
                    model={actionsMenuDataBREEDS}
                    popup
                    ref={menuBREEDS}
                    id='popup_menu'
                    className='vm-actions'
                    style={{ width: 'auto' }}
                />
                <Button
                    onClick={(event) => actionsOverlayBREEDS(event, rowData)}
                    icon='pi pi-ellipsis-v'
                    className='p-button-rounded actions-button'
                />
            </>
        )
    }

    // Создание породы

    const [breedCreateDialogVisible, setBreedCreateDialogVisible] = useState(false)
    const [breedName, setBreedName] = useState('')
    const [breedType, setBreedType] = useState('')

    const [createBreed, { isLoading: createBreedIsLoading }] = useCreateBreedMutation()

    const breedCreateActionHandler = () => {
        setBreedCreateDialogVisible(true)

        if (breedName !== '' && breedType !== '') {
            createBreedAction()
        }
    }

    const createBreedAction = async () => {
        await createBreed({
            body: {
                breed_name: breedName,
                type: breedType?.id
            }
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Порода добавлена в систему', 5000))
            setBreedCreateDialogVisible(false)
            refetchBreeds()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка создания породы')
        })
    }

    const breedCreateDialogFooter = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setBreedCreateDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => breedCreateActionHandler()} className="p-button-submit" />
        </div>
    );

    // Удаление породы

    const [deleteBreed, { isLoading: deleteBreedIsLoading }] = useDeleteBreedMutation()
    const [breedDeleteDialogVisible, setBreedDeleteDialogVisible] = useState(false)

    const breedDeleteActionHandler = async (id) => {
        await deleteBreed({
            id: id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Порода удалена из системы', 5000))
            setBreedDeleteDialogVisible(false)
            refetchBreeds()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка удаления породы')
        })
    }

    const breedDeleteDialogFooter = (
        <div className='footer-content delete-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setBreedDeleteDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-check" onClick={() => breedDeleteActionHandler(selectedTableRow.id)} className="p-button-submit" />
        </div>
    );

    // Редактирование породы

    const [newBreedName, setNewBreedName] = useState('')
    const [newBreedType, setNewBreedType] = useState('')
    const [breedEditDialogVisible, setBreedEditDialogVisible] = useState(false)

    const openEditBreedDialog = () => {
        setNewBreedName(selectedTableRow?.breed_name)
        setNewBreedType(selectedTableRow?.pet_type)
        setBreedEditDialogVisible(true)
    }

    const breedEditActionHandler = () => {
        if (newBreedName !== '' && newBreedType !== '') {
            breedEditAction()
        }
    }

    const [editBreed, { isLoading: editBreedIsLoading }] = useEditBreedMutation()

    const breedEditAction = async () => {
        await editBreed({
            body: {
                breed_name: newBreedName,
                type: newBreedType?.id
            },
            id: selectedTableRow?.id
        })
        .unwrap()
        .then(() => {
            toast?.current?.show(showToastSuccess('Успешно', 'Порода изменена', 5000))
            setBreedEditDialogVisible(false)
            refetchBreeds()
        })
        .catch((error) => {
            showToastError(toast, 'Ошибка изменения породы')
        })
    }

    const breedEditDialogFooter = (
        <div className='footer-content edit-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setBreedEditDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => breedEditActionHandler()} className="p-button-submit" />
        </div>
    );





    

    return (
		<div className={styles['tables-wrapper']}>
			<Toast ref={toast} className="" />
        	<DataTable
        	    className={styles.table}
        	    value={services?.services}
        	    rows={13}
        	    stripedRows
        	    removableSort
        	    size='small'
                id='services-table'
        	    paginator
                header={servicesHeader}
        	    currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
        	    paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
        	>
        	    <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
				<Column style={{height: '20px'}} field="name" sortable header="Наименование"></Column>
        	    <Column style={{height: '20px'}} header="Действия" body={displayActionsSERVICES}></Column>
        	</DataTable>

            <Dialog
                header='Создание услуги'
                visible={serviceCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={serviceCreateDialogFooter}
                onHide={() => setServiceCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Удаление услуги'
                visible={serviceDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={serviceDeleteDialogFooter}
                onHide={() => setServiceDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить услугу?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование услуги'
                visible={serviceEditDialogVisible}
                style={{ width: '30vw' }}
                footer={serviceEditDialogFooter}
                onHide={() => setServiceEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} />
                    </div>
                </div>
            </Dialog>


        

            <DataTable
        	    className={styles.table}
        	    value={roles?.roles}
        	    rows={13}
        	    stripedRows
        	    removableSort
        	    size='small'
                id='roles-table'
        	    paginator
                header={rolesHeader}
        	    currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
        	    paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
        	>
        	    <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
				<Column style={{height: '20px'}} field="role_name" sortable header="Наименование"></Column>
        	    <Column style={{height: '20px'}} header="Действия" body={displayActionsROLES}></Column>
        	</DataTable>

            <Dialog
                header='Создание роли'
                visible={roleCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={roleCreateDialogFooter}
                onHide={() => setRoleCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Удаление роли'
                visible={roleDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={roleDeleteDialogFooter}
                onHide={() => setRoleDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить роль?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование роли'
                visible={roleEditDialogVisible}
                style={{ width: '30vw' }}
                footer={roleEditDialogFooter}
                onHide={() => setRoleEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} />
                    </div>
                </div>
            </Dialog>



            <DataTable
            	className={styles.table}
            	value={petTypes?.petTypes}
            	rows={13}
            	stripedRows
            	removableSort
            	size='small'
                id='pet_types-table'
            	paginator
                header={petTypesHeader}
            	currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
            	paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            >
                <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
                <Column style={{height: '20px'}} field="pet_type_name" sortable header="Наименование"></Column>
                <Column style={{height: '20px'}} header="Действия" body={displayActionsPET_TYPES}></Column>
            </DataTable>

            <Dialog

                header='Создание вида животных'
                visible={petTypeCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={petTypeCreateDialogFooter}
                onHide={() => setPetTypeCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={petTypeName} onChange={(e) => setPetTypeName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <Dialog

                header='Удаление вида животных'
                visible={petTypeDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={petTypeDeleteDialogFooter}
                onHide={() => setPetTypeDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить вид животных?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование вида животных'
                visible={petTypeEditDialogVisible}
                style={{ width: '30vw' }}
                footer={petTypeEditDialogFooter}
                onHide={() => setPetTypeEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newPetTypeName} onChange={(e) => setNewPetTypeName(e.target.value)} />
                    </div>
                </div>
            </Dialog>



            <DataTable
                className={styles.table}
                value={coatColors?.coatColors}
                rows={13}
                stripedRows
                removableSort
                size='small'
                id='coat_colors-table'
                paginator
                header={coatColorsHeader}
                currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
                paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            >
                <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
                <Column style={{height: '20px'}} field="color_name" sortable header="Наименование"></Column>
                <Column style={{height: '20px'}} header="Действия" body={displayActionsCOAT_COLORS}></Column>
            </DataTable>

            <Dialog

                header='Создание цвета шерсти'
                visible={coatColorCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={coatColorCreateDialogFooter}
                onHide={() => setCoatColorCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={coatColorName} onChange={(e) => setCoatColorName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Удаление цвета шерсти'
                visible={coatColorDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={coatColorDeleteDialogFooter}
                onHide={() => setCoatColorDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить цвет шерсти?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование цвета шерсти'
                visible={coatColorEditDialogVisible}
                style={{ width: '30vw' }}
                footer={coatColorEditDialogFooter}
                onHide={() => setCoatColorEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newCoatColorName} onChange={(e) => setNewCoatColorName(e.target.value)} />
                    </div>
                </div>
            </Dialog>



            <DataTable
                className={styles.table}
                value={coatTypes?.coatTypes}
                rows={13}
                stripedRows
                removableSort
                size='small'
                id='coat_types-table'
                paginator
                header={coatTypesHeader}
                currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
                paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            >
                <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
                <Column style={{height: '20px'}} field="coat_type_name" sortable header="Наименование"></Column>
                <Column style={{height: '20px'}} header="Действия" body={displayActionsCOAT_TYPES}></Column>
            </DataTable>

            <Dialog

                header='Создание типа шерсти'
                visible={coatTypeCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={coatTypeCreateDialogFooter}
                onHide={() => setCoatTypeCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={coatTypeName} onChange={(e) => setCoatTypeName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Удаление типа шерсти'
                visible={coatTypeDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={coatTypeDeleteDialogFooter}
                onHide={() => setCoatTypeDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить тип шерсти?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование типа шерсти'
                visible={coatTypeEditDialogVisible}
                style={{ width: '30vw' }}
                footer={coatTypeEditDialogFooter}
                onHide={() => setCoatTypeEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newCoatTypeName} onChange={(e) => setNewCoatTypeName(e.target.value)} />
                    </div>
                </div>
            </Dialog>

            <DataTable
                className={styles.table}
                value={breeds?.breeds}
                rows={13}
                stripedRows
                removableSort
                size='small'
                id='breeds-table'
                paginator
                header={breedsHeader}
                currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
                paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
            >
                <Column style={{height: '20px'}} field="id" sortable header="Иднетификатор"></Column>
                <Column style={{height: '20px'}} field="breed_name" sortable header="Наименование"></Column>
                <Column style={{height: '20px'}} field="type" sortable header="Тип питомца"></Column>
                <Column style={{height: '20px'}} header="Действия" body={displayActionsBREEDS}></Column>
            </DataTable>

            <Dialog
                header='Создание породы'
                visible={breedCreateDialogVisible}
                style={{ width: '30vw' }}
                footer={breedCreateDialogFooter}
                onHide={() => setBreedCreateDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={breedName} onChange={(e) => setBreedName(e.target.value)} />
                    </div>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='type'>Тип питомца</label>
                        <Dropdown
                            id='type'
                            value={breedType}
                            options={petTypes?.petTypes}
                            onChange={(e) => setBreedType(e.target.value)}
                            optionLabel='pet_type_name'
                            placeholder='Выберите тип питомца'
                        />
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Удаление породы'
                visible={breedDeleteDialogVisible}
                style={{ width: '30vw' }}
                footer={breedDeleteDialogFooter}
                onHide={() => setBreedDeleteDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <p>Вы действительно хотите удалить породу?</p>
                    </div>
                </div>
            </Dialog>

            <Dialog
                header='Редактирование породы'
                visible={breedEditDialogVisible}
                style={{ width: '30vw' }}
                footer={breedEditDialogFooter}
                onHide={() => setBreedEditDialogVisible(false)}
            >
                <div className='admin-dialog p-fluid p-formgrid p-grid'>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='name'>Наименование</label>
                        <InputText className='form-item__input' id='name' value={newBreedName} onChange={(e) => setNewBreedName(e.target.value)} />
                    </div>
                    <div className='p-field p-col-12 p-md-12'>
                        <label htmlFor='type'>Тип питомца</label>
                        <Dropdown
                            id='type'
                            value={newBreedType}
                            options={petTypes?.petTypes}
                            onChange={(e) => setNewBreedType(e.target.value)}
                            optionLabel='pet_type_name'
                            placeholder='Выберите тип питомца'
                        />
                    </div>
                </div>
            </Dialog>

		</div>
    )
}

export default AdministrationComponent;
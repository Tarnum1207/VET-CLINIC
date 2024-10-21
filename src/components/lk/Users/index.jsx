import React, { useRef, useState, useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { Dialog } from 'primereact/dialog';
import { showToastError, showToastSuccess, showToastWarn } from '../../../utils/showToast'
import { Toast } from 'primereact/toast'
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { IconField } from 'primereact/iconfield';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';



import styles from './Index.module.scss';

import { useGetProfileByUserIdQuery } from '../../../store/api/usersApi'

import { useGetJournalListByPassportIdQuery, useDeleteJournalMutation } from '../../../store/api/journalApi';

import { useNavigate } from 'react-router-dom';

import { useGetJournalListQuery } from '../../../store/api/journalApi';

import { useRegistrationMutation } from '../../../store/api/authApi';

import {
	useGetAllUsersQuery,
	useEditUserMutation,
	useDeleteUserMutation,
	useEditRoleMutation,
	useGetRolesQuery
} from '../../../store/api/usersApi';

const UsersComponent = () => {
	const current_pet_id = localStorage.getItem('current_pet_id');
	const toast = useRef(null);
	const [selectedTableRow, setSelectedTableRow] = useState(null)
	const navigation = useNavigate()

	const { data: profile } = useGetProfileByUserIdQuery(localStorage.getItem('user_id'));
	const { data: users, refetch: usersRefetch } = useGetAllUsersQuery();
	const { data: roles } = useGetRolesQuery();

	useEffect(() => {
		console.log('ROLES:', roles)
	}, [roles])

	useEffect(() => {
		console.log(profile)
	}, [profile])

	// eslint-disable-next-line
    const { data: appointments, error, isLoading, isFetching, refetch } = profile?.user?.role?.id === '3' ? useGetJournalListQuery() : useGetJournalListByPassportIdQuery({ user: localStorage.getItem('user_id'), passport: current_pet_id ? current_pet_id : undefined });
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
	

	const [
		deleteUser,
	 ] = useDeleteUserMutation()

	 
	const deleteJournalAction = async () => {
		console.log(selectedTableRow?.id)
		const request = await deleteUser({ id: selectedTableRow?.id }).unwrap()


		if (request?.status === 'success') {
			setDeleteDialogVisible(false)
			toast?.current?.show(showToastSuccess('Успешно', `Пользователь ${selectedTableRow?.nickname} удален`, 5000))
		} else {
			toast.current.show(showToastWarn('Внимание', 'Что-то пошло не так. Повторите попытку.', 5000))
		}
	}

	const footerContent = (
        <div className='footer-content'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => setDeleteDialogVisible(false)} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Удалить" icon="pi pi-trash" onClick={() => deleteJournalAction()} className="p-button-submit" />
        </div>
    );



    

    const menu = useRef(null)

    const actionsOverlay = (event, rowData) => {
		menu?.current?.toggle(event)
		setSelectedTableRow(rowData)
	}

    const displayActions = (rowData) => {
		return (
			<>
				<TieredMenu
					model={actionsMenuData}
					popup
					ref={menu}
					id='popup_menu'
					className='vm-actions'
					style={{ width: 'auto' }}
				/>
				<Button
					onClick={(event) => actionsOverlay(event, rowData)}
					icon='pi pi-ellipsis-v'
					className='p-button-rounded actions-button'
				/>
			</>
		)
	}

	// Фильтрация таблицы

    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const onGlobalFilterChange = (event) => {
        const value = event.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
    };


	const [createUserMutation] = useRegistrationMutation()
    

	const [createUserDialogVisible, setCreateUserDialogVisible] = useState(false)
	const [nickname, setNickname] = useState('')
	const [login, setLogin] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [secondName, setSecondName] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')


	const createUser = () => {
		setCreateUserDialogVisible(true)
	}

	const createUserAction = async () => {
		const userData = {
			nickname,
			login,
			email,
			password,
			secondName: secondName,
			firstName: firstName,
			lastName: lastName,
			role_id: newRole?.id
		}

		try {
			const result = await createUserMutation(userData).unwrap()

			if (!result?.error) {
				usersRefetch()
				toast?.current?.show(showToastSuccess('Успешно', 'Пользователь создан', 5000))
				setCreateUserDialogVisible(false)
			} else {
				toast?.current?.show(showToastError('Ошибка', 'Что-то пошло не так. Повторите попытку', 5000))
			}
		} catch (error) {
			console.error(error)
		}
	}

	const footerCreateUserContent = (
		<div className='footer-content create-dialog-footer'>
			<Button label="Отмена" icon="pi pi-times" onClick={() => setCreateUserDialogVisible(false)} autoFocus className="p-button-cancel p-button-text" />
			<Button label="Создать" icon="pi pi-check" onClick={() => createUserAction()} className="p-button-submit" />
		</div>
	);




	const [updateProfileDialogVisible, setUpdateProfileDialogVisible] = useState(false)
	const [newEmail, setNewEmail] = useState('')
	const [newNickname, setNewNickname] = useState('')
	const [newSecondName, setNewSecondName] = useState('')
	const [newFirstName, setNewFirstName] = useState('')
	const [newLastName, setNewLastName] = useState('')
	const [newLogin, setNewLogin] = useState('')
	const [newPassword, setNewPassword] = useState('')

    const [updateProfileMutation] = useEditUserMutation();

    const openEditProfileDialog = () => {
        setNewNickname(selectedTableRow?.nickname)
        setNewEmail(selectedTableRow?.email)
        setNewFirstName(selectedTableRow?.first_name)
        setNewSecondName(selectedTableRow?.second_name)
        setNewLastName(selectedTableRow?.last_name)
        setUpdateProfileDialogVisible(true)
    }
            
    const updateProfileAction = async () => {
        const profileData = {
			email: newEmail,
            nickname: newNickname,
            first_name: newFirstName,
            second_name: newSecondName,
            last_name: newLastName
        };

        try {
            const result = await updateProfileMutation({
                body: profileData,
                id: selectedTableRow?.id
            });

            usersRefetch()
            toast?.current?.show(showToastSuccess('Успешно', 'Изменения применены', 5000))
            setUpdateProfileDialogVisible(false)

        } catch (error) {
            console.error(error);
        }

    }

	const [editRoleDialogVisible, setEditRoleDialogVisible] = useState(false)
	const [newRole, setNewRole] = useState({})

	const [editRoleMutation] = useEditRoleMutation()

	const openEditRoleDialog = () => {
		setNewRole(selectedTableRow?.role_id)
		setEditRoleDialogVisible(true)
	}

	const editRoleAction = async () => {
		const roleData = {
			role_id: newRole?.id
		}

		try {
			const result = await editRoleMutation({
				body: roleData,
				id: selectedTableRow?.id
			})

			usersRefetch()
			toast?.current?.show(showToastSuccess('Успешно', 'Изменения применены', 5000))
			setEditRoleDialogVisible(false)
		} catch (error) {
			console.error(error)
		}
	}

	const footerEditRoleContent = (
		<div className='footer-content create-dialog-footer'>
			<Button label="Отмена" icon="pi pi-times" onClick={() => setEditRoleDialogVisible(false)} autoFocus className="p-button-cancel p-button-text" />
			<Button label="Сохранить" icon="pi pi-check" onClick={() => editRoleAction()} className="p-button-submit" />
		</div>
	);


    const footerUpdateProfileContent = (
        <div className='footer-content create-dialog-footer'>
            <Button label="Отмена" icon="pi pi-times" onClick={() => {
                setUpdateProfileDialogVisible(false)
            }} autoFocus className="p-button-cancel p-button-text" />
            <Button label="Сохранить" icon="pi pi-check" onClick={() => updateProfileAction()} className="p-button-submit" />
        </div>
    );


    const actionsMenuData = [
		{
			label: 'Редактировать',
			icon: 'pi pi-user-edit',
			command: () => {
				openEditProfileDialog()
			}
		},
		{
			label: 'Назначить роль',
			icon: 'pi pi-users',
			command: () => {
				openEditRoleDialog()
			}
		},
        {
			label: 'Удалить',
			icon: 'pi pi-trash',
			command: () => {
				setDeleteDialogVisible(true)
			}
		},
	]

	const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
			<div className={styles['table-header']}>
            	<IconField iconPosition="left">
            	    <InputIcon className="pi pi-search" />
            	    <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Поиск" />
            	</IconField>
				<Button onClick={createUser} icon='pi pi-user-plus' label='Добавить пользователя'></Button>
			</div>
        );
    };

	const header = renderHeader();


    return (
		<>
			<Toast ref={toast} className="" />
        	<DataTable
        	    className={styles.table}
        	    value={users?.users}
        	    rows={13}
        	    stripedRows
        	    removableSort
        	    size='small'
        	    paginator
				filters={filters} 
                onFilter={(e) => setFilters(e.filters)}
                header={header}
				emptyMessage={localStorage.getItem('current_pet_id') ? 'У вас нет записей на приемы' : 'Выберите питомца для просмотра записей'}
        	    currentPageReportTemplate='Показано {first}-{last} из {totalRecords}'
        	    paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink'
        	>
        	    <Column style={{height: '20px'}} field="nickname" sortable header="Никнейм"></Column>
				<Column style={{height: '20px'}} field="role_name" sortable header="Роль"></Column>
				<Column style={{height: '20px'}} field="second_name" sortable header="Фамилия"></Column>
				<Column style={{height: '20px'}} field="first_name" sortable header="Имя"></Column>
				<Column style={{height: '20px'}} field="last_name" sortable header="Отчество"></Column>
				<Column style={{height: '20px'}} field="email" sortable header="E-Mail"></Column>
				<Column style={{height: '20px'}} field="pets_length" sortable header="Кол-во питомцев"></Column>
        	    <Column style={{height: '20px'}} header="Действия" body={displayActions}></Column>
        	</DataTable>
			<Dialog
				header="Удаление пользователя"
				footer={footerContent}
				visible={deleteDialogVisible}
				style={{ width: '5' }}
				onHide={() => setDeleteDialogVisible(false)}
			>
				<p><i className='pi pi-info-circle' style={{ marginRight: '10px' }} />Вы действительно хотите удалить пользователя?</p>
			</Dialog>
			<Dialog
				header="Обновление профиля"
				footer={footerUpdateProfileContent}
				visible={updateProfileDialogVisible}
				style={{ borderRadius: '30px' }}
				onHide={() => setUpdateProfileDialogVisible(false)}
                className='create-dialog'
			>
                <div className="create-dialog-field">
                    <label htmlFor="newEmail">E-Mail</label>
                    <InputText
                        value={newEmail}
                        id="newEmail"
                        onChange={(e) => {
                            setNewEmail(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newNickname">Никнейм</label>
                    <InputText
                        value={newNickname}
                        id="newNickname"
                        onChange={(e) => {
                            setNewNickname(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newSecondName">Фамилия</label>
                    <InputText
                        value={newSecondName}
                        id="newSecondName"
                        onChange={(e) => {
                            setNewSecondName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newFirstName">Имя</label>
                    <InputText
                        value={newFirstName}
                        id="newFirstName"
                        onChange={(e) => {
                            setNewFirstName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
                <div className="create-dialog-field">
                    <label htmlFor="newLastName">Отчество</label>
                    <InputText
                        value={newLastName}
                        id="newLastName"
                        onChange={(e) => {
                            setNewLastName(e.target.value)
                        }}
                        className='create-dialog-field-input'
                    />
                </div>
            </Dialog>
			<Dialog
				header="Редактирование роли"
				footer={footerEditRoleContent}
				visible={editRoleDialogVisible}
				style={{ minWidth: '400px' }}
				onHide={() => setEditRoleDialogVisible(false)}
			>
				<Dropdown
					value={newRole}
					options={roles?.roles}
					optionLabel='role_name'
					onChange={(e) => setNewRole(e.value)}
					placeholder='Выберите роль'
					style={{
						width: '100%',
						outline: '#576C70',
						borderRadius: '10px'
					}}
				/>
			</Dialog>
			<Dialog
				header="Создание пользователя"
				footer={footerCreateUserContent}
				visible={createUserDialogVisible}
				style={{ minWidth: '400px' }}
				onHide={() => setCreateUserDialogVisible(false)}
			>
				<div className="form-item">
                    <label className='form-item__label' htmlFor="nickname">Никнейм</label>
                    <InputText
                        className='form-item__input'
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="login">Логин</label>
                    <InputText
                        className='form-item__input'
                        id="login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="email">E-Mail</label>
                    <InputText
                        className='form-item__input'
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-item">
                    <label className='form-item__label' htmlFor="password">Password</label>
                    <Password
                        className='form-item__input w-full'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        toggleMask
                    />
                </div>
                <div className="form-item_double">
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Фамилия</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={secondName}
                            onChange={(e) => setSecondName(e.target.value)}
                        />
                    </div>
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Имя</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-item_double">
                    <div className='form-item'>
                        <label className='form-item__label' htmlFor="login">Отчество</label>
                        <InputText
                            className='form-item__input'
                            id="login"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
					<div className='form-item'>
						<label className='form-item__label' htmlFor="login">Роль</label>
						<Dropdown
							value={newRole}
							options={roles?.roles}
							optionLabel='role_name'
							onChange={(e) => setNewRole(e.value)}
							placeholder='Выберите роль'
							style={{
								width: '100%',
								outline: '#576C70',
								borderRadius: '10px'
							}}
						/>
					</div>
                </div>
			</Dialog>
		</>
    )
}

export default UsersComponent;
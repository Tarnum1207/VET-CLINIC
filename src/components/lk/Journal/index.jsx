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


import styles from './Index.module.scss';

import { useGetProfileByUserIdQuery } from '../../../store/api/usersApi'

import { useGetJournalListByPassportIdQuery, useDeleteJournalMutation } from '../../../store/api/journalApi';

import { useNavigate } from 'react-router-dom';

import { useGetJournalListQuery } from '../../../store/api/journalApi';

const JournalComponent = () => {
	const current_pet_id = localStorage.getItem('current_pet_id');
	const toast = useRef(null);
	const [selectedTableRow, setSelectedTableRow] = useState(null)
	const navigation = useNavigate()

	const { data: profile } = useGetProfileByUserIdQuery(localStorage.getItem('user_id'));

	useEffect(() => {
		console.log(profile)
	}, [profile])

	// eslint-disable-next-line
    const { data: appointments, error, isLoading, isFetching, refetch } = profile?.user?.role?.id === '3' ? useGetJournalListQuery() : useGetJournalListByPassportIdQuery({ user: localStorage.getItem('user_id'), passport: current_pet_id ? current_pet_id : undefined });
	const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

	const [
		deleteJournal,
	 ] = useDeleteJournalMutation(selectedTableRow?.id)

	 

	const deleteJournalAction = async () => {
		const request = await deleteJournal(selectedTableRow?.id).unwrap()

		console.log('SELECTED: ', selectedTableRow)

		if (request?.message === 'Journal deleted') {
			setDeleteDialogVisible(false)
			toast?.current?.show(showToastSuccess('Успешно', `Запись на ${selectedTableRow?.date_and_time} удалена`, 5000))
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


    const actionsMenuData = [
		{
			label: 'Подробнее',
			icon: 'pi pi-external-link',
			command: () => {
				if (profile?.user?.role?.id === '2' && profile?.user?.role?.id === '3'){
					navigation(`/lk/journal/${selectedTableRow?.id}/edit`)
				} else {
					navigation(`/lk/journal/${selectedTableRow?.id}`)
				}
			}
		},
        {
			label: 'Удалить запись',
			icon: 'pi pi-trash',
			command: () => {
				setDeleteDialogVisible(true)
			},
			visible: profile?.user?.role?.id === '3'
		},
	]

    

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

    const renderHeader = () => {
        const value = filters['global'] ? filters['global'].value : '';

        return (
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText type="search" value={value || ''} onChange={(e) => onGlobalFilterChange(e)} placeholder="Поиск" />
            </IconField>
        );
    };

    const header = renderHeader();

    return (
		<>
			<Toast ref={toast} className="" />
			
        	<DataTable
        	    className={styles.table}
        	    value={appointments?.journal}
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
        	    <Column style={{height: '20px'}} field="pet_name" sortable header="Кличка"></Column>
        	    <Column style={{height: '20px'}} field="service" sortable header="Услуга"></Column>
        	    <Column style={{height: '20px'}} field="specialist" sortable header="Специалист"></Column>
        	    <Column style={{height: '20px'}} field="date_and_time" sortable header="Дата приема"></Column>
        	    <Column style={{height: '20px'}} field="price" sortable header="Стоимость (₽)"></Column>
        	    <Column style={{height: '20px'}} header="Действия" body={displayActions}></Column>
        	</DataTable>
			<Dialog
				header="Удаление записи"
				footer={footerContent}
				visible={deleteDialogVisible}
				style={{ width: '5' }}
				onHide={() => setDeleteDialogVisible(false)}
			>
				<p><i className='pi pi-info-circle' style={{ marginRight: '10px' }} />Вы действительно хотите удалить запись о приеме?</p>
			</Dialog>
		</>
    )
}

export default JournalComponent;
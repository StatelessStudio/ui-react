import { useState, useCallback } from 'react';

export interface UseCrudModalsReturn<T> {
	// Create / Edit Drawer
	isFormOpen: boolean;
	itemToEdit: T | null;
	openForm: (item?: T) => void;
	closeForm: () => void;

	// Delete Modal
	isDeleteModalOpen: boolean;
	itemToDelete: string | number | null;
	openDeleteModal: (id?: string | number) => void;
	closeDeleteModal: () => void;
}

export function useCrudModals<T>(): UseCrudModalsReturn<T> {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [itemToEdit, setItemToEdit] = useState<T | null>(null);

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<string | number | null>(
		null
	);

	const openForm = useCallback((item?: T) => {
		if (item) {
			setItemToEdit(item);
		}
		else {
			setItemToEdit(null);
		}

		setIsFormOpen(true);
	}, []);

	const closeForm = useCallback(() => {
		setItemToEdit(null);
		setIsFormOpen(false);
	}, []);

	const openDeleteModal = useCallback((id?: string | number) => {
		if (id !== undefined) {
			setItemToDelete(id);
		}
		else {
			setItemToDelete(null);
		}

		setIsDeleteModalOpen(true);
	}, []);

	const closeDeleteModal = useCallback(() => {
		setItemToDelete(null);
		setIsDeleteModalOpen(false);
	}, []);

	return {
		isFormOpen,
		itemToEdit,
		openForm,
		closeForm,
		isDeleteModalOpen,
		itemToDelete,
		openDeleteModal,
		closeDeleteModal,
	};
}

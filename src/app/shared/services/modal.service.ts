import { Injectable } from '@angular/core';
import { Modal, ModalInterface } from 'flowbite';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  private selectModal(idModal: string): ModalInterface | null {
    const modalElement: HTMLElement | null = document.getElementById(idModal);
    
    if (!modalElement) {
      console.warn(`Modal with id "${idModal}" not found in DOM`);
      return null;
    }
    
    try {
      // Verificar si el modal ya está inicializado
      if (modalElement.hasAttribute('data-modal-target')) {
        // Si tiene data-modal-target, Flowbite debería haberlo inicializado automáticamente
        const modal: ModalInterface = new Modal(modalElement);
        return modal;
      } else {
        // Si no tiene data-modal-target, inicializarlo manualmente
        const modal: ModalInterface = new Modal(modalElement);
        return modal;
      }
    } catch (error) {
      console.error(`Error creating modal for id "${idModal}":`, error);
      return null;
    }
  }

  open(idModal: string): void {
    const modal = this.selectModal(idModal);
    if (modal) {
      modal.show();
    }
  }

  close(idModal: string): void {
    const modal = this.selectModal(idModal);
    if (modal) {
      modal.hide();
    }
  }

}

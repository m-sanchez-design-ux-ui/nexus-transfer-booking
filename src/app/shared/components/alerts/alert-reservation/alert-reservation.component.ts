import { Component, inject, input } from '@angular/core';

import { ModalService } from '@/app/shared/services/modal.service';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";

@Component({
  selector: 'app-alert-reservation',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './alert-reservation.component.html',
})
export class AlertReservationComponent {
  message = input('');
  messageText = input('');

  modalService = inject(ModalService);

  closeModal() {
    this.modalService.close('alert-reservation');
  }
}

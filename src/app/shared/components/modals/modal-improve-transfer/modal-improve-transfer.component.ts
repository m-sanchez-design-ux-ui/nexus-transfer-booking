import { Component, inject, OnInit, signal } from '@angular/core';

import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { AppSettingsService } from '@/app/shared/services';
import { ModalService } from '@/app/shared/services/modal.service';
import { detectMobile } from '@/app/shared/utils/isMobileDevice';

@Component({
  selector: 'app-modal-improve-transfer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './modal-improve-transfer.component.html',
  styleUrl: './modal-improve-transfer.component.css',
})
export class ModalImproveTransferComponent implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly appSettingsService = inject(AppSettingsService);

  isMobileDevice = signal(false);
  phoneCall = signal(this.appSettingsService.settings()?.contact.phoneCall ?? '');
  idModal = signal('modal-improve-transfer');

  ngOnInit() {
    this.isMobileDevice.set(detectMobile());
  }

  openAssistanceMenu() {
    const assistanceMenu = document.getElementById('nexus-widget-button');
    if (assistanceMenu) {
      this.onCloseModal();
      assistanceMenu.click();
    }
  }

  onCloseModal() {
    this.modalService.close(this.idModal());
  }
}

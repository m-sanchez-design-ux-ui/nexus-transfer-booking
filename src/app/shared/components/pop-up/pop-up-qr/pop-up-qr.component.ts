import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';

@Component({
  selector: 'app-pop-up-qr',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './pop-up-qr.component.html',
  styleUrl: './pop-up-qr.component.css',
})
export class PopUpQrComponent {
  isOpen = signal<boolean>(true);

  userAgent = navigator.userAgent;

  // Detección de dispositivos móviles y tablets
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);

  // Detección de tablets
  isTablet = /(iPad|tablet|playbook|silk)|(Android(?!.*Mobile))/i.test(this.userAgent);

  // Detección de escritorio (Desktop)
  isDesktop = !this.isMobile && !this.isTablet;

  closeCard() {
    this.isOpen.set(false);
  }

  openApp(){
    window.location.href = 'https://uqr.to/XHUB.NT';
  }
}

import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { TranslatePipe } from '@/app/shared/pipe/TranslatePipe.pipe';
import { detectMobile } from '@/app/shared/utils/isMobileDevice';
import { AppSettingsService } from '@/app/shared/services/app-settings.service';

@Component({
  selector: 'app-contact-center-button',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './contact-center-button.component.html',
})
export class ContactCenterButtonComponent implements OnInit {
  private readonly appSettingsService = inject(AppSettingsService);

  readonly phoneConfig = computed(
    () => this.appSettingsService.settings()?.contact.phoneCall ?? ''
  );

  isMobileDevice = signal(false);
  phoneCall = signal(this.phoneConfig() ?? '');

  ngOnInit(): void {
    this.isMobileDevice.set(detectMobile());
  }

  openAssistanceMenu() {
    const assistanceMenu = document.getElementById('nexus-widget-button');
    if (assistanceMenu) {
      assistanceMenu.click();
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';

import { CardResultsComponent } from '@/app/shared/components/card-results/card-results.component';
import { CustomFlightSearchComponent } from '@/app/shared/components/custom-flight-search/custom-flight-search.component';
import { EmptyResultsComponent } from '@/app/shared/components/empty-results/empty-results.component';
import { IFlightStatsFlightReduce } from '@/app/shared/interfaces/flightstats-search-by-flightNumber-route.interface';
import { FlightstatsService } from '@/app/shared/services/flightstats.service';
import { ModalService } from '@/app/shared/services/modal.service';
import { I18nService } from '@/app/shared/services/I18nService.service';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    CardResultsComponent,
    EmptyResultsComponent,
    CustomFlightSearchComponent,
    CommonModule,
    TranslatePipe
],
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent {
  flightList = input<Array<IFlightStatsFlightReduce>>();
  invalidFormat = input<boolean>(false);
  idModal = input.required<string>();

  modalService = inject(ModalService);
  i18nService = inject(I18nService) 
  flightStatsService = inject(FlightstatsService);

  showNewComponent = signal<boolean>(false);

  modalTitle = computed(() => {
    return  this.showNewComponent()
            ? this.i18nService.translate("modal_not_appear_title") 
            : this.flightList() && this.flightList()!.length > 0
            ? this.i18nService.translate("modal_result_title_select")
            : this.i18nService.translate("modal_result_title_cant_find")
  })

  onCloseModal() {
    const active = document.activeElement as HTMLElement;
    if (active) {
      active.blur();
    }

    const triggerBtn = document.querySelector('#btn-submit') as HTMLElement;
    triggerBtn?.focus();

    this.showNewComponent.set(false);
    this.modalService.close(this.idModal());
  }
}

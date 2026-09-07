import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from "@/app/shared/pipe/TranslatePipe.pipe";

@Component({
  selector: 'search-by-tabs',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './search-by-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchByTabsComponent {
  onChangeTab = output<'route' | 'flight-number'>();
  selectedTab = signal<'route' | 'flight-number'>('route');

  setTab(tab: 'route' | 'flight-number') {
    this.selectedTab.set(tab);
    this.onChangeTab.emit(tab);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-consumables-page',
  imports: [MatProgressSpinnerModule],
  templateUrl: './consumables-page.component.html',
  styleUrl: './consumables-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsumablesPageComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly isPageLoading = this.#store.isPageLoading;
  readonly formattedConsumables = this.#store.formattedConsumables;

  ngOnInit(): void {
    if (!this.formattedConsumables()) {
      this.#store.fetchConsumableData();
    }
  }
}

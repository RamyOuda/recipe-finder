import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AppStore } from '../../store/app.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  ngOnInit(): void {
    this.#store.fetchConsumableData();
  }
}

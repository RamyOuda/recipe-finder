import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { AppStore } from './store/app.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly pageLoading = this.#store.pageLoading;

  ngOnInit(): void {
    this.#store.fetchData();
  }
}

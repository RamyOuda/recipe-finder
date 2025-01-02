import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { NetworkErrorPageComponent } from './network-error-page/network-error-page.component';
import { AppStore } from './store/app.store';

interface ResizeEvent {
  target: {
    innerWidth: number;
  };
}

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    NetworkErrorPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly pageLoading = this.#store.pageLoading;
  readonly isMobileView = this.#store.isMobileView;
  readonly networkError = this.#store.networkError;

  readonly resize$: Observable<ResizeEvent> = fromEvent<ResizeEvent>(
    window,
    'resize',
  );

  constructor() {
    this.resize$.pipe(takeUntilDestroyed()).subscribe((event: ResizeEvent) => {
      this.#store.updateView(event.target.innerWidth <= 1000);
    });
  }

  ngOnInit(): void {
    this.#store.fetchData();
  }
}

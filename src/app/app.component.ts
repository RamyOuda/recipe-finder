import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
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
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly #store = inject(AppStore);
  readonly #router = inject(Router);

  readonly isMobileView = this.#store.isMobileView;
  readonly isNetworkErrorDetected = this.#store.isNetworkErrorDetected;

  readonly resize$: Observable<ResizeEvent> = fromEvent<ResizeEvent>(
    window,
    'resize',
  );

  constructor() {
    effect(() => {
      if (this.isNetworkErrorDetected()) {
        this.#router.navigate(['/error']);
      }
    });

    this.resize$.pipe(takeUntilDestroyed()).subscribe((event: ResizeEvent) => {
      this.#store.updateView(event.target.innerWidth <= 1000);
    });

    this.#router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.#store.clearFormattedResources();
      }
    });
  }
}

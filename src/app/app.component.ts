import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
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
    RouterModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
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

  expandMenu(): void {
    console.log('Menu button clicked');
  }
}

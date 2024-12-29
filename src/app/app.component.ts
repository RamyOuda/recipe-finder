import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { GearRecipePageComponent } from './gear-recipe-page/gear-recipe-page.component';
import { AppStore } from './store/app.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [GearRecipePageComponent, MatProgressSpinnerModule],
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

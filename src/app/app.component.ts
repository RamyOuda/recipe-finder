import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';
import { AppStore } from './store/app.store';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly formattedItems = this.#store.formattedItems;
  readonly loading = this.#store.loading;

  myControl = new FormControl('');
  filteredOptions: Observable<string[]> = of([]);

  constructor() {
    effect(() => {
      console.log(this.formattedItems());
    });
  }

  ngOnInit(): void {
    this.#store.fetchData();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value || ''))
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const items = this.formattedItems();

    return items
      ? items.hat
          .map((hat) => hat.name)
          .filter((name) => name.toLowerCase().includes(filterValue)) ?? []
      : [];
  }
}

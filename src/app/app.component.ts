import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, of, startWith } from 'rxjs';
import { AppStore } from './store/app.store';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
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

  equipmentForm = new FormGroup({
    hat: new FormControl(null),
    cloak: new FormControl(null),
    belt: new FormControl(null),
    boots: new FormControl(null),
    amulet: new FormControl(null),
    ring1: new FormControl(null),
    ring2: new FormControl(null),
    shield: new FormControl(null),
    weapon: new FormControl(null),
  });

  filteredOptions: Observable<any[]> = of([]);

  constructor() {
    effect(() => {
      console.log(this.formattedItems());
    });
  }

  ngOnInit(): void {
    this.#store.fetchData();
  }

  onInputSelected(itemType: string) {
    const formControl = this.equipmentForm.get(itemType) as FormControl;

    this.filteredOptions = formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value ?? '', itemType))
    );
  }

  autocompleteDisplay(item: any): string {
    return item?.name ?? '';
  }

  onSubmit() {
    console.log(this.equipmentForm.value);
  }

  private filter(value: string | any, itemType: string): any[] {
    const items = this.formattedItems();
    const filterValue = (
      typeof value === 'string' ? value : value.name
    ).toLowerCase();

    if (items) {
      return items[itemType as keyof typeof items].filter((item: any) =>
        item.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }
}

import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, Observable, of, startWith } from 'rxjs';
import { FormattedResource } from './models/app.model';
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
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly formattedItems = this.#store.formattedItems;
  readonly pageLoading = this.#store.pageLoading;

  readonly equipmentInputs: { control: string; label: string }[] = [
    { control: 'hat', label: 'Select a hat' },
    { control: 'cloak', label: 'Select a cloak' },
    { control: 'belt', label: 'Select a belt' },
    { control: 'boots', label: 'Select boots' },
    { control: 'amulet', label: 'Select an amulet' },
    { control: 'ring1', label: 'Select first ring' },
    { control: 'ring2', label: 'Select second ring' },
    { control: 'shield', label: 'Select a shield' },
    { control: 'weapon', label: 'Select a weapon' },
  ];

  readonly equipmentForm = new FormGroup({
    hat: new FormControl(null, this.inputValidator()),
    cloak: new FormControl(null, this.inputValidator()),
    belt: new FormControl(null, this.inputValidator()),
    boots: new FormControl(null, this.inputValidator()),
    amulet: new FormControl(null, this.inputValidator()),
    ring1: new FormControl(null, this.inputValidator()),
    ring2: new FormControl(null, this.inputValidator()),
    shield: new FormControl(null, this.inputValidator()),
    weapon: new FormControl(null, this.inputValidator()),
  });

  filteredOptions: Observable<any[]> = of([]);

  ngOnInit(): void {
    this.#store.fetchData();
  }

  onInputSelected(itemType: string): void {
    const formControl = this.equipmentForm.get(itemType) as FormControl;

    this.filteredOptions = formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value ?? '', itemType))
    );
  }

  autocompleteDisplay(item: any): string {
    return item?.name ?? '';
  }

  onSubmit(): void {
    const formValue = this.equipmentForm.value;
    const requiredResources: FormattedResource[] = [];

    for (const key in formValue) {
      let value: any = formValue[key as keyof typeof formValue];

      if (value === '') {
        value = null;
      }

      if (value && typeof value === 'object') {
        value.recipe.forEach(
          (recipe: { item_ankama_id: number; quantity: number }) => {
            const formattedResource = {
              resourceId: recipe.item_ankama_id,
              quantity: recipe.quantity,
            };

            const index: number = requiredResources.findIndex(
              ({ resourceId }) => resourceId === formattedResource.resourceId
            );

            if (index === -1) {
              requiredResources.push(formattedResource);
            } else {
              requiredResources[index].quantity += formattedResource.quantity;
            }
          }
        );
      }
    }

    this.#store.fetchResources(requiredResources);
  }

  private filter(value: string | any, itemType: string): any[] {
    const items = this.formattedItems();
    const filterValue = (
      typeof value === 'string' ? value : value.name
    ).toLowerCase();

    if (itemType.includes('ring')) {
      itemType = 'ring';
    }

    if (items) {
      return items[itemType as keyof typeof items].filter((item: any) =>
        item.name.toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  private inputValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value = control.value;

      if (value === '') {
        value = null;
      }

      if (typeof value === 'object') {
        return null;
      } else {
        return { notObject: { value: control.value } };
      }
    };
  }
}

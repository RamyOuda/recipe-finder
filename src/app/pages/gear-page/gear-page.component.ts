import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { map, Observable, of, startWith } from 'rxjs';
import { FormattedItem, FormattedResource } from '../../models/app.model';
import { RequiredResourcesComponent } from '../../shared/required-resources/required-resources.component';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'gear-recipe-page',
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RequiredResourcesComponent,
  ],
  templateUrl: './gear-page.component.html',
  styleUrl: './gear-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearPageComponent {
  readonly #store = inject(AppStore);

  readonly formattedItems = this.#store.formattedItems;
  readonly formattedResources = this.#store.formattedResources;
  readonly isMobileView = this.#store.isMobileView;

  readonly isFormSubmitted = signal<boolean>(false);

  filteredOptions$: Observable<FormattedItem[]> = of([]);

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

  onInputSelected(itemType: string): void {
    const formControl = this.equipmentForm.get(itemType) as FormControl;

    this.filteredOptions$ = formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value ?? '', itemType)),
    );
  }

  clearInput(controlName: string): void {
    this.equipmentForm.get(controlName)?.setValue(null);
  }

  autocompleteDisplay(item: FormattedItem | null): string {
    return item?.name ?? '';
  }

  onSubmit(): void {
    const formValue = this.equipmentForm.value;
    const requiredResources: FormattedResource[] = [];
    let isValid = false;

    for (const key in formValue) {
      const value = formValue[key as keyof typeof formValue] as
        | FormattedItem
        | string
        | null;

      if (value && typeof value === 'object') {
        isValid = true;

        value.recipe.forEach((resource: FormattedResource) => {
          const index: number = requiredResources.findIndex(
            ({ id }) => id === resource.id,
          );

          if (index === -1) {
            requiredResources.push(resource);
          } else {
            const currentResource: FormattedResource = requiredResources[index];

            requiredResources[index] = {
              ...currentResource,
              quantity: currentResource.quantity + resource.quantity,
            };
          }
        });
      }
    }

    if (isValid) {
      this.#store.fetchResources(requiredResources);
      this.isFormSubmitted.set(true);
    }
  }

  backToForm(): void {
    this.isFormSubmitted.set(false);
  }

  private filter(
    value: FormattedItem | string,
    itemType: string,
  ): FormattedItem[] {
    const items = this.formattedItems();
    const filterValue = (
      typeof value === 'string' ? value : value.name
    ).toLowerCase();

    if (itemType.includes('ring')) {
      itemType = 'ring';
    }

    if (items) {
      return items[itemType as keyof typeof items].filter(
        (item: FormattedItem) => item.name.toLowerCase().includes(filterValue),
      );
    } else {
      return [];
    }
  }

  private inputValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const error = { notObject: { value: control.value } };
      const isValid = typeof value === 'object' || value === '';

      return isValid ? null : error;
    };
  }
}

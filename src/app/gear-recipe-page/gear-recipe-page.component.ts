import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { fromEvent, map, Observable, of, startWith } from 'rxjs';
import { FormattedItem, FormattedResource } from '../models/app.model';
import { AppStore } from '../store/app.store';

interface ResizeEvent {
  target: {
    innerWidth: number;
  };
}

@Component({
  selector: 'gear-recipe-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    AsyncPipe,
    DecimalPipe,
  ],
  templateUrl: './gear-recipe-page.component.html',
  styleUrl: './gear-recipe-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearRecipePageComponent {
  readonly #store = inject(AppStore);
  readonly #clipboard = inject(Clipboard);
  readonly #snackBar = inject(MatSnackBar);

  readonly formattedItems = this.#store.formattedItems;
  readonly formattedResources = this.#store.formattedResources;
  readonly resourcesLoading = this.#store.resourcesLoading;
  readonly networkError = this.#store.networkError;

  readonly isMobileView = signal<boolean>(window.innerWidth <= 1000);
  readonly isFormSubmitted = signal<boolean>(false);

  readonly resize$: Observable<ResizeEvent> = fromEvent<ResizeEvent>(
    window,
    'resize',
  );
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

  constructor() {
    this.resize$.pipe(takeUntilDestroyed()).subscribe((event: ResizeEvent) => {
      this.isMobileView.set(event.target.innerWidth <= 1000);
    });
  }

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
      let value: any = formValue[key as keyof typeof formValue];

      if (value === '') {
        value = null;
      }

      if (value && typeof value === 'object') {
        isValid = true;

        value.recipe.forEach((resource: FormattedResource) => {
          const index: number = requiredResources.findIndex(
            ({ id }) => id === resource.id,
          );

          if (index === -1) {
            requiredResources.push(resource);
          } else {
            const { id, quantity } = requiredResources[index];

            requiredResources[index] = {
              id,
              quantity: quantity + resource.quantity,
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

  copyResources(): void {
    const formattedText: string = this.formattedResources()
      .map(({ name, quantity }) => `${name}: x${quantity}`)
      .join('\n');

    this.#clipboard.copy(formattedText);

    this.#snackBar.open('Resources copied to clipboard!', 'Hurray!', {
      duration: 2000,
    });
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

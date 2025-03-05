import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  Renderer2,
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map, Observable, of, startWith } from 'rxjs';
import { FormattedItem, FormattedResource } from '../../models/app.model';
import { RequiredResourcesComponent } from '../../shared/required-resources/required-resources.component';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'app-gear-page',
  imports: [
    AsyncPipe,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RequiredResourcesComponent,
  ],
  templateUrl: './gear-page.component.html',
  styleUrl: './gear-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GearPageComponent implements OnInit {
  readonly #store = inject(AppStore);
  readonly #renderer = inject(Renderer2);
  readonly #hostElement = inject(ElementRef);

  readonly formattedEquipment = this.#store.formattedEquipment;
  readonly isMobileView = this.#store.isMobileView;
  readonly isPageLoading = this.#store.isPageLoading;

  readonly isFormSubmitted = signal<boolean>(false);
  readonly submittedItems = signal<FormattedItem[]>([]);

  filteredOptions$: Observable<FormattedItem[]> = of([]);

  constructor() {
    effect(() => {
      const height = this.isPageLoading() ? '100%' : 'fit-content';
      this.#renderer.setStyle(
        this.#hostElement.nativeElement,
        'height',
        height,
      );
    });
  }

  ngOnInit(): void {
    if (!this.formattedEquipment()) {
      this.#store.fetchEquipmentData();
    }
  }

  readonly inputs: {
    equipment: {
      control: string;
      label: string;
    }[];
    trophies: {
      control: string;
      label: string;
    }[];
  } = {
    equipment: [
      { control: 'hat', label: 'Select hat' },
      { control: 'cloak', label: 'Select cloak' },
      { control: 'belt', label: 'Select belt' },
      { control: 'boots', label: 'Select boots' },
      { control: 'amulet', label: 'Select amulet' },
      { control: 'ring1', label: 'Select ring' },
      { control: 'ring2', label: 'Select ring' },
      { control: 'shield', label: 'Select shield' },
      { control: 'weapon', label: 'Select weapon' },
    ],

    trophies: [
      { control: 'trophy1', label: 'Select trophy' },
      { control: 'trophy2', label: 'Select trophy' },
      { control: 'trophy3', label: 'Select trophy' },
      { control: 'trophy4', label: 'Select trophy' },
      { control: 'trophy5', label: 'Select trophy' },
      { control: 'trophy6', label: 'Select trophy' },
    ],
  };

  readonly equipmentForm = new FormGroup({
    equipment: new FormGroup({
      hat: new FormControl(null, this.inputValidator()),
      cloak: new FormControl(null, this.inputValidator()),
      belt: new FormControl(null, this.inputValidator()),
      boots: new FormControl(null, this.inputValidator()),
      amulet: new FormControl(null, this.inputValidator()),
      ring1: new FormControl(null, this.inputValidator()),
      ring2: new FormControl(null, this.inputValidator()),
      shield: new FormControl(null, this.inputValidator()),
      weapon: new FormControl(null, this.inputValidator()),
    }),

    trophies: new FormGroup({
      trophy1: new FormControl(null, this.inputValidator()),
      trophy2: new FormControl(null, this.inputValidator()),
      trophy3: new FormControl(null, this.inputValidator()),
      trophy4: new FormControl(null, this.inputValidator()),
      trophy5: new FormControl(null, this.inputValidator()),
      trophy6: new FormControl(null, this.inputValidator()),
    }),
  });

  onInputSelected(controlName: string): void {
    const groupName: string = this.getFormGroupName(controlName);
    const control: string = `${groupName}.${controlName}`;
    const formControl = this.equipmentForm.get(control) as FormControl;

    this.filteredOptions$ = formControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filter(value ?? '', controlName)),
    );
  }

  isInputValue(controlName: string): boolean {
    const groupName: string = this.getFormGroupName(controlName);
    const control: string = `${groupName}.${controlName}`;

    return !!this.equipmentForm.get(control)?.value;
  }

  clearInput(controlName: string): void {
    const groupName: string = this.getFormGroupName(controlName);
    const control: string = `${groupName}.${controlName}`;

    this.equipmentForm.get(control)?.setValue(null);
  }

  autocompleteDisplay(item: FormattedItem | null): string {
    return item?.name ?? '';
  }

  onSubmit(): void {
    const formValue = this.equipmentForm.value;
    const requiredResources: FormattedResource[] = [];
    const submittedItems: FormattedItem[] = [];

    Object.values(formValue).forEach((formGroup) => {
      Object.values(formGroup)
        .filter(
          (item: FormattedItem | string | null) =>
            item && typeof item === 'object',
        )
        .forEach((equipment: FormattedItem | any) => {
          submittedItems.push(equipment);

          equipment.recipe.forEach((resource: FormattedResource) => {
            const index: number = requiredResources.findIndex(
              ({ id }) => id === resource.id,
            );

            if (index === -1) {
              requiredResources.push(resource);
            } else {
              const existingResource: FormattedResource =
                requiredResources[index];

              requiredResources[index] = {
                ...existingResource,
                quantity: existingResource.quantity + resource.quantity,
              };
            }
          });
        });
    });

    if (requiredResources.length) {
      this.submittedItems.set(submittedItems);
      this.isFormSubmitted.set(true);
      this.#store.fetchResources(requiredResources);
    } else {
      this.#store.clearFormattedResources();
    }
  }

  resetForm(): void {
    this.equipmentForm.reset();
  }

  backToForm(): void {
    this.isFormSubmitted.set(false);
  }

  private filter(
    value: FormattedItem | string,
    itemType: string,
  ): FormattedItem[] {
    const items = this.formattedEquipment();
    const filterValue = (
      typeof value === 'string' ? value : value.name
    ).toLowerCase();

    if (itemType.includes('ring')) {
      itemType = 'ring';
    }

    if (itemType.includes('trophy')) {
      itemType = 'trophy';
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

  private getFormGroupName(controlName: string): string {
    return controlName.includes('trophy') ? 'trophies' : 'equipment';
  }
}

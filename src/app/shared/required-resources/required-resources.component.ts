import { Clipboard } from '@angular/cdk/clipboard';
import { Component, computed, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { FormattedItem } from '../../models/app.model';
import { AppStore } from '../../store/app.store';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-required-resources',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    AgGridAngular,
  ],
  templateUrl: './required-resources.component.html',
  styleUrl: './required-resources.component.scss',
})
export class RequiredResourcesComponent {
  readonly submittedItems = input.required<FormattedItem[]>();
  readonly backEvent = output<void>();

  readonly #store = inject(AppStore);
  readonly #clipboard = inject(Clipboard);
  readonly #snackbar = inject(MatSnackBar);

  readonly isResourcesLoading = this.#store.isResourcesLoading;
  readonly formattedResources = this.#store.formattedResources;
  readonly isMobileView = this.#store.isMobileView;

  readonly itemImages = computed<{ name: string; imageUrl: string }[]>(() =>
    this.submittedItems().map(({ name, imageUrl }) => ({ name, imageUrl })),
  );

  colDefs: ColDef[] = [
    {
      field: 'level',
      flex: 0.25,
      minWidth: 96,
    },
    {
      field: 'imageUrl',
      headerName: '',
      sortable: false,
      flex: 0.01,
      cellRenderer: (params: { value: string }) =>
        `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
          <img src="${params.value}" alt="Image" loading="lazy" style="width: 32px; height: 32px;">
        </div>
        `,
    },
    {
      field: 'name',
      flex: 1,
    },
    {
      field: 'quantity',
      flex: 0.5,
      minWidth: 96,
    },
  ];

  backToForm(): void {
    this.backEvent.emit();
  }

  copyResources(): void {
    const formattedText: string = this.formattedResources()
      .map(({ name, quantity, subtype }) => {
        const prefix: string =
          subtype === 'equipment' ? '[! Equipment] - ' : '';

        return `${prefix}${name}: x${quantity}`;
      })
      .join('\n');

    this.#clipboard.copy(formattedText);

    this.#snackbar.open('Resources copied to clipboard!', 'Hurray!', {
      duration: 2000,
    });
  }
}

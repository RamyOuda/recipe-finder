import { Component, inject, input, output } from '@angular/core';
import { FormattedResourceResponse } from '../../models/app.model';
import { DecimalPipe } from '@angular/common';
import { AppStore } from '../../store/app.store';
import { MatButtonModule } from '@angular/material/button';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'required-resources',
  imports: [DecimalPipe, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './required-resources.component.html',
  styleUrl: './required-resources.component.scss',
})
export class RequiredResourcesComponent {
  readonly formattedResources = input.required<FormattedResourceResponse[]>();
  readonly backEvent = output<void>();

  readonly #store = inject(AppStore);
  readonly #clipboard = inject(Clipboard);
  readonly #snackbar = inject(MatSnackBar);

  readonly resourcesLoading = this.#store.resourcesLoading;
  readonly isMobileView = this.#store.isMobileView;

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

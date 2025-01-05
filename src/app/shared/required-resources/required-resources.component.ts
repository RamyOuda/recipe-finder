import { Clipboard } from '@angular/cdk/clipboard';
import { DecimalPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppStore } from '../../store/app.store';

@Component({
  selector: 'required-resources',
  imports: [DecimalPipe, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './required-resources.component.html',
  styleUrl: './required-resources.component.scss',
})
export class RequiredResourcesComponent {
  readonly backEvent = output<void>();

  readonly #store = inject(AppStore);
  readonly #clipboard = inject(Clipboard);
  readonly #snackbar = inject(MatSnackBar);

  readonly resourcesLoading = this.#store.resourcesLoading;
  readonly formattedResources = this.#store.formattedResources;
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

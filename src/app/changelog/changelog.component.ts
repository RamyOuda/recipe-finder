import { Component } from '@angular/core';

@Component({
  selector: 'changelog',
  imports: [],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.scss',
})
export class ChangelogComponent {
  readonly logs: {
    version: string;
    date: string;
    changes: string[];
  }[] = [
    {
      version: '0.0.2',
      date: 'Jan 4, 2025',
      changes: ['Enabled changelog page'],
    },
  ];
}

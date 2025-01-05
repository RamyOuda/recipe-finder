import { Component } from '@angular/core';

@Component({
  selector: 'changelog',
  imports: [],
  templateUrl: './changelog-page.component.html',
  styleUrl: './changelog-page.component.scss',
})
export class ChangelogPageComponent {
  readonly logs: {
    version: string;
    date: string;
    changes: string[];
  }[] = [
    {
      version: '0.2.0',
      date: 'Jan 4, 2025',
      changes: ['Enabled changelog page', 'Enabled Discord link'],
    },
    {
      version: '0.1.0',
      date: 'Jan 2, 2025',
      changes: ['Site live! (beta)'],
    },
  ];
}

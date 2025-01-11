import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-changelog-page',
  imports: [],
  templateUrl: './changelog-page.component.html',
  styleUrl: './changelog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangelogPageComponent {
  readonly logs: {
    version: string;
    date: string;
    changes: string[];
  }[] = [
    {
      version: '0.3.2',
      date: 'Jan 9, 2025',
      changes: [
        'Added reset button to Gear form',
        'Resources now display in a sortable table',
      ],
    },
    {
      version: '0.3.1',
      date: 'Jan 8, 2025',
      changes: [
        'Selected gear now displays over required resources on the Gear page',
      ],
    },
    {
      version: '0.3.0',
      date: 'Jan 5, 2025',
      changes: [
        'Added trophy inputs to Gear page',
        'Added item images to dropdown menus',
      ],
    },
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

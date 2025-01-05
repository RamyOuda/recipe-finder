import { Routes } from '@angular/router';
import { ErrorGuard } from './guards/error.guard';
import { ChangelogPageComponent } from './pages/changelog-page/changelog-page.component';
import { GearPageComponent } from './pages/gear-page/gear-page.component';
import { NetworkErrorPageComponent } from './pages/network-error-page/network-error-page.component';
import { TrophiesPageComponent } from './pages/trophies-page/trophies-page.component';

export const routes: Routes = [
  {
    path: 'gear',
    component: GearPageComponent,
    canActivate: [ErrorGuard],
  },
  {
    path: 'trophies',
    component: TrophiesPageComponent,
    canActivate: [ErrorGuard],
  },
  {
    path: 'changelog',
    component: ChangelogPageComponent,
  },
  {
    path: 'error',
    component: NetworkErrorPageComponent,
    canActivate: [ErrorGuard],
  },
  { path: '', redirectTo: '/gear', pathMatch: 'full' },
  { path: '**', redirectTo: '/gear', pathMatch: 'full' },
];

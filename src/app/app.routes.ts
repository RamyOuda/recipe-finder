import { Routes } from '@angular/router';
import { ErrorGuard } from './guards/error.guard';
import { ChangelogPageComponent } from './pages/changelog-page/changelog-page.component';
import { ConsumablesPageComponent } from './pages/consumables-page/consumables-page.component';
import { GearPageComponent } from './pages/gear-page/gear-page.component';
import { NetworkErrorPageComponent } from './pages/network-error-page/network-error-page.component';

export const routes: Routes = [
  {
    path: 'gear',
    component: GearPageComponent,
    canActivate: [ErrorGuard],
  },
  {
    path: 'consumables',
    component: ConsumablesPageComponent,
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

import { Routes } from '@angular/router';
import { ChangelogComponent } from './changelog/changelog.component';
import { GearRecipePageComponent } from './gear-recipe-page/gear-recipe-page.component';
import { ErrorGuard } from './guards/error.guard';
import { NetworkErrorPageComponent } from './network-error-page/network-error-page.component';

export const routes: Routes = [
  {
    path: 'gear',
    component: GearRecipePageComponent,
    canActivate: [ErrorGuard],
  },
  {
    path: 'changelog',
    component: ChangelogComponent,
    canActivate: [ErrorGuard],
  },
  {
    path: 'error',
    component: NetworkErrorPageComponent,
    canActivate: [ErrorGuard],
  },
  { path: '', redirectTo: '/gear', pathMatch: 'full' },
  { path: '**', redirectTo: '/gear', pathMatch: 'full' },
];

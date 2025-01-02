import { Routes } from '@angular/router';
import { GearRecipePageComponent } from './gear-recipe-page/gear-recipe-page.component';

export const routes: Routes = [
  { path: 'gear', component: GearRecipePageComponent },
  // { path: 'trophies', component: },
  // { path: 'sets', component: },
  // { path: 'consumables', component: },
  // { path: 'changelog', component: },
  { path: '', redirectTo: '/gear', pathMatch: 'full' },
  { path: '**', redirectTo: '/gear', pathMatch: 'full' },
];

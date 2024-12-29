import { Routes } from '@angular/router';
import { GearRecipePageComponent } from './gear-recipe-page/gear-recipe-page.component';

export const routes: Routes = [
  { path: 'gear-recipe', component: GearRecipePageComponent },
  { path: '', redirectTo: '/gear-recipe', pathMatch: 'full' },
  { path: '**', redirectTo: '/gear-recipe', pathMatch: 'full' },
];

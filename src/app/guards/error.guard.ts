import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AppStore } from '../store/app.store';

@Injectable({
  providedIn: 'root',
})
export class ErrorGuard implements CanActivate {
  readonly #store = inject(AppStore);
  readonly #router = inject(Router);

  readonly networkErrorDetected = this.#store.networkErrorDetected;

  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    const error: boolean = this.networkErrorDetected();

    if (error && state.url !== '/error') {
      this.#router.navigate(['/error']);
      return false;
    }

    if (!error && state.url === '/error') {
      this.#router.navigate(['/gear']);
      return false;
    }

    return true;
  }
}

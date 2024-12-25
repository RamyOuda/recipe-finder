import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { AppService } from './app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormattedItems } from '../models/app.model';

interface AppState {
  loading: boolean;
  formattedItems: FormattedItems | null;
}

const initialState: AppState = {
  loading: false,
  formattedItems: null,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(AppService)) => ({
    fetchData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { loading: true });
        }),
        switchMap(() => {
          return service.fetchData().pipe(
            tapResponse({
              next: (response: FormattedItems) => {
                patchState(store, {
                  formattedItems: response,
                  loading: false,
                });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);
                patchState(store, initialState);
                return EMPTY;
              },
            })
          );
        })
      )
    ),
  }))
);

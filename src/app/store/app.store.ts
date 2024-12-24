import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { AppService } from './app.service';

interface AppState {
  loading: boolean;
}

const initialState: AppState = {
  loading: false,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(AppService)) => ({
    fetchAdvice: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { loading: true });
        }),
        switchMap(() => {
          return service.fetchData().pipe(
            tapResponse({
              next: (response) => {
                console.log(response);
                patchState(store, { loading: false });
              },
              error: () => {
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

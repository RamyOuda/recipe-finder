import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { AppService } from './app.service';

interface AppState {
  loading: boolean;
  hats: any[];
  cloaks: any[];
  belts: any[];
  boots: any[];
  amulets: any[];
  rings: any[];
  shields: any[];
  weapons: any[];
}

const initialState: AppState = {
  loading: false,
  hats: [],
  cloaks: [],
  belts: [],
  boots: [],
  amulets: [],
  rings: [],
  shields: [],
  weapons: [],
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
              next: (response: any) => {
                console.log(response);
                patchState(store, { ...response, loading: false });
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

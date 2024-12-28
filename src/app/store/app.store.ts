import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import { FormattedItems, FormattedResource } from '../models/app.model';
import { AppService } from './app.service';

interface AppState {
  pageLoading: boolean;
  formattedItems: FormattedItems | null;
}

const initialState: AppState = {
  pageLoading: false,
  formattedItems: null,
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(AppService)) => ({
    fetchData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { pageLoading: true });
        }),
        switchMap(() => {
          return service.fetchData().pipe(
            tapResponse({
              next: (response: FormattedItems) => {
                patchState(store, {
                  formattedItems: response,
                  pageLoading: false,
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
    fetchResources: rxMethod<FormattedResource[]>(
      pipe(
        tap(() => {
          console.log('fetchResource Triggered');
        }),
        switchMap((resources) => {
          return service.fetchResources(resources).pipe(
            tapResponse({
              next: (response: any) => {
                console.log('Store fetchResource Response:', response);
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);
                return EMPTY;
              },
            })
          );
        })
      )
    ),
  }))
);

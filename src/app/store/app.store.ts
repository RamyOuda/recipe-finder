import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import {
  FormattedItems,
  FormattedResource,
  FormattedResourceResponse,
} from '../models/app.model';
import { AppService } from './app.service';

interface AppState {
  pageLoading: boolean;
  resourcesLoading: boolean;
  formattedItems: FormattedItems | null;
  formattedResources: FormattedResourceResponse[];
}

const initialState: AppState = {
  pageLoading: false,
  resourcesLoading: false,
  formattedItems: null,
  formattedResources: [],
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
          patchState(store, { resourcesLoading: true });
        }),
        switchMap((resources) => {
          return service.fetchResources(resources).pipe(
            tapResponse({
              next: (formattedResources: FormattedResourceResponse[]) => {
                console.log(
                  'Store fetchResource Response:',
                  formattedResources
                );
                patchState(store, {
                  formattedResources,
                  resourcesLoading: false,
                });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);
                patchState(store, {
                  formattedResources: [],
                  resourcesLoading: false,
                });
                return EMPTY;
              },
            })
          );
        })
      )
    ),
  }))
);

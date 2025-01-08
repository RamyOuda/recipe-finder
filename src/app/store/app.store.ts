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
  FormattedSearchResponse,
} from '../models/app.model';
import { AppService } from './app.service';

interface AppState {
  pageLoading: boolean;
  resourcesLoading: boolean;
  dofusLabLoading: boolean;
  formattedItems: FormattedItems | null;
  formattedResources: FormattedResourceResponse[];
  isMobileView: boolean;
  networkErrorDetected: boolean;
  dofusLabItems: FormattedSearchResponse[];
}

const initialState: AppState = {
  pageLoading: false,
  resourcesLoading: false,
  dofusLabLoading: false,
  formattedItems: null,
  formattedResources: [],
  isMobileView: window.innerWidth <= 1000,
  networkErrorDetected: false,
  dofusLabItems: [],
};

export const AppStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, service = inject(AppService)) => ({
    updateView(isMobileView: boolean): void {
      patchState(store, { isMobileView });
    },

    clearFormattedResources(): void {
      patchState(store, { formattedResources: [] });
    },

    fetchData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { pageLoading: true });
        }),
        switchMap(() => {
          return service.fetchData().pipe(
            tapResponse({
              next: (formattedItems: FormattedItems) => {
                patchState(store, { formattedItems });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);

                patchState(store, {
                  networkErrorDetected: true,
                });

                return EMPTY;
              },
              finalize: () => {
                patchState(store, { pageLoading: false });
              },
            }),
          );
        }),
      ),
    ),

    fetchResources: rxMethod<FormattedResource[]>(
      pipe(
        tap(() => {
          patchState(store, { resourcesLoading: true });
        }),
        switchMap((resources: FormattedResource[]) => {
          return service.fetchResources(resources).pipe(
            tapResponse({
              next: (formattedResources: FormattedResourceResponse[]) => {
                patchState(store, { formattedResources });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);

                patchState(store, {
                  formattedResources: [],
                  networkErrorDetected: true,
                });

                return EMPTY;
              },
              finalize: () => {
                patchState(store, { resourcesLoading: false });
              },
            }),
          );
        }),
      ),
    ),
  })),
  withMethods((store, service = inject(AppService)) => ({
    fetchDofusLabItems: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { dofusLabLoading: true });
        }),
        switchMap((buildId: string) => {
          return service.fetchDofusLab(buildId).pipe(
            tapResponse({
              next: (dofusLabItems: FormattedSearchResponse[]) => {
                patchState(store, { dofusLabItems });

                const formattedResources: FormattedResource[] = dofusLabItems
                  .flatMap((item: FormattedSearchResponse) => item.recipe)
                  .reduce(
                    (acc: FormattedResource[], curr: FormattedResource) => {
                      const existing = acc.find((item) => item.id === curr.id);

                      if (existing) {
                        existing.quantity += curr.quantity;
                      } else {
                        acc.push({ ...curr });
                      }

                      return acc;
                    },
                    [],
                  );

                store.fetchResources(formattedResources);
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);
                return EMPTY;
              },
              finalize: () => {
                patchState(store, { dofusLabLoading: false });
              },
            }),
          );
        }),
      ),
    ),
  })),
);

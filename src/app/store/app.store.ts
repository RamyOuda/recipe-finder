import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, pipe, switchMap, tap } from 'rxjs';
import {
  FormattedEquipment,
  FormattedResource,
  FormattedResourceResponse,
} from '../models/app.model';
import { AppService } from './app.service';

interface AppState {
  isPageLoading: boolean;
  isResourcesLoading: boolean;
  isMobileView: boolean;
  isNetworkErrorDetected: boolean;

  formattedEquipment: FormattedEquipment | null;
  formattedConsumables: any;
  formattedResources: FormattedResourceResponse[];
}

const initialState: AppState = {
  isPageLoading: false,
  isResourcesLoading: false,
  isMobileView: window.innerWidth <= 1000,
  isNetworkErrorDetected: false,

  formattedEquipment: null,
  formattedConsumables: null,
  formattedResources: [],
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

    fetchEquipmentData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isPageLoading: true });
        }),
        switchMap(() => {
          return service.fetchEquipmentData().pipe(
            tapResponse({
              next: (formattedEquipment: FormattedEquipment) => {
                patchState(store, { formattedEquipment });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);

                patchState(store, {
                  isNetworkErrorDetected: true,
                });

                return EMPTY;
              },
              finalize: () => {
                patchState(store, { isPageLoading: false });
              },
            }),
          );
        }),
      ),
    ),

    fetchConsumableData: rxMethod<void>(
      pipe(
        tap(() => {
          patchState(store, { isPageLoading: true });
        }),
        switchMap(() => {
          return service.fetchConsumableData().pipe(
            tapResponse({
              next: (formattedConsumables: any) => {
                patchState(store, { formattedConsumables });
              },
              error: (err: HttpErrorResponse) => {
                console.error(err.message);

                patchState(store, {
                  isNetworkErrorDetected: true,
                });

                return EMPTY;
              },
              finalize: () => {
                patchState(store, { isPageLoading: false });
              },
            }),
          );
        }),
      ),
    ),

    fetchResources: rxMethod<FormattedResource[]>(
      pipe(
        tap(() => {
          patchState(store, { isResourcesLoading: true });
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
                  isNetworkErrorDetected: true,
                });

                return EMPTY;
              },
              finalize: () => {
                patchState(store, { isResourcesLoading: false });
              },
            }),
          );
        }),
      ),
    ),
  })),
);

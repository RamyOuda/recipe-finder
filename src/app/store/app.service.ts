import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ItemResponse } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  readonly #http = inject(HttpClient);
  readonly baseUrl = 'https://api.dofusdu.de/dofus3/v1/en';

  fetchData(): Observable<{ [key: string]: ItemResponse[] }> {
    return this.#http
      .get<{ items: ItemResponse[] }>(this.baseUrl + '/items/equipment/all')
      .pipe(
        map(({ items }) => {
          return items.reduce(
            (acc: { [key: string]: ItemResponse[] }, curr: ItemResponse) => {
              const equipmentType = curr.type.name;

              if (acc[equipmentType]) {
                acc[equipmentType].push(curr);
              } else {
                acc[equipmentType] = [curr];
              }

              return acc;
            },
            {}
          );
        })
      );
  }
}

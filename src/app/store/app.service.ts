import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FormattedItems } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  readonly #http = inject(HttpClient);
  readonly baseUrl = 'https://api.dofusdu.de/dofus3/v1/en';

  fetchData(): Observable<FormattedItems> {
    const validCategories: string[] = [
      'hat',
      'cloak',
      'belt',
      'boots',
      'amulet',
      'ring',
      'shield',
    ];

    return this.#http
      .get<{ items: any[] }>(this.baseUrl + '/items/equipment/all')
      .pipe(
        map(({ items }) => {
          return items
            .filter((item: any) => item.recipe)
            .reduce(
              (acc: FormattedItems, curr: any) => {
                const category: keyof typeof acc = curr.type.name.toLowerCase();

                if (curr.is_weapon) {
                  acc.weapon.push(curr);
                } else if (validCategories.includes(category)) {
                  acc[category].push(curr);
                }

                return acc;
              },
              {
                hat: [],
                cloak: [],
                belt: [],
                boots: [],
                amulet: [],
                ring: [],
                shield: [],
                weapon: [],
              }
            );
        })
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import {
  FormattedItem,
  FormattedItems,
  FormattedResource,
  FormattedResourceResponse,
  ResourceResponse,
} from '../models/app.model';

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
      .get<{ items: any[] }>(`${this.baseUrl}/items/equipment/all`)
      .pipe(
        map(({ items }) => {
          return items
            .filter((item: any) => item.recipe)
            .reduce(
              (acc: FormattedItems, curr: any) => {
                const recipe: FormattedResource[] = curr.recipe.map(
                  (rec: any) => ({
                    id: rec.item_ankama_id,
                    quantity: rec.quantity,
                  })
                );

                const formattedItem: FormattedItem = {
                  isWeapon: curr.is_weapon,
                  name: curr.name,
                  recipe,
                  type: curr.type.name,
                };

                const category = formattedItem.type.toLowerCase();

                if (formattedItem.isWeapon) {
                  acc.weapon.push(formattedItem);
                } else if (validCategories.includes(category)) {
                  acc[category as keyof typeof acc].push(formattedItem);
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

  fetchResources(
    resources: FormattedResource[]
  ): Observable<FormattedResourceResponse[]> {
    return forkJoin(
      resources.map(({ id, quantity }) =>
        this.#http
          .get<ResourceResponse>(`${this.baseUrl}/items/resources/${id}`)
          .pipe(
            map((response: ResourceResponse) => ({
              name: response.name,
              imageUrl: response.image_urls.icon,
              quantity,
            }))
          )
      )
    );
  }
}

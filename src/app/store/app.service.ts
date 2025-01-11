import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import {
  FormattedEquipment,
  FormattedItem,
  FormattedResource,
  FormattedResourceResponse,
  ItemResponse,
  RecipeResponse,
  ResourceResponse,
} from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  readonly #http = inject(HttpClient);
  readonly baseUrl = 'https://api.dofusdu.de/dofus3/v1/en';

  fetchEquipmentData(): Observable<FormattedEquipment> {
    const validCategories: string[] = [
      'hat',
      'cloak',
      'belt',
      'boots',
      'amulet',
      'ring',
      'shield',
      'trophy',
    ];

    return this.#http
      .get<{ items: ItemResponse[] }>(`${this.baseUrl}/items/equipment/all`)
      .pipe(
        map(({ items }) =>
          items
            .filter((item: ItemResponse) => item.recipe)
            .reduce(
              (acc: FormattedEquipment, curr: ItemResponse) => {
                const recipe: FormattedResource[] = curr.recipe.map(
                  (rec: RecipeResponse) => ({
                    id: rec.item_ankama_id,
                    subtype: rec.item_subtype,
                    quantity: rec.quantity,
                  }),
                );

                const formattedItem: FormattedItem = {
                  imageUrl: curr.image_urls.icon,
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
                trophy: [],
              },
            ),
        ),
        map((items: FormattedEquipment) => {
          Object.values(items).forEach((category: FormattedItem[]) => {
            category.sort((a: FormattedItem, b: FormattedItem) =>
              a.name.localeCompare(b.name),
            );
          });

          return items;
        }),
      );
  }

  fetchConsumableData(): Observable<any> {
    return this.#http.get<any>(`${this.baseUrl}/items/consumables/all`).pipe(
      tap((response) => {
        console.log(response);
      }),
    );
  }

  fetchResources(
    resources: FormattedResource[],
  ): Observable<FormattedResourceResponse[]> {
    return forkJoin(
      resources.map(({ id, subtype, quantity }) =>
        this.#http
          .get<ResourceResponse>(`${this.baseUrl}/items/${subtype}/${id}`)
          .pipe(
            map((response: ResourceResponse) => ({
              name: response.name,
              imageUrl: response.image_urls.icon,
              level: response.level,
              quantity,
              subtype,
            })),
          ),
      ),
    );
  }
}

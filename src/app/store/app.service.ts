import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, tap } from 'rxjs';
import {
  ConsumableCategories,
  FormattedConsumable,
  FormattedEquipment,
  FormattedItem,
  FormattedResource,
  FormattedResourceResponse,
} from '../models/app.model';
import {
  ConsumablesResponse,
  ItemResponse,
  RecipeResponse,
  ResourceResponse,
} from '../models/service.models';

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

  fetchConsumableData(): Observable<ConsumableCategories> {
    return this.#http
      .get<{
        items: ConsumablesResponse[];
      }>(`${this.baseUrl}/items/consumables/all`)
      .pipe(
        map(({ items }) => {
          const formattedConsumables: FormattedConsumable[] = items
            .filter(({ recipe }) => !!recipe)
            .map((consumable: ConsumablesResponse) => {
              const formattedRecipe: FormattedResource[] =
                consumable.recipe.map((resource: RecipeResponse) => ({
                  id: resource.item_ankama_id,
                  subtype: resource.item_subtype,
                  quantity: resource.quantity,
                }));

              return {
                id: consumable.ankama_id,
                imageUrl: consumable.image_urls.icon,
                level: consumable.level,
                name: consumable.name,
                recipe: formattedRecipe,
                type: consumable.type.name,
              };
            });

          return formattedConsumables.reduce(
            (acc: ConsumableCategories, curr: FormattedConsumable) => {
              const key: string = curr.type
                .toLowerCase()
                .replace(/(?:^\w| \w)/g, (match: string, offset: number) =>
                  offset === 0 ? match.trim() : match.trim().toUpperCase(),
                );

              return acc[key] ? acc[key].push(curr) : (acc[key] = [curr]), acc;
            },
            {},
          );
        }),
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

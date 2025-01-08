import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import {
  ApolloDofusLabResponse,
  DofusLabResponse,
  FormattedItem,
  FormattedItems,
  FormattedResource,
  FormattedResourceResponse,
  FormattedSearchResponse,
  ItemResponse,
  RecipeResponse,
  ResourceResponse,
  SearchResponse,
} from '../models/app.model';
import { dofusLabQuery } from './app.query';

@Injectable({ providedIn: 'root' })
export class AppService {
  readonly #http = inject(HttpClient);
  readonly #apollo = inject(Apollo);

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
      'trophy',
    ];

    return this.#http
      .get<{ items: ItemResponse[] }>(`${this.baseUrl}/items/equipment/all`)
      .pipe(
        map(({ items }) =>
          items
            .filter((item: ItemResponse) => item.recipe)
            .reduce(
              (acc: FormattedItems, curr: ItemResponse) => {
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
        map((items: FormattedItems) => {
          Object.values(items).forEach((category: FormattedItem[]) => {
            category.sort((a: FormattedItem, b: FormattedItem) =>
              a.name.localeCompare(b.name),
            );
          });

          return items;
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
              quantity,
              subtype,
            })),
          ),
      ),
    );
  }

  fetchDofusLab(buildId: string): Observable<FormattedSearchResponse[]> {
    return this.#apollo
      .query<DofusLabResponse>({
        query: dofusLabQuery,
        variables: { id: buildId },
      })
      .pipe(
        map((response: ApolloDofusLabResponse) =>
          response.data.customSetById.equippedItems.map(
            ({ item }) => item.name,
          ),
        ),
        switchMap((itemNames: string[]) =>
          forkJoin(
            itemNames.map((itemName: string) =>
              this.#http
                .get<
                  SearchResponse[]
                >(`${this.baseUrl}/items/equipment/search?query=${encodeURIComponent(itemName)}`)
                .pipe(
                  map((items: SearchResponse[]) =>
                    items.filter((item) => item.recipe).shift(),
                  ),
                ),
            ),
          ).pipe(
            map((items) => items.filter(Boolean)),
            map((items: SearchResponse[] | any) =>
              items.map((item: SearchResponse) => {
                const recipe: FormattedResource[] = item.recipe.map(
                  (rec: RecipeResponse) => ({
                    id: rec.item_ankama_id,
                    subtype: rec.item_subtype,
                    quantity: rec.quantity,
                  }),
                );

                return {
                  imageUrl: item.image_urls.icon,
                  name: item.name,
                  recipe,
                };
              }),
            ),
          ),
        ),
      );
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  readonly #http = inject(HttpClient);
  readonly baseUrl = 'https://api.dofusdu.de/dofus3/v1/en';

  fetchData(): Observable<any> {
    return this.#http
      .get<{ items: any[] }>(this.baseUrl + '/items/equipment/all')
      .pipe(
        map(({ items }) => {
          return items
            .filter((item: any) => item.recipe)
            .reduce(
              (acc: any, curr: any) => {
                if (curr.is_weapon) {
                  acc.weapons.push(curr);
                } else {
                  switch (curr.type.name) {
                    case 'Hat':
                      acc.hats.push(curr);
                      break;
                    case 'Cloak':
                      acc.cloaks.push(curr);
                      break;
                    case 'Belt':
                      acc.belts.push(curr);
                      break;
                    case 'Boots':
                      acc.boots.push(curr);
                      break;
                    case 'Amulet':
                      acc.amulets.push(curr);
                      break;
                    case 'Ring':
                      acc.rings.push(curr);
                      break;
                    case 'Shield':
                      acc.shields.push(curr);
                  }
                }

                return acc;
              },
              {
                hats: [],
                cloaks: [],
                belts: [],
                boots: [],
                amulets: [],
                rings: [],
                shields: [],
                weapons: [],
              }
            );
        })
      );
  }
}

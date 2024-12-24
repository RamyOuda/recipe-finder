export interface ItemResponse {
  ankama_id: number;
  description: string;
  effects: Effects[];
  image_urls: ImageUrls;
  is_weapon: boolean;
  level: number;
  name: string;
  parent_set: ParentSet;
  pods: number;
  recipe: Recipe[];
  type: Type;
}

interface Effects {
  formatted: string;
  ignore_int_max: boolean;
  ignore_int_min: boolean;
  int_maximum: number;
  int_minimum: number;
}

interface ImageUrls {
  icon: string;
  sd: string;
}

interface ParentSet {
  id: number;
  name: string;
}

interface Recipe {
  item_ankama_id: number;
  item_subtype: string;
  quantity: number;
}

interface Type {
  name: string;
  id: number;
}

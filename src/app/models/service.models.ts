export interface ItemResponse {
  image_urls: {
    icon: string;
  };
  is_weapon: boolean;
  name: string;
  recipe: RecipeResponse[];
  type: {
    name: string;
  };
}

export interface ConsumablesResponse {
  ankama_id: number;
  image_urls: {
    icon: string;
  };
  level: number;
  name: string;
  recipe: RecipeResponse[];
  type: {
    name: string;
  };
}

export interface ResourceResponse {
  image_urls: {
    icon: string;
  };
  name: string;
  level: number;
}

export interface RecipeResponse {
  item_ankama_id: number;
  item_subtype: string;
  quantity: number;
}

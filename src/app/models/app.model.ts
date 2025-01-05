export interface FormattedItems {
  hat: FormattedItem[];
  cloak: FormattedItem[];
  belt: FormattedItem[];
  boots: FormattedItem[];
  amulet: FormattedItem[];
  ring: FormattedItem[];
  shield: FormattedItem[];
  weapon: FormattedItem[];
  trophy: FormattedItem[];
}

export interface FormattedItem {
  isWeapon: boolean;
  name: string;
  recipe: FormattedResource[];
  type: string;
}

export interface ItemResponse {
  is_weapon: boolean;
  name: string;
  recipe: RecipeResponse[];
  type: {
    name: string;
  };
}

export interface RecipeResponse {
  item_ankama_id: number;
  item_subtype: string;
  quantity: number;
}

export interface FormattedResource {
  id: number;
  subtype: string;
  quantity: number;
}

export interface ResourceResponse {
  image_urls: {
    icon: string;
  };
  name: string;
}

export interface FormattedResourceResponse {
  name: string;
  imageUrl: string;
  quantity: number;
  subtype: string;
}

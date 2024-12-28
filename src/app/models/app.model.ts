export interface FormattedItems {
  hat: FormattedItem[];
  cloak: FormattedItem[];
  belt: FormattedItem[];
  boots: FormattedItem[];
  amulet: FormattedItem[];
  ring: FormattedItem[];
  shield: FormattedItem[];
  weapon: FormattedItem[];
}

export interface FormattedItem {
  isWeapon: boolean;
  name: string;
  recipe: FormattedResource[];
  type: string;
}

export interface FormattedResource {
  id: number;
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
}

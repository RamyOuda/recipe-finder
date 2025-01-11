export interface FormattedEquipment {
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
  imageUrl: string;
  isWeapon: boolean;
  name: string;
  recipe: FormattedResource[];
  type: string;
}

export interface FormattedResource {
  id: number;
  subtype: string;
  quantity: number;
}

export interface FormattedResourceResponse {
  name: string;
  imageUrl: string;
  quantity: number;
  subtype: string;
  level: number;
}

export interface FormattedConsumable {
  id: number;
  imageUrl: string;
  level: number;
  name: string;
  recipe: FormattedResource[];
  type: string;
}

export interface ConsumableCategories {
  [k: string]: FormattedConsumable[];
}

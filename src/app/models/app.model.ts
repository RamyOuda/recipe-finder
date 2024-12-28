export interface FormattedItems {
  hat: any[];
  cloak: any[];
  belt: any[];
  boots: any[];
  amulet: any[];
  ring: any[];
  shield: any[];
  weapon: any[];
}

export interface FormattedResource {
  resourceId: number;
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

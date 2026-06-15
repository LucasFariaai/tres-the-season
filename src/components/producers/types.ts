export interface Producer {
  name: string;
  specialty: string;
  distance: string;
  image: string;
  region: string;
  lat: number;
  lng: number;
  quote: string;
  /** Scale 0.5–1.5. <1 shrinks the photo, revealing the section background around it. Default 1. */
  imageScale?: number;
  /** Horizontal offset in percent (-50..50). Default 0. */
  imageOffsetX?: number;
  /** Vertical offset in percent (-50..50). Default 0. */
  imageOffsetY?: number;
}

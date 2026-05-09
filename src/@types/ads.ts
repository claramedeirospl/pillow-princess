export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  icon: string;
  bgColor: string;
}

export interface Promotion {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: string;
}

export interface AdsData {
  banners: Banner[];
  promotions: Promotion[];
}

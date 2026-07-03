export type NoteKind = "play" | "food" | "route" | "supplement";

export interface SourceNote {
  title: string;
  url: string;
  qr: string;
  kind: NoteKind;
}

export interface QuickPick {
  tag: string;
  title: string;
  body: string;
}

export interface Place {
  name: string;
  meta: [string, string] | string[];
  summary: string;
  food: string;
  tip: string;
  notes: SourceNote[];
}

export interface CitySection {
  id: string;
  label: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  places: Place[];
}

export interface RouteCard {
  title: string;
  steps: string[];
}

export interface GuideData {
  meta: {
    title: string;
    description: string;
    evidenceDate: string;
    brand: string;
  };
  nav: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    titleLines: string[];
    copy: string;
    image: string;
    imageAlt: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  quickPicks: QuickPick[];
  cities: CitySection[];
  routes: RouteCard[];
  preDepartureNotes: string[];
  footer: string;
}

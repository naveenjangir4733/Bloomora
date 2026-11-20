export interface ContentSection {
  heading: string;
  paragraphs: string[];
}

export interface ContentPage {
  slug: string;
  title: string;
  summary: string;
  sections: ContentSection[];
  updatedAt: string;
}

export interface ContentPageLink {
  slug: string;
  title: string;
}

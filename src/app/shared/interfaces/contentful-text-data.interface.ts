export interface SelectedLanguage {
  code: string;
  displayName: string;
  isoCode: string;
}

export interface LanguageInfo {
  code: string; // spanish, english, etc.
  isoCode: string; // es-ES, en-US, fr-FR, etc.
  displayName: string;
}
export interface DynamicTranslations {
  [language: string]: { [key: string]: string };
}

export interface I18n {
  [key: string]: string;
}

export interface IContentfulDataTextResponse {
  sys: IContentfulDataTextResponseSys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

export interface Item {
  metadata: Metadata;
  sys: ItemSys;
  fields: Fields;
}

export interface Fields {
  title: string;
  slug: string;
  language: string;
  value: { [key: string]: string };
  isoCode: string;
}

export interface Metadata {
  tags: any[];
  concepts: any[];
}

export interface ItemSys {
  space: ContentType;
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  environment: ContentType;
  publishedVersion: number;
  revision: number;
  styleContentTypeId: ContentType;
  locale: string;
}

export interface ContentType {
  sys: ContentTypeSys;
}

export interface ContentTypeSys {
  type: string;
  linkType: string;
  id: string;
}

export interface IContentfulDataTextResponseSys {
  type: string;
}

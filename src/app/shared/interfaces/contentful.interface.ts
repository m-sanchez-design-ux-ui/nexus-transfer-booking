export interface IContentfulDataResponse {
  sys: IContentfulDataResponseSys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
  includes: Includes;
}

export interface Includes {
  Asset: Asset[];
}

export interface Asset {
  metadata: Metadata;
  sys: AssetSys;
  fields: AssetFields;
}

export interface AssetFields {
  title: string;
  description: string;
  file: File;
}

export interface File {
  url: string;
  details: Details;
  fileName: string;
  styleContentTypeId: string;
}

export interface Details {
  size: number;
  image: Image;
}

export interface Image {
  width: number;
  height: number;
}

export interface Metadata {
  tags: any[];
  concepts: any[];
}

export interface AssetSys {
  space: BackgroundImage01;
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  environment: BackgroundImage01;
  publishedVersion: number;
  revision: number;
  locale: string;
  styleContentTypeId?: BackgroundImage01;
}

export interface BackgroundImage01 {
  sys: BackgroundImage01Sys;
}

export interface BackgroundImage01Sys {
  id: string;
  type: Type;
  linkType: LinkType;
}

export enum LinkType {
  Asset = 'Asset',
  ContentType = 'ContentType',
  Environment = 'Environment',
  Space = 'Space',
}

export enum Type {
  Link = 'Link',
}

export interface Item {
  metadata: Metadata;
  sys: AssetSys;
  fields: ItemFields;
}

export interface ItemFields {
  title: string;
  cssRoot: string;
  fontFace: string;
  slug: string;
  backgroundImage01: BackgroundImage01;
  backgroundImage02: BackgroundImage01;
  backgroundImage03: BackgroundImage01;
  backgroundImage04: BackgroundImage01;
  backgroundImage05: BackgroundImage01;
  backgroundImageGraphicElement01: BackgroundImage01;
  backgroundImageGraphicElement02: BackgroundImage01;
  backgroundImageGraphicElement03: BackgroundImage01;
  backgroundImageGraphicElement04: BackgroundImage01;
  backgroundImageLogo: BackgroundImage01;
  backgroundImageQr: BackgroundImage01;
  backgroundImageLogoGroupDesktop: BackgroundImage01;
  backgroundImageLogoGroupMobile: BackgroundImage01;
}

export interface IContentfulDataResponseSys {
  type: string;
}

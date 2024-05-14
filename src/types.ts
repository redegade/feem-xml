interface FeemFile {
  Shipment: FeemShipment;
}

interface FeemShipment {
  attr: {
    FileCreator?: string;
    FileType?: string;
    FileVersion?: string;
    Hash?: string;
    ['xmlns:xsi']?: string;
    ['xsi:noNamespaceSchemaLocation']?: string;
  };
  MessageId?: string;
  MessageTime?: string;
  MessageType?: string;
  DeliveryNoteNumber?: string;
  ExpectedDeliveryDate?: string;
  DeliveryComment?: string;
  ShipmentNumber?: string;
  ShipmentDate?: string;
  PurchaseOrderNumber?: string;
  Receiver?: FeemActor;
  Shipper?: FeemActor | {Shipper: FeemActor[]};
  Sender?: FeemActor;
  SummaryItems?: {
    SummaryItem?: FeemSummaryItem[] | FeemSummaryItem;
  };
  Units?: {
    Unit: FeemUnit[];
  };
  Items?: {
    Item: FeemItem[];
  };
  Item?: FeemItem;
}

interface FeemItemInfo {
  ProducerProductCode?: string;
  CustomerProductCode?: string;
  ProducerProductName?: string;
  PurchaseOrderLineNumber?: string;
  DeliveryNoteLineNumber?: string;
  ItemQuantity?: number;
  ItemComment?: string;
  CountOfTradeUnits?: number;
  PackagingLevel?: string;
  BatchNumber?: string;
  ProductionDate?: string;
  NetExplosiveWeight?: number;
  Length?: number;
  Width?: number;
  DepthThickness?: number;
  Area?: number;
  NetVolumeLitre?: number;
  NetVolumeCubic?: number;
  GrossWeight?: number;
  UnitOfMeasure?: string;
  UNNumber?: string;
  TunnelCode?: string;
  RiskIdentification?: string;
}

interface FeemSummaryItem extends FeemItemInfo {
  attr: {
    SID: string;
    PSN: string;
  };
}

interface FeemSummaryItemsMap {
  [key: string]: FeemSummaryItem;
}

interface FeemUnitTreeMap {
  [key: string]: FeemUnitTree;
}

interface FeemUnitTree extends FeemItemInfo {
  attr: {
    UID: string;
    PSN: string;
    SID: string;
  };
  Units?: FeemUnitTreeMap;
  Items?: FeemUnitTreeMap;
}

interface FeemUnit extends FeemItemInfo {
  attr: {
    UID: string;
    PSN: string;
    SID: string;
  };
  Units?: {
    Unit: FeemUnit[];
  };
  Items?: {
    Item: FeemItem[];
  };
}

interface FeemItem extends FeemItemInfo {
  attr: {
    UID: string;
    PSN: string;
    SID: string;
  };
}

interface FeemActor {
  Code?: string;
  Name?: string;
  Name2?: string;
  AddressCode?: string;
  Address?: string;
  Address2?: string;
  ZipCode?: string;
  City?: string;
  Country?: string;
  State?: string;
}

interface FeemItemFlat {
  uid: string;
  psn: string;
  parentLine?: string[];
  parentPackageLevel?: string[];
  sid?: string;
}

export type {
  FeemFile,
  FeemShipment,
  FeemActor,
  FeemSummaryItem,
  FeemSummaryItemsMap,
  FeemItem,
  FeemUnit,
  FeemItemFlat,
  FeemItemInfo,
  FeemUnitTree,
  FeemUnitTreeMap,
};

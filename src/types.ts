interface FeemFile {
  Shipment: FeemShipment;
}

interface FeemShipment {
  attr: {
    FileCreator?: string;
    FileType?: string;
    FileVersion?: string;
    Hash?: string;
  };
  MessageId?: string;
  MessageTime?: string;
  MessageType?: string;
  DeliveryNoteNumber?: string;
  ExpectedDeliveryDate?: string;
  Receiver?: FeemActor;
  Shipper?: FeemActor | FeemActor[];
  Sender?: FeemActor;
  DeliveryComment?: string;
  ShipmentNumber?: string;
  ShipmentDate?: string;
  PurchaseOrderNumber?: string;
  SummaryItems?: FeemSummaryItem[];
  Items?: FeemItem[];
  Units?: FeemUnit[];
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

interface FeemUnit extends FeemItemInfo {
  attr: {
    UID: string;
    PSN: string;
    SID: string;
  };
  Units?: FeemUnit[];
  Items?: FeemItem[];
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

export type {FeemFile, FeemShipment, FeemSummaryItem, FeemItem, FeemActor};

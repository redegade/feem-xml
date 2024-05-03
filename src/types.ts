interface FeemShipment {
  fileAttributes?: FeemFileAttributes;
  messageId?: string;
  messageTime?: string;
  messageType?: string;
  deliveryNoteNumber?: string;
  expectedDeliveryDate?: string;
  receiver?: FeemActor;
  shipper?: FeemActor | FeemActor[];
  sender?: FeemActor;
  deliveryComment?: string;
  shipmentNumber?: string;
  shipmentDate?: string;
  purchaseOrderNumber?: string;
  summaryItems?: FeemSummaryItem[];
  items?: FeemItem[];
  units?: FeemItem[];
}

interface FeemFileAttributes {
  fileCreator?: string;
  fileType?: string;
  fileVersion?: string;
  hash?: string;
}

interface FeemSummaryItem {
  sid: string;
  psn: string;
  producerProductCode?: string;
  customerProductCode?: string;
  producerProductName?: string;
  purchaseOrderLineNumber?: string;
  deliveryNoteLineNumber?: string;
  itemQuantity?: number;
  countOfTradeUnits?: number;
  packagingLevel?: string;
  batchNumber?: string;
  productionDate?: string;
  netExplosiveWeight?: number;
  length?: number;
  width?: number;
  depthThickness?: number;
  area?: number;
  netVolumeLitre?: number;
  netVolumeCubic?: number;
  grossWeight?: number;
  itemComment?: string;
  unitOfMeasure?: string;
  UNNumber?: string;
  tunnelCode?: string;
  riskIdentification?: string;
}

interface FeemItem {
  psn: string;
  uid: string;
  sid?: string;
  parentLine: string[];
}

interface FeemActor {
  code?: string;
  name?: string;
  name2?: string;
  addressCode?: string;
  address?: string;
  address2?: string;
  zipCode?: string;
  city?: string;
  country?: string;
  state?: string;
}

export type {
  FeemShipment,
  FeemFileAttributes,
  FeemSummaryItem,
  FeemItem,
  FeemActor,
};

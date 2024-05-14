import FeemXml from './FeemXml';
import {
  FeemActor,
  FeemItem,
  FeemItemFlat,
  FeemItemInfo,
  FeemShipment,
  FeemSummaryItem,
  FeemUnit,
  FeemUnitTreeMap,
} from './types';

class FeemXmlBuilder {
  // File attributes
  fileCreator: string = 'feem-xml';
  fileType: string = 'FEEM-Std';
  fileVersion: string = '1.0';
  hash: string = '';

  // Shipment attributes
  messageId: string | undefined;
  messageTime: string = new Date().toISOString();
  messageType: string = 'Shipment';
  deliveryNoteNumber: string | undefined;
  expectedDeliveryDate: string | undefined;
  deliveryComment: string | undefined;
  shipmentNumber: string | undefined;
  shipmentDate: string | undefined;
  purchaseOrderNumber: string | undefined;
  sender: FeemActor = {};
  receiver: FeemActor = {};
  shipper: FeemActor | {Shipper: FeemActor[]} | undefined = undefined;
  products: {[code: string]: FeemSummaryItem} = {};

  UnitsTree?: FeemUnitTreeMap | undefined;
  Items?: {[itemUid: string]: FeemItem} | undefined;
  Item?: FeemItem | undefined;

  setFileCreator(fileCreator: string) {
    this.fileCreator = fileCreator;
  }

  setMessageId(messageId: string) {
    this.messageId = messageId;
  }

  setMessageTime(date: Date) {
    this.messageTime = date.toISOString();
  }

  setDeliveryNoteNumber(deliveryNoteNumber: string) {
    this.deliveryNoteNumber = deliveryNoteNumber;
  }

  setExpectedDeliveryDate(date: Date) {
    this.expectedDeliveryDate = date.toISOString();
  }

  setDeliveryComment(comment: string) {
    this.deliveryComment = comment;
  }

  setShipmentNumber(shipmentNumber: string) {
    this.shipmentNumber = shipmentNumber;
  }

  setShipmentDate(date: Date) {
    this.shipmentDate = date.toISOString();
  }

  setPurchaseOrderNumber(purchaseOrderNumber: string) {
    this.purchaseOrderNumber = purchaseOrderNumber;
  }

  setSender(sender: FeemActor) {
    this.sender = sender;
  }

  setReceiver(receiver: FeemActor) {
    this.receiver = receiver;
  }

  // Adds a shipper to the shipment. If there is already a shipper, it will be converted to an array.
  addShipper(shipper: FeemActor) {
    if (!this.shipper) {
      this.shipper = shipper;
      return;
    }

    if (Array.isArray(this.shipper)) {
      this.shipper.push(shipper);
    } else {
      const currentShipper = this.shipper as FeemActor;
      this.shipper = {Shipper: [currentShipper, shipper]};
    }
  }

  // Adds a product to the shipment. Any item that matches this product will be assigned this product.
  addProduct(product: FeemItemInfo, psn: string): FeemSummaryItem {
    const code = product.ProducerProductCode;
    if (!code) {
      throw new Error('Product must have a ProducerProductCode.');
    }
    const sid = 'S' + Object.keys(this.products).length + 1;
    const summaryItem: FeemSummaryItem = {
      attr: {
        SID: sid,
        PSN: psn,
      },
      ...product,
      ItemQuantity: 0,
    };
    this.products[code] = summaryItem;
    return summaryItem;
  }

  // Adds an item to the shipment. The item will be assigned to the product with the given productCode.
  addItem(item: FeemItemFlat, productCode: string, productName?: string) {
    const summaryItem = this._getOrCreateProduct(
      productCode,
      item.psn,
      productName
    );

    // If there is an items list, add the item to the list

    if (!item.parentLine || item.parentLine.length === 0) {
      this._addItemWithNoParentLine(item, summaryItem);
    } else {
      // If there are items in the file without a parent line, we cannot add items with a parent line
      if (this.Items) {
        throw new Error(
          'Cannot add items with a parent line when there are items in the file without a parent line. If you want to add items with a parent line, all of the items added must have a parent line.'
        );
      }

      // Initialize the UnitsTree if it does not exist
      this.UnitsTree = this.UnitsTree || {};

      // Add the item to the UnitsTree
      this._addItemToTree(item, summaryItem, this.UnitsTree);
    }
  }

  // If the product does not exist, create it, then return it
  private _getOrCreateProduct(
    productCode: string,
    psn: string,
    productName?: string
  ): FeemSummaryItem {
    if (!this.products[productCode]) {
      this.addProduct(
        {
          ProducerProductCode: productCode,
          ProducerProductName: productName || '',
          ItemQuantity: 0,
        },
        psn
      );
    }

    return this.products[productCode];
  }

  // Adds a final item to the tree structure
  private _addItemToTree(
    item: FeemItemFlat,
    summaryItem: FeemSummaryItem,
    unitTreeMap: FeemUnitTreeMap
  ) {
    const sid = summaryItem.attr.SID;

    // If there is no more parent line, we are at the end of the tree, add the item to the Items and return
    if (!item.parentLine || item.parentLine.length === 0) {
      unitTreeMap[item.uid] = {
        attr: {
          UID: item.uid,
          PSN: item.psn,
          SID: sid,
        },
      };
      return;
    }

    // Get the eldest (last) parent of this item which should sit at the root of its tree.
    const eldestParentUid = item.parentLine.pop()!; // Can't be undefined because we checked for parentLine.length === 0 above
    let parentUnit = unitTreeMap[eldestParentUid];

    // If eldest parent does not exist at this level of the tree, create it
    if (!parentUnit) {
      parentUnit = {
        attr: {
          UID: eldestParentUid,
          PSN: item.psn,
          SID: sid,
        },
      };
      unitTreeMap[eldestParentUid] = parentUnit;
    }

    // Decide if we have to go deeper into the tree or add the item to the current level
    if (item.parentLine.length === 0) {
      // If there are no more parents, we have to add the item to the current level Items
      parentUnit.Items = parentUnit.Items || {};
      this._addItemToTree(item, summaryItem, parentUnit.Items);
    } else {
      // If there are more parents, we have to go deeper into the tree, add it to the Units
      parentUnit.Units = parentUnit.Units || {};
      this._addItemToTree(item, summaryItem, parentUnit.Units);
    }
  }

  // Adds an item to the Items list. This is only allowed if there are no units in the file.
  private _addItemWithNoParentLine(
    item: FeemItemFlat,
    summaryItem: FeemSummaryItem
  ) {
    const itemToAdd = {
      attr: {
        UID: item.uid,
        PSN: item.psn,
        SID: summaryItem.attr.SID,
      },
    };

    if (this.UnitsTree) {
      throw new Error(
        'Cannot add items without a parent line when there are units in the file. If a file already has units, all other items must have a parent line. If you want to add items without a parent line, all of the items added must not have a parent line.'
      );
    }

    // If items already exists, append the item to the list
    if (this.Items) {
      this.Items[item.uid] = itemToAdd;
    } else {
      this.Items = {[item.uid]: itemToAdd};
    }
  }

  // Builds the Units from the UnitsTree to be added to the Shipment
  private _buildUnitsFromTree(unitsTree: FeemUnitTreeMap): FeemUnit[] {
    return Object.values(unitsTree).map(unit => {
      return {
        ...unit,
        Units: unit.Units
          ? {Unit: this._buildUnitsFromTree(unit.Units)}
          : undefined,
        Items: unit.Items ? {Item: Object.values(unit.Items)} : undefined,
      };
    });
  }

  // Builds a FeemXml object from the current builder state
  build(): FeemXml {
    const Shipment: FeemShipment = {
      attr: {
        FileCreator: this.fileCreator,
        FileType: this.fileType,
        FileVersion: this.fileVersion,
        Hash: this.hash,
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
        'xsi:noNamespaceSchemaLocation': 'FEEM-Std.xsd',
      },
      MessageId: this.messageId,
      MessageTime: this.messageTime,
      MessageType: this.messageType,
      DeliveryNoteNumber: this.deliveryNoteNumber,
      ExpectedDeliveryDate: this.expectedDeliveryDate,
      DeliveryComment: this.deliveryComment,
      ShipmentNumber: this.shipmentNumber,
      ShipmentDate: this.shipmentDate,
      PurchaseOrderNumber: this.purchaseOrderNumber,
      Sender: this.sender,
      Receiver: this.receiver,
      Shipper: this.shipper,
      SummaryItems: {
        SummaryItem: Object.values(this.products),
      },
    };

    if (this.Items) {
      Shipment.Items = {Item: Object.values(this.Items)};
    } else if (this.UnitsTree) {
      Shipment.Units = {Unit: this._buildUnitsFromTree(this.UnitsTree)};
    }

    return new FeemXml(Shipment);
  }
}

export default FeemXmlBuilder;

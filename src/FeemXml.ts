import * as md5 from 'md5';
import {FeemJsonToXmlParser, FeemXmlToJsonParser} from './parser';
import {
  FeemItemFlat,
  FeemShipment,
  FeemSummaryItemsMap,
  FeemUnit,
} from './types';

class FeemXml {
  public shipment: FeemShipment;

  constructor(shipment?: FeemShipment) {
    this.shipment = shipment || ({} as FeemShipment);
  }

  public buildSummaryItemsMap(): FeemSummaryItemsMap {
    if (!this.shipment) {
      throw new Error('No shipment data found.');
    }

    let summaryItems = this.shipment.SummaryItems?.SummaryItem;
    if (!summaryItems) {
      throw new Error('No summary items found in the shipment.');
    }

    if (!Array.isArray(summaryItems)) {
      summaryItems = [summaryItems];
    }

    // Convert the summary items to a map
    const summaryItemsMap = summaryItems.reduce((allItems, item) => {
      return {
        ...allItems,
        [item.attr.SID]: item,
      };
    }, {});

    return summaryItemsMap;
  }

  public getItemsFlat(): FeemItemFlat[] {
    if (!this.shipment) {
      throw new Error('No shipment data found.');
    }

    if (!this.shipment.Items && !this.shipment.Units && !this.shipment.Item) {
      throw new Error('No items found in the shipment.');
    }

    const summaryItemsMap = this.buildSummaryItemsMap();
    const items = this._getItems(this.shipment, [], summaryItemsMap);
    return items;
  }

  public _getItems(
    parentUnit: FeemUnit | FeemShipment,
    parentLine: string[] = [],
    summaryItemsMap: FeemSummaryItemsMap
  ): FeemItemFlat[] {
    // Stores the flat list of items for this level
    const itemsFlat: FeemItemFlat[] = [];

    // Find the children of the parent unit that is passed to the function
    let childrenUnits = parentUnit?.Units?.Unit ? parentUnit.Units.Unit : [];

    // If there is only one child unit, or it is not an array, make it an array
    if (!Array.isArray(childrenUnits)) childrenUnits = [childrenUnits];

    // Loop through the units to extract the items.
    // If the unit has a list of unique items, it will be handled by the _getUniqueItems function and not recuse further.
    // If the unit has a list of units, it will recurse further.
    for (const childUnit of childrenUnits) {
      if (childUnit.Items) {
        itemsFlat.push(
          ...this._getUniqueItems(childUnit, parentLine, summaryItemsMap)
        );
      } else {
        itemsFlat.push(
          ...this._getItems(childUnit, parentLine, summaryItemsMap)
        );
      }
    }

    return itemsFlat;
  }

  /**
   * Builds a flat list of items from a unit that has a list of unique items. This is the last level of recursion. In real life, this is the last level of packaging before the actual unique explosive items.
   * @param {FeemUnit} unit The unit that has a list of unique items
   * @param {parentLine} parentLine The parent line of the unit until this point
   * @param {FeemSummaryItemsMap} summaryItemsMap The map of summary items
   * @returns {FeemItemFlat[]} The flat list of items
   */
  public _getUniqueItems(
    unit: FeemUnit,
    parentLine: string[],
    summaryItemsMap: FeemSummaryItemsMap
  ): FeemItemFlat[] {
    let itemsFlat: FeemItemFlat[] = [];

    if (unit.Items) {
      let items = unit.Items.Item;
      // If there is only one item, or it is not an array, make it an array
      if (!Array.isArray(items)) items = [items];

      for (const item of items) {
        itemsFlat.push({
          uid: item.attr.UID,
          psn: item.attr.PSN,
          parentLine: [unit.attr.UID, ...parentLine],
          sid: item.attr.SID,
        });
      }
    } else {
      itemsFlat = this._getItems(unit, parentLine, summaryItemsMap);
    }

    return itemsFlat;
  }

  public toXml(): string {
    // Generate the XML content
    const xml = FeemJsonToXmlParser.build({
      Shipment: this.shipment,
    });

    // Generate the hash on the XML content with empty hash value
    const hash = this._generateHash(xml);

    // Update the hash value in the shipment
    this.shipment.attr.Hash = hash;

    // Generate the XML content with the hash value
    const xmlWithHash = FeemJsonToXmlParser.build({
      Shipment: this.shipment,
    });

    return xmlWithHash;
  }

  public fromXml(xmlContent: string): void {
    let feemFile = null;
    try {
      feemFile = FeemXmlToJsonParser.parse(xmlContent);
      if (!feemFile.Shipment) {
        throw new Error('Invalid XML file: missing root Shipment element.');
      }
    } catch (ex) {
      throw new Error('Failed to parse XML file.' + ex);
    }
    this.shipment = feemFile.Shipment;
  }

  _generateHash(xmlContent: string): string {
    return md5(xmlContent);
  }
}

export default FeemXml;

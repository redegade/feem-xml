import readFeemXml from './readFeemXml';
import {FeemShipment} from './types';

class FeemXml {
  public shipment: FeemShipment;
  constructor(shipment?: FeemShipment) {
    this.shipment = shipment || ({} as FeemShipment);
  }

  public buildFromXml(xmlContent: string) {
    try {
      this.shipment = readFeemXml(xmlContent);
    } catch (ex) {
      throw new Error('Failed to parse XML file.' + ex);
    }
  }

  public buildFromJson(jsonContent: FeemShipment) {
    this.shipment = jsonContent;
  }

  public getItemsFlat() {
    console.log('getItemsFlat');
  }
}

export default FeemXml;

import FeemXmlParser from './parser';
import {FeemFile, FeemShipment} from './types';

export default function readFeemXml(xmlContent: string): FeemShipment {
  try {
    const feemFile = parseXml(xmlContent);
    const shipment = feemFile.Shipment;
    if (!shipment) {
      throw new Error('Invalid XML file: missing root Shipment element.');
    }
    return shipment;
  } catch (ex) {
    throw new Error('Failed to parse XML file.' + ex);
  }
}

const parseXml = (fileContent: string): FeemFile => {
  const shipmentJson = FeemXmlParser.parse(fileContent);
  if (!shipmentJson) {
    throw new Error('Invalid XML file: missing root Shipment element.');
  }
  return shipmentJson as FeemFile;
};

export {parseXml};

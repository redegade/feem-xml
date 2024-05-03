import FeemXmlParser from './parser';
import {FeemFileAttributes} from './types';

export default function readFeemXml(xmlContent: string) {
  try {
    const fileJson = parseXml(xmlContent);
    const shipmentJson = fileJson.Shipment;
    if (!shipmentJson) {
      throw new Error('Invalid XML file: missing root Shipment element.');
    }
    console.debug('Shipment JSON:', shipmentJson);
  } catch (ex) {
    throw new Error('Failed to parse XML file.' + ex);
  }
}

const parseXml = (fileContent: string): any => {
  const shipmentJson = FeemXmlParser.parse(fileContent);
  if (!shipmentJson) {
    throw new Error('Invalid XML file: missing root Shipment element.');
  }
  return shipmentJson;
};

const readFileAttributes = (shipmentJson: any): FeemFileAttributes | null => {
  if (!shipmentJson.attr) {
    return null;
  }

  const shipmentInfo = {
    fileCreator: shipmentJson.attr.FileCreator?.toString(),
    fileType: shipmentJson.attr.FileType?.toString(),
    fileVersion: shipmentJson.attr.FileVersion?.toString(),
    hash: shipmentJson.attr.Hash?.toString(),
  };

  return shipmentInfo;
};

export {readFileAttributes, parseXml};

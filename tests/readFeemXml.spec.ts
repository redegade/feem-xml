import {readFileSync} from 'fs';
import {join} from 'path';
import readFeemXml, {parseXml, readFileAttributes} from '../src/readFeemXml';

describe('readFeemXml', () => {
  it('should read a valid XML file', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_root_node.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    expect(() => readFeemXml(xmlString)).not.toThrow();
  });

  it('should be able to read file attributes', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_root_node.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const shipmentJson = parseXml(xmlString);
    const fileAttributes = readFileAttributes(shipmentJson.Shipment);
    expect(fileAttributes).toEqual({
      fileCreator: 'FileCreator',
      fileType: 'FEEM-Std',
      fileVersion: '1.0',
      hash: 'MD5HashValue',
    });
  });
});

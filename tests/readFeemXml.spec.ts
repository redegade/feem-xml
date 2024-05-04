import {readFileSync} from 'fs';
import {join} from 'path';
import readFeemXml from '../src/readFeemXml';

describe('readFeemXml', () => {
  it('should read a valid XML file', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_root_node.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    expect(() => readFeemXml(xmlString)).not.toThrow();
  });
});

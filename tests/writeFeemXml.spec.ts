import FeemXml from '../src/FeemXml';
import writeFeemXml from '../src/writeFeemXml';

describe('writeFeemXml', () => {
  it('should write a valid XML file', () => {
    const feemFile = new FeemXml();
    const xmlString = writeFeemXml(feemFile);
    expect(xmlString).toBeDefined();
    expect(xmlString).toEqual('<Shipment></Shipment>');
  });
});

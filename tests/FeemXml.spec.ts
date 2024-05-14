import {readFileSync} from 'fs';
import {join} from 'path';
import FeemXml from '../src/FeemXml';

describe('FeemXml', () => {
  it('should build a Feem Shipment from xml string', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_root_node.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const feemXml = new FeemXml();
    expect(() => feemXml.fromXml(xmlString)).not.toThrow();
    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.attr.FileCreator).toEqual('FileCreator');
  });

  it('should be able to get the Summary Items of a Shipment in a map', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_summary_items.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const feemXml = new FeemXml();
    feemXml.fromXml(xmlString);
    expect(() => feemXml.buildSummaryItemsMap()).not.toThrow();
    expect(feemXml.buildSummaryItemsMap()).toEqual({
      S1: {
        attr: {
          SID: 'S1',
          PSN: 'EX123',
        },
      },
      S2: {
        attr: {
          SID: 'S2',
          PSN: 'EX123',
        },
      },
    });
  });

  it('should be able to get one flat item', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_units.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const feemXml = new FeemXml();
    feemXml.fromXml(xmlString);
    expect(() => feemXml.getItemsFlat()).not.toThrow();
    expect(feemXml.getItemsFlat()).toEqual([
      {
        uid: 'UID_1',
        psn: 'EX123',
        parentLine: ['PARENT_UNIT_1'],
        sid: 'S1',
      },
    ]);
  });

  it('should be able to get all flat items from all packaging levels', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_items.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const feemXml = new FeemXml();
    feemXml.fromXml(xmlString);

    expect(() => feemXml.getItemsFlat()).not.toThrow();

    const flatItems = feemXml.getItemsFlat();

    expect(flatItems).toHaveLength(20);

    const flatItem1 = flatItems[0];
    expect(flatItem1).toEqual({
      uid: 'UID_1',
      psn: 'EX123',
      parentLine: ['PARENT_UNIT_1'],
      sid: 'S1',
    });
  });

  it('should be able to generate an XML file from its contents', () => {
    const xmlFilePath = join(__dirname, 'assets/shipment_items.xml');
    const xmlString = readFileSync(xmlFilePath, 'utf-8');
    const feemXml = new FeemXml();
    feemXml.fromXml(xmlString);
    expect(() => feemXml.toXml()).not.toThrow();
    const xml = feemXml.toXml();
    expect(xml).toContain('</Shipment>');
  });
});

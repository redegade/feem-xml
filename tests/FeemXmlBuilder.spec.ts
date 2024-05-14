import FeemXmlBuilder from '../src/FeemXmlBuilder';

describe('FeemXmlBuilder', () => {
  it('should build a Feem Shipment from directly setting values', () => {
    // Setup
    const sender = {
      Code: 'SenderCode',
      Name: 'SenderName',
      Address: 'SenderAddress',
      City: 'SenderCity',
      Country: 'SenderCountry',
    };
    const receiver = {
      Code: 'ReceiverCode',
      Name: 'ReceiverName',
      Address: 'ReceiverAddress',
      City: 'ReceiverCity',
      Country: 'ReceiverCountry',
    };
    const date = new Date('2021-01-01T00:00:00.000Z');

    // Act
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.setFileCreator('FileCreator');
    feemXmlBuilder.setMessageId('MessageId');
    feemXmlBuilder.setMessageTime(date);
    feemXmlBuilder.setDeliveryNoteNumber('DeliveryNoteNumber');
    feemXmlBuilder.setExpectedDeliveryDate(date);
    feemXmlBuilder.setDeliveryComment('DeliveryComment');
    feemXmlBuilder.setShipmentNumber('ShipmentNumber');
    feemXmlBuilder.setShipmentDate(date);
    feemXmlBuilder.setPurchaseOrderNumber('PurchaseOrderNumber');
    feemXmlBuilder.setSender(sender);
    feemXmlBuilder.setReceiver(receiver);
    const feemXml = feemXmlBuilder.build();

    // Assert
    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.attr.FileCreator).toEqual('FileCreator');
    expect(feemXml.shipment.MessageId).toEqual('MessageId');
    expect(feemXml.shipment.MessageTime).toEqual(date.toISOString());
    expect(feemXml.shipment.DeliveryNoteNumber).toEqual('DeliveryNoteNumber');
    expect(feemXml.shipment.ExpectedDeliveryDate).toEqual(date.toISOString());
    expect(feemXml.shipment.DeliveryComment).toEqual('DeliveryComment');
    expect(feemXml.shipment.ShipmentNumber).toEqual('ShipmentNumber');
    expect(feemXml.shipment.ShipmentDate).toEqual(date.toISOString());
    expect(feemXml.shipment.PurchaseOrderNumber).toEqual('PurchaseOrderNumber');
    expect(feemXml.shipment.Sender).toEqual(sender);
    expect(feemXml.shipment.Receiver).toEqual(receiver);
  });

  it('should handle adding many shippers', () => {
    // Setup
    const shipper1 = {
      Code: 'ShipperCode',
      Name: 'ShipperName',
    };
    const shipper2 = {
      Code: 'ShipperCode',
      Name: 'ShipperName',
    };

    // Act
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addShipper(shipper1);
    feemXmlBuilder.addShipper(shipper2);
    const feemXml = feemXmlBuilder.build();

    // Assert
    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.Shipper).toBeDefined();
    expect(feemXml.shipment.Shipper).toEqual({Shipper: [shipper1, shipper2]});
  });

  it('should handle adding products', () => {
    const feemXmlBuilder = new FeemXmlBuilder();

    feemXmlBuilder.addProduct(
      {
        ProducerProductCode: 'Code1',
        CustomerProductCode: 'Name1',
      },
      'US001'
    );
    feemXmlBuilder.addProduct(
      {
        ProducerProductCode: 'Code2',
        CustomerProductCode: 'Name2',
      },
      'US001'
    );
    feemXmlBuilder.addProduct(
      {
        ProducerProductCode: 'Code3',
        CustomerProductCode: 'Name3',
      },
      'US001'
    );

    const feemXml = feemXmlBuilder.build();

    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.SummaryItems).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toHaveLength(3);
  });

  it('should handle adding products from items', () => {
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addItem(
      {
        uid: 'UID_1',
        psn: 'US001',
        parentLine: [],
        sid: 'S1',
      },
      'Code1',
      'Name1'
    );

    const feemXml = feemXmlBuilder.build();

    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.SummaryItems).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toHaveLength(1);
  });

  it('should create Items if only items with no parents are added', () => {
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addItem(
      {
        uid: 'UID_1',
        psn: 'US001',
        parentLine: [],
      },
      'Code1',
      'Name1'
    );
    feemXmlBuilder.addItem(
      {
        uid: 'UID_2',
        psn: 'US001',
        parentLine: [],
      },
      'Code2',
      'Name2'
    );

    const feemXml = feemXmlBuilder.build();

    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.SummaryItems).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toHaveLength(2);

    expect(feemXml.shipment.Items).toBeDefined();
    expect(feemXml.shipment.Items?.Item).toBeDefined();
    expect(feemXml.shipment.Items?.Item).toHaveLength(2);
  });

  it('should create Units if items with parents are added', () => {
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addItem(
      {
        uid: 'UID_1',
        psn: 'US001',
        parentLine: ['Parent1'],
      },
      'Code1',
      'Name1'
    );
    feemXmlBuilder.addItem(
      {
        uid: 'UID_2',
        psn: 'US001',
        parentLine: ['Parent2'],
      },
      'Code2',
      'Name2'
    );

    const feemXml = feemXmlBuilder.build();

    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.SummaryItems).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toBeDefined();
    expect(feemXml.shipment.SummaryItems?.SummaryItem).toHaveLength(2);

    expect(feemXml.shipment.Units).toBeDefined();
    expect(feemXml.shipment.Units?.Unit).toBeDefined();
    expect(feemXml.shipment.Units?.Unit).toHaveLength(2);
  });

  it('should throw an error if items with parents are added after items with no parents', () => {
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addItem(
      {
        uid: 'UID_1',
        psn: 'US001',
        parentLine: [],
      },
      'Code1',
      'Name1'
    );

    expect(() =>
      feemXmlBuilder.addItem(
        {
          uid: 'UID_2',
          psn: 'US001',
          parentLine: ['Parent1'],
        },
        'Code2',
        'Name2'
      )
    ).toThrow();
  });

  it('should throw an error if items with no parents are added after items with parents', () => {
    const feemXmlBuilder = new FeemXmlBuilder();
    feemXmlBuilder.addItem(
      {
        uid: 'UID_1',
        psn: 'US001',
        parentLine: ['parent1'],
      },
      'Code1',
      'Name1'
    );

    expect(() =>
      feemXmlBuilder.addItem(
        {
          uid: 'UID_2',
          psn: 'US001',
          parentLine: [],
        },
        'Code2',
        'Name2'
      )
    ).toThrow();
  });

  it('should be able to recursively build a tree of units with arbitrary height', () => {
    const feemXmlBuilder = new FeemXmlBuilder();

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          feemXmlBuilder.addItem(
            {
              uid: `UID_${k}_${j}_${i}`,
              psn: 'US001',
              parentLine: [
                `Level0_Parent_${j}`,
                `Level1_Parent_${i}`,
                'Level2_Parent',
              ],
            },
            'Code1',
            'Name2'
          );
        }
      }
    }

    const feemXml = feemXmlBuilder.build();

    expect(feemXml.shipment).toBeDefined();
    expect(feemXml.shipment.Units).toBeDefined();
    expect(feemXml.shipment.Units?.Unit).toBeDefined();
    expect(feemXml.shipment.Units?.Unit).toHaveLength(1);

    const parent_constant = feemXml.shipment.Units?.Unit[0];
    expect(parent_constant).toBeDefined();
    expect(parent_constant?.attr.UID).toEqual('Level2_Parent');
    expect(parent_constant?.Units).toBeDefined();
    expect(parent_constant?.Units?.Unit).toBeDefined();
    expect(parent_constant?.Units?.Unit).toHaveLength(3);

    const parent_0 = parent_constant?.Units?.Unit[0];
    expect(parent_0).toBeDefined();
    expect(parent_0?.attr.UID).toEqual('Level1_Parent_0');
    expect(parent_0?.Units).toBeDefined();
    expect(parent_0?.Units?.Unit).toHaveLength(3);
    expect(parent_0?.Units?.Unit).toBeDefined();

    const parent_1 = parent_constant!.Units?.Unit[1];
    expect(parent_1).toBeDefined();
    expect(parent_1?.attr.UID).toEqual('Level1_Parent_1');
    expect(parent_1?.Units).toBeDefined();
    expect(parent_1?.Units?.Unit).toBeDefined();
    expect(parent_1?.Units?.Unit).toHaveLength(3);

    const parent_2 = parent_constant!.Units?.Unit[2];
    expect(parent_2).toBeDefined();
    expect(parent_2?.attr.UID).toEqual('Level1_Parent_2');
    expect(parent_2?.Units).toBeDefined();
    expect(parent_2?.Units?.Unit).toBeDefined();
    expect(parent_2?.Units?.Unit).toHaveLength(3);

    const parent_0_0 = parent_0!.Units?.Unit[0];
    expect(parent_0_0).toBeDefined();
    expect(parent_0_0?.attr.UID).toEqual('Level0_Parent_0');
    expect(parent_0_0?.Units).not.toBeDefined();
    expect(parent_0_0?.Items).toBeDefined();
    expect(parent_0_0?.Items?.Item).toBeDefined();
    expect(parent_0_0?.Items?.Item).toHaveLength(3);

    const parent_1_0 = parent_1!.Units?.Unit[1];
    expect(parent_1_0).toBeDefined();
    expect(parent_1_0?.attr.UID).toEqual('Level0_Parent_1');
    expect(parent_1_0?.Units).not.toBeDefined();
    expect(parent_1_0?.Items).toBeDefined();
    expect(parent_1_0?.Items?.Item).toBeDefined();
    expect(parent_1_0?.Items?.Item).toHaveLength(3);

    const parent_2_0 = parent_2!.Units?.Unit[2];
    expect(parent_2_0).toBeDefined();
    expect(parent_2_0?.attr.UID).toEqual('Level0_Parent_2');
    expect(parent_2_0?.Units).not.toBeDefined();
    expect(parent_2_0?.Items).toBeDefined();
    expect(parent_2_0?.Items?.Item).toBeDefined();
    expect(parent_2_0?.Items?.Item).toHaveLength(3);
  });
});

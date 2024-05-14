# Feem-xml

Feem-xml is a simple XML parser, validator, and builder for XML files that follow the FEEM Standard. The FEEM Standard is a simple XML schema that is used to define the structure of XML files that are used to electronically exchange track and trace data. More information about the FEEM Standard can be found at [http://feem-europe.org](http://feem-europe.org).

## Installation

```bash
npm install @redegade/feem-xml
```

## Usage

### Loading an XML file

Load the XML file into a string and then use the `FeemXml` class to parse the XML file.

```javascript
const {FeemXml} = require('@redegade/feem-xml');

const xmlString = `
<?xml version="1.0" encoding="utf-8"?>
<Shipment xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" FileVersion="1.0" FileType="FEEM-Std" FileCreator="FileCreator" Hash="MD5HashValue" />
`;

const feemXml = new FeemXml();
feemXml.fromXml(xmlString);

// Get items from the XML file
const explosiveItems = feemXml.getItemsFlat();
```

### Building an XML file

Use the `FeemXmlBuilder` class to add information to the XML file.

```javascript
const {FeemXmlBuilder} = require('@redegade/feem-xml');

const feemXmlBuilder = new FeemXmlBuilder();
feemXmlBuilder.setFileCreator('FileCreator');
feemXmlBuilder.setMessageId('MessageId');
feemXmlBuilder.setSender({
  code: 'Sender Code',
  name: 'Sender Name',
});
feemXmlBuilder.setReceiver({
  code: 'Receiver Code',
  name: 'Receiver Name',
});

feemXmlBuilder.addItem(
  {
    uid: 'UID_1',
    psn: 'US001',
    parentLine: [],
  },
  'Product Code',
  'Product Name'
);

// Build the Feem Xml File representation in memory
const feemXml = feemXmlBuilder.build();

// Get the XML string representation to save to a file, send to a server, etc.
const xmlString = feemXml.toXml();
```

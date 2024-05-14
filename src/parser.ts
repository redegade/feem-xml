import {
  X2jOptions,
  XMLBuilder,
  XMLParser,
  XmlBuilderOptions,
} from 'fast-xml-parser';

const options: X2jOptions = {
  attributeNamePrefix: '',
  attributesGroupName: 'attr',
  textNodeName: '#text',
  ignoreAttributes: false,
  allowBooleanAttributes: false,
  parseAttributeValue: false,
  trimValues: true,
  cdataPropName: '__cdata',
  stopNodes: ['parse-me-as-string'],
  preserveOrder: false,
  removeNSPrefix: false,
  parseTagValue: false,
  commentPropName: '',
  unpairedTags: [],
  alwaysCreateTextNode: false,
};

const FeemXmlToJsonParser = new XMLParser(options);

const builderOptions: XmlBuilderOptions = {
  attributeNamePrefix: '',
  attributesGroupName: 'attr',
  textNodeName: '#text',
  ignoreAttributes: false,
  cdataPropName: '__cdata',
  stopNodes: ['parse-me-as-string'],
  preserveOrder: false,
  commentPropName: '',
  unpairedTags: [],
  format: true, // formats the XML output instead of printing in single line
  suppressEmptyNode: true, // auto-closes the <Item /> tag for better readability
};

const FeemJsonToXmlParser = new XMLBuilder(builderOptions);

export {FeemXmlToJsonParser, FeemJsonToXmlParser};

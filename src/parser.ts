import {X2jOptions, XMLParser} from 'fast-xml-parser';

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

const FeemXmlParser = new XMLParser(options);

export default FeemXmlParser;

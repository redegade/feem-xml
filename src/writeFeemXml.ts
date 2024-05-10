import {XMLBuilder} from 'fast-xml-parser';
import FeemXml from './FeemXml';

export default function writeFeemXml(feemXml: FeemXml): void {
  const builder = new XMLBuilder();
  return builder.build({
    Shipment: feemXml.shipment,
  });
}

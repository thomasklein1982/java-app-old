import { Java } from "../java";

export function BooleanLiteral(node,source,scope,errors){
  return {
    code: source.getText(node),
    type: Java.datatypes.boolean
  };
}
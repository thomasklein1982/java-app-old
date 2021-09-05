import { Java } from "../java";

export function StringLiteral(node,source,scope){
  return {
    code: source.getText(node),
    type: Java.datatypes.String
  };
}
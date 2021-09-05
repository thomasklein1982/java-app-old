import { Java } from "../java";

export function IntegerLiteral(node,source,scope,errors){
  return {
    code: source.getText(node),
    type: Java.datatypes.int
  };
}
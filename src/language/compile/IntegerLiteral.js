import { Java } from "../java";

export function IntegerLiteral(node,source,scope){
  return {
    code: source.getText(node),
    type: Java.datatypes.int
  };
}
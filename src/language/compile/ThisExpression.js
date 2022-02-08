import { Type } from "../../classes/Type";
import { Java } from "../java";

export function ThisExpression(node,source,scope){
  return {
    code: "this",
    type: new Type(scope.method.clazz,0)
  };
}
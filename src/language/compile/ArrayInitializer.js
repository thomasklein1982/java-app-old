import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ArrayInitializer(node,source,scope,type){
  node=node.firstChild;
  node=node.nextSibling;
  console.log(node);
  let code="[";
  let subType=new Type(type.baseType,type.dimension-1);
  while(node && node.name!=="}" && !node.type.isError){
    let a=CompileFunctions.get(node,source)(node,source,scope,subType);
    type.autoCastValue(a);
    code+=a.code;
    node=node.nextSibling;
    if(node.name===","){
      code+=",";
      node=node.nextSibling;
    }
  }
  code+="]";
  return {
    code: code,
    type: subType
  };
}